import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';
import type { Product } from '$lib/server/domain/entities/product.entity';

// ================================
// 🏗️ DOMAIN TYPES (following Clean Architecture)
// ================================

export interface CartItem {
	product: Product;
	quantity: number;
	addedAt: Date;
}

export interface CartState {
	items: CartItem[];
	isLoading: boolean;
	error: string | null;
	lastUpdated: Date;
}

export interface CartTotals {
	itemCount: number;
	subtotal: number; // in kopiyky
	subtotalUAH: number; // in UAH (for display)
	tax: number;
	shipping: number;
	total: number;
}

// ================================
// 🎯 BUSINESS LOGIC (Domain Layer in Stores)
// ================================

class CartService {
	static calculateTotals(items: CartItem[]): CartTotals {
		const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
		const subtotal = items.reduce(
			(sum, item) => sum + item.product.price.getKopiyky() * item.quantity,
			0
		);
		const subtotalUAH = subtotal / 100; // Convert kopiyky to UAH

		// Business rules
		const tax = Math.round(subtotal * 0.2); // 20% VAT
		const shipping = subtotalUAH >= 1000 ? 0 : 5000; // Free shipping over 1000 UAH
		const total = subtotal + tax + shipping;

		return {
			itemCount,
			subtotal,
			subtotalUAH,
			tax,
			shipping,
			total
		};
	}

	static findCartItem(items: CartItem[], productId: string): CartItem | undefined {
		return items.find((item) => item.product.id.getValue() === productId);
	}

	static validateQuantity(quantity: number): void {
		if (quantity < 0) throw new Error('Quantity cannot be negative');
		if (quantity > 99) throw new Error('Maximum quantity is 99');
	}
}

// ================================
// 🏪 CART STORE (Application Layer)
// ================================

function createCartStore() {
	const initialState: CartState = {
		items: [],
		isLoading: false,
		error: null,
		lastUpdated: new Date()
	};

	const { subscribe, set, update } = writable<CartState>(initialState);

	// 💾 Persistence layer
	function saveToStorage(state: CartState) {
		if (browser) {
			try {
				const persistData = {
					items: state.items.map((item) => ({
						productId: item.product.id.getValue(),
						quantity: item.quantity,
						addedAt: item.addedAt.toISOString(),
						// Store minimal product data to avoid stale data
						product: {
							id: item.product.id.getValue(),
							name: item.product.name,
							price: item.product.price,
							imageUrls: item.product.imageUrls
						}
					})),
					lastUpdated: state.lastUpdated.toISOString()
				};
				localStorage.setItem('cart-state', JSON.stringify(persistData));
			} catch (error) {
				console.error('Failed to save cart to storage:', error);
			}
		}
	}

	function loadFromStorage(): CartState {
		if (!browser) return initialState;

		try {
			const stored = localStorage.getItem('cart-state');
			if (!stored) return initialState;

			const parsed = JSON.parse(stored);
			return {
				...initialState,
				items: parsed.items.map((item: any) => ({
					product: item.product,
					quantity: item.quantity,
					addedAt: new Date(item.addedAt)
				})),
				lastUpdated: new Date(parsed.lastUpdated)
			};
		} catch (error) {
			console.error('Failed to load cart from storage:', error);
			return initialState;
		}
	}

	// 🎬 Initialize from storage
	if (browser) {
		set(loadFromStorage());
	}

	return {
		subscribe,

		// 🛒 CART ACTIONS (Use Cases)
		addItem: (product: Product, quantity: number = 1) => {
			try {
				CartService.validateQuantity(quantity);

				update((state) => {
					const existingItem = CartService.findCartItem(state.items, product.id.getValue());

					if (existingItem) {
						// Update existing item
						const newQuantity = existingItem.quantity + quantity;
						CartService.validateQuantity(newQuantity);

						const updatedItems = state.items.map((item) =>
							item.product.id.getValue() === product.id.getValue()
								? { ...item, quantity: newQuantity }
								: item
						);

						const newState = {
							...state,
							items: updatedItems,
							lastUpdated: new Date(),
							error: null
						};

						saveToStorage(newState);
						return newState;
					} else {
						// Add new item
						const newItem: CartItem = {
							product,
							quantity,
							addedAt: new Date()
						};

						const newState = {
							...state,
							items: [...state.items, newItem],
							lastUpdated: new Date(),
							error: null
						};

						saveToStorage(newState);
						return newState;
					}
				});
			} catch (error) {
				update((state) => ({
					...state,
					error: error instanceof Error ? error.message : 'Failed to add item'
				}));
			}
		},

		updateQuantity: (productId: string, quantity: number) => {
			try {
				CartService.validateQuantity(quantity);

				update((state) => {
					if (quantity === 0) {
						// Remove item if quantity is 0
						const newState = {
							...state,
							items: state.items.filter((item) => item.product.id.getValue() !== productId),
							lastUpdated: new Date(),
							error: null
						};
						saveToStorage(newState);
						return newState;
					}

					const updatedItems = state.items.map((item) =>
						item.product.id.getValue() === productId ? { ...item, quantity } : item
					);

					const newState = {
						...state,
						items: updatedItems,
						lastUpdated: new Date(),
						error: null
					};

					saveToStorage(newState);
					return newState;
				});
			} catch (error) {
				update((state) => ({
					...state,
					error: error instanceof Error ? error.message : 'Failed to update quantity'
				}));
			}
		},

		removeItem: (productId: string) => {
			update((state) => {
				const newState = {
					...state,
					items: state.items.filter((item) => item.product.id.getValue() !== productId),
					lastUpdated: new Date(),
					error: null
				};

				saveToStorage(newState);
				return newState;
			});
		},

		clear: () => {
			const newState = {
				...initialState,
				lastUpdated: new Date()
			};
			set(newState);
			saveToStorage(newState);
		},

		clearError: () => {
			update((state) => ({ ...state, error: null }));
		}
	};
}

// ================================
// 🏪 STORE INSTANCES & DERIVED STORES
// ================================

export const cartStore = createCartStore();

// 📊 Derived stores for computed values (following SOLID principles)
export const cartItems = derived(cartStore, ($cart) => $cart.items);
export const cartTotals = derived(cartStore, ($cart) => CartService.calculateTotals($cart.items));
export const cartItemCount = derived(cartTotals, ($totals) => $totals.itemCount);
export const cartIsEmpty = derived(cartItems, ($items) => $items.length === 0);
export const cartError = derived(cartStore, ($cart) => $cart.error);

// 🔍 Utility derived stores
export const cartProductIds = derived(
	cartItems,
	($items) => new Set($items.map((item) => item.product.id.getValue()))
);

export const isProductInCart = derived(
	cartProductIds,
	($productIds) => (productId: string) => $productIds.has(productId)
);
