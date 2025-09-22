<script lang="ts">
	import { cartStore, cartItems, cartTotals, cartIsEmpty } from '$lib/stores/cart.store';
	import { isAuthenticated } from '$lib/auth/supabase-store';
	import { goto } from '$app/navigation';
	import { notificationStore } from '$lib/stores/notifications';
	import { createPageTranslations } from '$lib/i18n/store';
	import { browser } from '$app/environment';
	import { onMount, onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import { writable } from 'svelte/store';
	import SEO from '$lib/components/SEO.svelte';
	import AddressModal from '$lib/components/AddressModal.svelte';
	import type { PageData } from './$types';
	import type { SupportedLocale } from '$lib/i18n/types';


	// Create page translations
	const pageTranslations = createPageTranslations();

	// Get data from server
	const { data }: { data: PageData } = $props();

	// User information fields
	let firstName = '';
	let lastName = '';
	let phoneNumber = '';
	let selectedAddress: string | null = null;
	let deliveryAddresses = data?.deliveryAddresses || [];

	console.log('[Cart Page Client] Server data received:', {
		deliveryAddressesCount: deliveryAddresses.length,
		deliveryAddresses: deliveryAddresses.map((addr) => ({ id: addr.id, name: addr.name }))
	});

	let showAddressModal = false;

	// Validation state
	let validationErrors = {
		firstName: false,
		lastName: false,
		phoneNumber: false,
		selectedAddress: false
	};

	// Promo code state
	let promoCodeInput = '';
	let appliedPromoCode: { code: string; discount: number; description?: string } | null = null;
	let promoCodeLoading = false;
	let promoCodeError = '';

	// Create a derived store for discounted total
	const discountedTotal = writable(0);
	$effect(() => {
		const baseTotal = $cartTotals.total;
		const discount = appliedPromoCode?.discount || 0;
		$discountedTotal = Math.max(0, baseTotal - discount);
	});

	// Handle quantity changes
	function updateQuantity(productId: string, newQuantity: number) {
		if (newQuantity <= 0) {
			cartStore.removeItem(productId);
			if ($pageTranslations) {
				notificationStore.success(String($pageTranslations.t('cart.notifications.item_removed')));
			}
		} else {
			cartStore.updateQuantity(productId, newQuantity);
		}
	}

	// Handle item removal
	function removeItem(productId: string) {
		cartStore.removeItem(productId);
		if ($pageTranslations) {
			notificationStore.success(String($pageTranslations.t('cart.notifications.item_removed')));
		}
	}

	// Reset validation errors
	function resetValidationErrors() {
		validationErrors = {
			firstName: false,
			lastName: false,
			phoneNumber: false,
			selectedAddress: false
		};
	}

	// Handle checkout
	async function handleCheckout() {
		if (!$isAuthenticated) {
			// Show notification and redirect to login
			if ($pageTranslations) {
				notificationStore.info(String($pageTranslations.t('cart.notifications.auth_required.message')), {
					title: String($pageTranslations.t('cart.notifications.auth_required.title')),
					duration: 8000,
					actions: [
						{
							label: String($pageTranslations.t('cart.notifications.auth_required.sign_in')),
							action: () => goto('/login'),
							style: 'primary'
						},
						{
							label: String($pageTranslations.t('cart.notifications.auth_required.create_account')),
							action: () => goto('/login'),
							style: 'secondary'
						}
					]
				});
			}
			return;
		}

		// Reset previous validation errors
		resetValidationErrors();

		// Validate fields and set error states
		let hasErrors = false;

		if (!firstName.trim()) {
			validationErrors.firstName = true;
			hasErrors = true;
		}

		if (!lastName.trim()) {
			validationErrors.lastName = true;
			hasErrors = true;
		}

		if (!phoneNumber.trim()) {
			validationErrors.phoneNumber = true;
			hasErrors = true;
		}

		if (!selectedAddress) {
			validationErrors.selectedAddress = true;
			hasErrors = true;
		}

		if (hasErrors) {
			if ($pageTranslations) {
				notificationStore.error(String($pageTranslations.t('cart.checkout.errors.fillRequiredFields')));
			}
			return;
		}

		// Update user profile with form data
		const profileUpdated = await updateUserProfile();
		if (!profileUpdated) {
			return; // Error message already shown in updateUserProfile
		}

		// Create order
		const orderCreated = await createOrder();
		if (!orderCreated) {
			return; // Error message already shown in createOrder
		}

		// Clear saved form data after successful checkout
		clearFormData();

		// Navigate to checkout page with order success flag
		goto('/checkout?success=true');
	}

	// Continue shopping
	function continueShopping() {
		goto('/products');
	}

	// Debounce timer for localStorage saves
	let saveTimer: ReturnType<typeof setTimeout> | null = null;

	// Prevent multiple load calls
	let isLoadingData = false;

	// Handle field changes to clear validation errors
	function handleFieldChange(field: keyof typeof validationErrors) {
		if (validationErrors[field]) {
			validationErrors = { ...validationErrors, [field]: false };
		}
		// Save form data to localStorage with debouncing
		saveFormData();
	}

	// Save form data to localStorage with debouncing
	function saveFormData() {
		if (browser) {
			// Clear existing timer
			if (saveTimer) {
				clearTimeout(saveTimer);
			}

			// Debounce localStorage writes to avoid excessive calls
			saveTimer = setTimeout(() => {
				const formData = {
					firstName,
					lastName,
					phoneNumber,
					selectedAddress,
					timestamp: Date.now()
				};
				localStorage.setItem('cart-form-data', JSON.stringify(formData));
				console.log('[Cart] Form data saved to localStorage');
				saveTimer = null;
			}, 300); // 300ms debounce
		}
	}

	// Save immediately on critical field changes
	function saveFormDataImmediate() {
		if (browser) {
			const formData = {
				firstName,
				lastName,
				phoneNumber,
				selectedAddress,
				timestamp: Date.now()
			};
			localStorage.setItem('cart-form-data', JSON.stringify(formData));
			console.log('[Cart] Form data saved immediately to localStorage');
		}
	}

	// Load form data from localStorage
	function loadFormData() {
		if (!browser || isLoadingData) {
			return; // Prevent multiple simultaneous loads
		}

		isLoadingData = true;

		try {
			const saved = localStorage.getItem('cart-form-data');
			if (saved) {
				const formData = JSON.parse(saved);
				const age = Date.now() - formData.timestamp;
				const maxAge = 24 * 60 * 60 * 1000; // 24 hours

				if (age < maxAge) {
					// Load saved data with small delay to ensure reactivity
					setTimeout(() => {
						firstName = formData.firstName || '';
						lastName = formData.lastName || '';
						phoneNumber = formData.phoneNumber || '';
						selectedAddress = formData.selectedAddress || null;

						console.log('[Cart] Form data loaded from localStorage:', {
							firstName: !!firstName,
							lastName: !!lastName,
							phoneNumber: !!phoneNumber,
							selectedAddress: !!selectedAddress,
							age: Math.round(age / 1000 / 60) + ' minutes ago'
						});

						isLoadingData = false;
					}, 50); // Small delay for reactivity
				} else {
					// Clear old data
					localStorage.removeItem('cart-form-data');
					console.log(
						'[Cart] Old form data cleared (was',
						Math.round(age / 1000 / 60 / 60),
						'hours old)'
					);
					isLoadingData = false;
				}
			} else {
				console.log('[Cart] No saved form data found');
				isLoadingData = false;
			}
		} catch (error) {
			console.warn('[Cart] Failed to load cart form data:', error);
			localStorage.removeItem('cart-form-data');
			isLoadingData = false;
		}
	}

	// Clear saved form data
	function clearFormData() {
		if (browser) {
			localStorage.removeItem('cart-form-data');
			// Reset form fields
			firstName = '';
			lastName = '';
			phoneNumber = '';
			selectedAddress = null;
			console.log('[Cart] Form data cleared');
		}
	}


	// Handle address modal open
	function openAddressModal() {
		showAddressModal = true;
	}

	// Handle address modal close
	function handleAddressModalClose() {
		showAddressModal = false;
	}

	// Create order from cart
	async function createOrder(): Promise<boolean> {
		try {
			// Find selected delivery address
			const selectedAddressData = deliveryAddresses.find((addr) => addr.id === selectedAddress);

			// Prepare order items from cart
			const orderItems = $cartItems.map((item) => ({
				productId: item.product.id.getValue(),
				productName: item.product.name.getUkrainian(),
				quantity: item.quantity,
				price: item.product.price.getKopiyky(),
				total: item.product.price.getKopiyky() * item.quantity,
				size: item.product.size,
				flavor: item.product.flavor
			}));

			const orderData = {
				items: orderItems,
				total: appliedPromoCode ? $discountedTotal : $cartTotals.total,
				originalTotal: appliedPromoCode ? $cartTotals.total : undefined,
				deliveryAddress: selectedAddressData || null,
				notes: '', // Can be extended later for customer notes
				// Customer information
				customerName: `${firstName.trim()} ${lastName.trim()}`.trim(),
				customerPhone: phoneNumber.trim(),
				// Promo code information
				promoCode: appliedPromoCode
					? {
							code: appliedPromoCode.code,
							discount: appliedPromoCode.discount,
							description: appliedPromoCode.description
						}
					: null
			};

			console.log('[CART] Creating order:', orderData);

			const response = await fetch('/api/orders', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(orderData)
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || 'Failed to create order');
			}

			console.log('[CART] Order created successfully:', result.data);

			// Store order info in localStorage for checkout page
			if (browser) {
				const orderDataToStore = {
					orderId: result.data.id,
					orderData: result.data,
					timestamp: Date.now()
				};

				console.log('[CART] Storing order data in localStorage:', orderDataToStore);
				localStorage.setItem('lastOrder', JSON.stringify(orderDataToStore));

				// Verify data was stored
				const storedData = localStorage.getItem('lastOrder');
				console.log('[CART] Verification - stored data:', storedData);
				console.log('[CART] Verification - parsed data:', JSON.parse(storedData || '{}'));
			}

			return true;
		} catch (error) {
			console.error('[CART] Failed to create order:', error);
			if ($pageTranslations) {
				notificationStore.error(
					String($pageTranslations.t('cart.checkout.errors.orderCreationFailed')) ||
						'Failed to create order. Please try again.'
				);
			}
			return false;
		}
	}

	// Handle address save
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async function handleAddressSave(event: CustomEvent<{ addressData: { name: string; isDefault?: boolean; [key: string]: any } }>) {
		const { addressData } = event.detail;

		try {
			const response = await fetch('/api/user/address', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(addressData)
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || 'Failed to save address');
			}

			// Refresh delivery addresses
			const updatedAddresses = [...deliveryAddresses, result.address];
			deliveryAddresses = updatedAddresses;

			// Auto-select the new address if it's the first one or marked as default
			if (updatedAddresses.length === 1 || addressData.isDefault) {
				selectedAddress = result.address.id;
				saveFormData();
			}

			showAddressModal = false;

			if ($pageTranslations) {
				notificationStore.success(String($pageTranslations.t('profile.addressSaved')));
			}
		} catch (error) {
			console.error('Failed to save address:', error);
			if ($pageTranslations) {
				notificationStore.error(
					String($pageTranslations.t('profile.address.saveError')) ||
						'Failed to save address. Please try again.'
				);
			}
		}
	}

	// Update user profile with form data
	async function updateUserProfile() {
		try {
			const response = await fetch('/api/user/profile', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					firstName,
					lastName,
					phoneNumber
				})
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || 'Failed to update profile');
			}

			console.log('User profile updated successfully');
			return true;
		} catch (error) {
			console.error('Failed to update user profile:', error);
			if ($pageTranslations) {
				notificationStore.error(String($pageTranslations.t('cart.checkout.errors.profileUpdateFailed')));
			}
			return false;
		}
	}

	// Promo code functions
	async function applyPromoCode() {
		if (!promoCodeInput.trim()) {
			promoCodeError = 'Please enter a promo code';
			return;
		}

		if (!$isAuthenticated) {
			promoCodeError = 'Please log in to use promo codes';
			return;
		}

		promoCodeLoading = true;
		promoCodeError = '';

		try {
			const response = await fetch('/api/promo-codes', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					action: 'validate',
					code: promoCodeInput.trim(),
					cartTotal: $cartTotals.total / 100 // Convert to UAH
				})
			});

			const result = await response.json();

			if (result.success) {
				appliedPromoCode = {
					code: promoCodeInput.toUpperCase(),
					discount: result.discount * 100, // Convert to kopiyky
					description: result.promoCode?.description
				};
				promoCodeInput = '';
				promoCodeError = '';

				if ($pageTranslations) {
					notificationStore.success(result.message || 'Promo code applied successfully!');
				}
			} else {
				promoCodeError = result.message || 'Invalid promo code';
				appliedPromoCode = null;
			}
		} catch (error) {
			console.error('Promo code validation error:', error);
			promoCodeError = 'Failed to validate promo code. Please try again.';
			appliedPromoCode = null;
		} finally {
			promoCodeLoading = false;
		}
	}

	function removePromoCode() {
		appliedPromoCode = null;
		promoCodeError = '';
		promoCodeInput = '';

		if ($pageTranslations) {
			notificationStore.info('Promo code removed');
		}
	}

	async function handlePromoCodeKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			await applyPromoCode();
		}
	}

	// Format price in UAH
	function formatPrice(kopiyky: number): string {
		return `${(kopiyky / 100).toFixed(2)} ₴`;
	}

	// Load form data on component mount and page navigation
	onMount(() => {
		loadFormData();
	});

	// Reactive block to reload data when navigating to this page
	$effect(() => {
		// This will trigger when the page store changes (navigation)
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		$page.url.pathname;
		loadFormData();
	});

	// Reactive block to ensure form fields update in UI
	$effect(() => {
		// Force reactivity update for form fields
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		[firstName, lastName, phoneNumber, selectedAddress];

		// This will trigger whenever any form field changes
		console.log('[Cart] Form fields updated:', {
			firstName: !!firstName,
			lastName: !!lastName,
			phoneNumber: !!phoneNumber,
			selectedAddress: !!selectedAddress
		});
	});

	// Cleanup timer on component destroy
	onDestroy(() => {
		if (saveTimer) {
			clearTimeout(saveTimer);
		}
	});

	$effect(() => {
		// Update delivery addresses when data changes
		deliveryAddresses = data?.deliveryAddresses || [];

		// Auto-select address if there's only one and none selected
		if (deliveryAddresses.length === 1 && !selectedAddress) {
			selectedAddress = deliveryAddresses[0].id;
			saveFormDataImmediate(); // Save the auto-selected address immediately
		}
	});
</script>

{#if $pageTranslations}
	<SEO
		title={String($pageTranslations.t('cart.meta.title'))}
		description={String($pageTranslations.t('cart.meta.description'))}
	/>

	<main class="cart-page">
		<div class="cart-container">
			<h1 class="cart-title">{$pageTranslations.t('cart.title')}</h1>

			{#if $cartIsEmpty}
				<!-- Empty Cart -->
				<div class="empty-cart">
					<div class="empty-cart-icon">
						<svg
							class="h-16 w-16 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2 8m2-8h10m0 0v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6z"
							></path>
						</svg>
					</div>
					<p class="cart-empty">{$pageTranslations.t('cart.empty.title')}</p>
					<p class="cart-hint">{$pageTranslations.t('cart.empty.description')}</p>
					<button class="continue-shopping-btn" on:click={continueShopping}>
						{$pageTranslations.t('cart.empty.continue_shopping')}
					</button>
				</div>
			{:else}
				<!-- Cart Layout: 3/4 Products + 1/4 Summary -->

				<div class="cart-layout">
					<!-- Left Column: Cart Items (3/4) -->
					<div class="cart-items-column">
						<div class="cart-items-container">
							<h2 class="section-title">
								{$pageTranslations.t('cart.items.title')}
								({$cartTotals.itemCount}
								{$cartTotals.itemCount === 1 ? 'товар' : 'товарів'})
							</h2>

							<div class="cart-items-list">
								{#each $cartItems as item (item.product.id.getValue())}
									<div class="cart-item">
										<!-- Product Image -->
										<div class="item-image">
											{#if item.product.imageUrls.length > 0}
												<img
													src={item.product.imageUrls[0]}
													alt={item.product.name.getUkrainian()}
												/>
											{:else}
												<div class="no-image">📦</div>
											{/if}
										</div>

										<!-- Product Details -->
										<div class="item-details">
											<h3 class="item-name">{item.product.name.getUkrainian()}</h3>
											<div class="item-specs">
												<span class="spec-item">{item.product.size}</span>
												<span class="spec-divider">•</span>
												<span class="spec-item">{item.product.flavor}</span>
											</div>
											<p class="item-price">
												{formatPrice(item.product.price.getKopiyky())}
												{$pageTranslations.t('cart.items.each_price')}
											</p>
										</div>

										<!-- Quantity Controls -->
										<div class="item-quantity">
											<div
												class="quantity-controls"
												role="group"
												aria-label={String($pageTranslations.t('cart.items.quantity_label')) ||
													'Quantity controls'}
											>
												<button
													class="quantity-btn decrease"
													on:click={() =>
														updateQuantity(item.product.id.getValue(), item.quantity - 1)}
													disabled={item.quantity <= 1}
													title={String($pageTranslations.t('cart.items.decrease_quantity')) || ''}
												>
													-
												</button>
												<input
													type="number"
													class="quantity-input"
													value={item.quantity}
													min="1"
													max="99"
													on:change={(e) => {
														const value = parseInt(e.currentTarget.value) || 1;
														updateQuantity(
															item.product.id.getValue(),
															Math.max(1, Math.min(99, value))
														);
													}}
												/>
												<button
													class="quantity-btn increase"
													on:click={() =>
														updateQuantity(item.product.id.getValue(), item.quantity + 1)}
													disabled={item.quantity >= 99}
													title={String($pageTranslations.t('cart.items.increase_quantity')) || ''}
												>
													+
												</button>
											</div>
										</div>

										<!-- Item Total -->
										<div class="item-total">
											<p class="total-label">{$pageTranslations.t('cart.items.total_label')}</p>
											<p class="total-price">
												{formatPrice(item.product.price.getKopiyky() * item.quantity)}
											</p>
										</div>

										<!-- Remove Button -->
										<button
											class="remove-btn"
											on:click={() => removeItem(item.product.id.getValue())}
											title={String($pageTranslations.t('cart.items.remove_item')) || ''}
											aria-label={String($pageTranslations.t('cart.items.remove_item')) || 'Remove item'}
										>
											<svg
												width="16"
												height="16"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-width="2"
											>
												<path d="M18 6L6 18M6 6l12 12"></path>
											</svg>
										</button>
									</div>
								{/each}
							</div>
						</div>

						<!-- Customer Information and Address Picker -->
						{#if $isAuthenticated}
							<div class="customer-info-section">
								<h2 class="section-title">{$pageTranslations.t('cart.checkout.customerInfo')}</h2>
								<div class="customer-info-form">
									<div class="form-row">
										<div class="form-group">
											<label for="firstName">{$pageTranslations.t('cart.checkout.firstName')}</label
											>
											<input
												type="text"
												id="firstName"
												class="form-input"
												class:error={validationErrors.firstName}
												bind:value={firstName}
												placeholder={String($pageTranslations.t('cart.checkout.firstName')) || ''}
												on:input={() => {
													handleFieldChange('firstName');
													saveFormData();
												}}
												on:change={saveFormDataImmediate}
												on:blur={saveFormDataImmediate}
											/>
										</div>
										<div class="form-group">
											<label for="lastName">{$pageTranslations.t('cart.checkout.lastName')}</label>
											<input
												type="text"
												id="lastName"
												class="form-input"
												class:error={validationErrors.lastName}
												bind:value={lastName}
												placeholder={String($pageTranslations.t('cart.checkout.lastName')) || ''}
												on:input={() => {
													handleFieldChange('lastName');
													saveFormData();
												}}
												on:change={saveFormDataImmediate}
												on:blur={saveFormDataImmediate}
											/>
										</div>
									</div>
									<div class="form-group">
										<label for="phoneNumber"
											>{$pageTranslations.t('cart.checkout.phoneNumber')}</label
										>
										<input
											type="tel"
											id="phoneNumber"
											class="form-input"
											class:error={validationErrors.phoneNumber}
											bind:value={phoneNumber}
											placeholder={String($pageTranslations.t('cart.checkout.phoneNumber')) || ''}
											on:input={() => {
												handleFieldChange('phoneNumber');
												saveFormData();
											}}
											on:change={saveFormDataImmediate}
											on:blur={saveFormDataImmediate}
										/>
									</div>

									<div class="form-group">
										<label for="deliveryAddress"
											>{$pageTranslations.t('cart.checkout.deliveryAddress')}</label
										>

										{#if deliveryAddresses.length > 0}
											<select
												id="deliveryAddress"
												class="form-input"
												class:error={validationErrors.selectedAddress}
												bind:value={selectedAddress}
												on:change={() => {
													handleFieldChange('selectedAddress');
													saveFormDataImmediate();
												}}
											>
												{#each deliveryAddresses as address (address.id)}
													<option value={address.id}
														>{address.name || address.npCityFullName}</option
													>
												{/each}
											</select>
										{:else}
											<div class="no-address-message">
												<p>{$pageTranslations.t('cart.checkout.noAddressesAvailable')}</p>
												<button
													type="button"
													class="add-address-btn primary"
													on:click={() => {
														console.log('Primary button clicked');
														openAddressModal();
													}}
												>
													{$pageTranslations.t('cart.checkout.addNewAddress')}
												</button>
											</div>
										{/if}

										{#if deliveryAddresses.length > 0}
											<button
												type="button"
												class="add-address-btn"
												on:click={() => {
													console.log('Secondary button clicked');
													openAddressModal();
												}}
											>
												{$pageTranslations.t('cart.checkout.addNewAddress')}
											</button>
										{/if}
									</div>
								</div>
							</div>
						{/if}
					</div>

					<!-- Right Column: Order Summary (1/4) -->
					<div class="cart-summary-column">
						<div class="cart-summary-container">
							<h2 class="summary-title">{$pageTranslations.t('cart.summary.title')}</h2>

							<!-- Summary Details -->
							<div class="summary-details">
								<div class="summary-line">
									<span class="summary-label">
										{$pageTranslations.t('cart.summary.subtotal')}
										({$cartTotals.itemCount}
										{$cartTotals.itemCount === 1 ? 'товар' : 'товарів'}):
									</span>
									<span class="summary-value">{formatPrice($cartTotals.subtotal)}</span>
								</div>
								<!-- Tax field hidden as requested -->
								<!-- <div class="summary-line">
								<span class="summary-label">{$pageTranslations.t('cart.summary.tax')}:</span>
								<span class="summary-value">{formatPrice($cartTotals.tax)}</span>
							</div> -->
								<div class="summary-line">
									<span class="summary-label">{$pageTranslations.t('cart.summary.shipping')}:</span>
									<span class="summary-value">
										{#if $cartTotals.subtotalUAH >= $cartTotals.freeShippingThreshold}
											<span class="free-label"
												>{$pageTranslations.t('cart.summary.shipping_free')}</span
											>
										{:else}
											<span class="carrier-label"
												>{$pageTranslations.t('cart.summary.shipping_carrier')}</span
											>
										{/if}
									</span>
								</div>

								{#if $cartTotals.subtotalUAH < $cartTotals.freeShippingThreshold}
									<div class="free-shipping-notice">
										<p class="notice-text">
											{#if $pageTranslations.locale === 'en'}
												💡 Free shipping on orders over <strong>$800</strong>!
											{:else}
												💡 Безкоштовна доставка від <strong>800₴</strong>!
											{/if}
										</p>
									</div>
								{/if}

								<div class="summary-divider"></div>

								<!-- Promo Code Section -->
								{#if $isAuthenticated}
									<div class="promo-code-section">
										{#if appliedPromoCode}
											<div class="applied-promo">
												<div class="promo-info">
													<span class="promo-code">🎉 {appliedPromoCode.code}</span>
													{#if appliedPromoCode.description}
														<span class="promo-description">{appliedPromoCode.description}</span>
													{/if}
													<span class="promo-discount"
														>-{formatPrice(appliedPromoCode.discount)}</span
													>
												</div>
												<button
													class="remove-promo-btn"
													on:click={removePromoCode}
													aria-label="Remove promo code"
												>
													✕
												</button>
											</div>
										{:else}
											<div class="promo-input-group">
												<input
													type="text"
													placeholder="Enter promo code"
													bind:value={promoCodeInput}
													on:keydown={handlePromoCodeKeydown}
													disabled={promoCodeLoading}
													class="promo-input"
													class:error={promoCodeError}
												/>
												<button
													class="apply-promo-btn"
													on:click={applyPromoCode}
													disabled={promoCodeLoading || !promoCodeInput.trim()}
												>
													{#if promoCodeLoading}
														⏳
													{:else}
														Apply
													{/if}
												</button>
											</div>
											{#if promoCodeError}
												<p class="promo-error">{promoCodeError}</p>
											{/if}
										{/if}
									</div>

									<div class="summary-divider"></div>
								{/if}

								<div class="summary-total">
									<span class="total-label">
										{$pageTranslations.t('cart.summary.total')}
										{#if appliedPromoCode}
											<span class="original-total">({formatPrice($cartTotals.total)})</span>
										{/if}
										:
									</span>
									<span class="total-value">
										{#if appliedPromoCode}
											{formatPrice($discountedTotal)}
										{:else}
											{formatPrice($cartTotals.total)}
										{/if}
									</span>
								</div>
							</div>

							<!-- Action Buttons -->
							<div class="summary-actions">
								<button class="checkout-btn" on:click={handleCheckout}>
									{#if $isAuthenticated}
										{$pageTranslations.t('cart.summary.checkout_authenticated')}
									{:else}
										{$pageTranslations.t('cart.summary.checkout_sign_in')}
									{/if}
								</button>

								<button class="continue-shopping-btn secondary" on:click={continueShopping}>
									{$pageTranslations.t('cart.summary.continue_shopping')}
								</button>
							</div>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</main>
{:else}
	<!-- Loading state while translations are initializing -->
	<main class="cart-page">
		<div class="cart-container">
			<h1 class="cart-title">Loading...</h1>
		</div>
	</main>
{/if}

<!-- Address Modal -->
<AddressModal
	show={showAddressModal}
	on:save={handleAddressSave}
	on:close={handleAddressModalClose}
/>

<style>
	/* Base Page Styles */
	.cart-page {
		min-height: calc(100vh - 160px);
		background: #f8f9fa;
		padding: 32px 0;
	}

	.cart-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 20px;
	}

	.cart-title {
		font-family: 'Nunito', sans-serif;
		font-size: 32px;
		font-weight: 700;
		color: #1a1a1a;
		text-align: center;
		margin-bottom: 40px;
	}

	/* Empty Cart Styles */
	.empty-cart {
		text-align: center;
		padding: 80px 20px;
		background: white;
		border-radius: 16px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
		max-width: 500px;
		margin: 0 auto;
	}

	.empty-cart-icon {
		margin-bottom: 24px;
		display: flex;
		justify-content: center;
		opacity: 0.6;
	}

	.cart-empty {
		font-family: 'Nunito', sans-serif;
		font-size: 24px;
		font-weight: 600;
		color: #333;
		margin-bottom: 12px;
	}

	.cart-hint {
		font-family: 'Nunito', sans-serif;
		font-size: 16px;
		color: #666;
		margin-bottom: 32px;
	}

	/* Main Cart Layout - Adjusted for better button fitting */
	.cart-layout {
		display: grid;
		grid-template-columns: 2.5fr 1.5fr;
		gap: 32px;
		align-items: start;
	}

	/* Left Column - Cart Items (3/4) */
	.cart-items-column {
		min-height: 400px;
	}

	.cart-items-container {
		background: white;
		border-radius: 16px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
		overflow: hidden;
	}

	.section-title {
		font-family: 'Nunito', sans-serif;
		font-size: 20px;
		font-weight: 600;
		color: #1a1a1a;
		padding: 24px 24px 16px 24px;
		margin: 0 0 8px 0;
		border-bottom: 1px solid #eee;
	}

	.cart-items-list {
		padding: 0 24px 24px 24px;
	}

	/* Individual Cart Item */
	.cart-item {
		display: grid;
		grid-template-columns: 100px 1fr auto auto auto;
		gap: 20px;
		align-items: center;
		padding: 24px 16px 24px 20px;
		border-bottom: 1px solid #f0f0f0;
		position: relative;
	}

	.cart-item:last-child {
		border-bottom: none;
	}

	.cart-item:hover {
		background-color: #f8f9fa;
		border-radius: 8px;
		/* Remove margin/padding changes that cause button jumping */
	}

	/* Product Image */
	.item-image {
		width: 100px;
		height: 100px;
		border-radius: 12px;
		overflow: hidden;
		background: #f5f5f5;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 2px solid #eee;
	}

	.item-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.no-image {
		font-size: 32px;
		opacity: 0.5;
	}

	/* Product Details */
	.item-details {
		display: flex;
		flex-direction: column;
		gap: 8px;
		min-width: 0;
	}

	.item-name {
		font-family: 'Nunito', sans-serif;
		font-size: 18px;
		font-weight: 600;
		color: #1a1a1a;
		margin: 0;
		line-height: 1.3;
	}

	.item-specs {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 14px;
		color: #666;
	}

	.spec-item {
		background: #f0f0f0;
		padding: 4px 8px;
		border-radius: 6px;
		font-weight: 500;
	}

	.spec-divider {
		color: #ccc;
	}

	.item-price {
		font-family: 'Nunito', sans-serif;
		font-size: 16px;
		color: #666;
		margin: 0;
	}

	/* Quantity Controls */
	.item-quantity {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
	}

	.quantity-controls {
		display: flex;
		align-items: center;
		border: 2px solid #e0e0e0;
		border-radius: 8px;
		background: white;
		overflow: hidden;
	}

	.quantity-btn {
		width: 36px;
		height: 36px;
		border: none;
		background: #f8f9fa;
		color: #333;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 600;
		font-size: 16px;
		transition: all 0.2s ease;
	}

	.quantity-btn:hover:not(:disabled) {
		background: #e9ecef;
		color: #4b766e;
	}

	.quantity-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.quantity-input {
		width: 50px;
		height: 36px;
		border: none;
		text-align: center;
		font-weight: 600;
		font-size: 14px;
		color: #333;
		background: white;
	}

	.quantity-input:focus {
		outline: 2px solid #4b766e;
	}

	/* Item Total and Remove Button */
	.item-total {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
	}

	.total-label {
		font-size: 12px;
		color: #666;
		font-weight: 500;
		text-transform: uppercase;
		margin: 0;
	}

	.total-price {
		font-family: 'Nunito', sans-serif;
		font-size: 18px;
		font-weight: 700;
		color: #4b766e;
		margin: 0;
	}

	.remove-btn {
		position: absolute;
		top: 16px;
		right: 16px;
		width: 32px;
		height: 32px;
		border: none;
		background: #fee;
		color: #dc3545;
		border-radius: 50%;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
		z-index: 10;
	}

	.remove-btn:hover {
		background: #dc3545;
		color: white;
		transform: scale(1.1);
	}

	/* Customer Information Section */
	.customer-info-section {
		background: white;
		border-radius: 16px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
		margin-top: 32px;
		overflow: hidden;
	}

	.customer-info-form {
		padding: 24px;
	}

	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
	}

	.form-group {
		margin-bottom: 16px;
	}

	.form-group label {
		display: block;
		font-family: 'Nunito', sans-serif;
		font-size: 14px;
		font-weight: 500;
		color: #666;
		margin-bottom: 8px;
	}

	.form-input {
		width: 100%;
		padding: 12px 16px;
		border: 2px solid #e0e0e0;
		border-radius: 8px;
		font-family: 'Nunito', sans-serif;
		font-size: 16px;
		color: #333;
		transition: border 0.2s ease;
	}

	.form-input:focus {
		outline: none;
		border-color: #4b766e;
	}

	.form-input.error {
		border-color: #dc3545;
		background-color: #fff5f5;
	}

	.form-input.error:focus {
		border-color: #dc3545;
	}

	.add-address-btn {
		margin-top: 8px;
		background: none;
		border: none;
		color: #4b766e;
		font-family: 'Nunito', sans-serif;
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;
		text-decoration: underline;
	}

	.add-address-btn:hover {
		color: #3a5d56;
	}

	.add-address-btn.primary {
		background: #4b766e;
		color: white;
		padding: 10px 16px;
		border-radius: 6px;
		text-decoration: none;
		margin-top: 12px;
		font-size: 14px;
		border: 1px solid #4b766e;
		transition: all 0.2s ease;
	}

	.add-address-btn.primary:hover {
		background: #3a5d56;
		border-color: #3a5d56;
	}

	.no-address-message {
		padding: 16px;
		background: #f8f9fa;
		border: 1px solid #e0e0e0;
		border-radius: 8px;
		text-align: center;
	}

	.no-address-message p {
		margin: 0 0 12px 0;
		color: #666;
		font-size: 14px;
	}

	/* Right Column - Summary (1/4) */
	.cart-summary-column {
		position: sticky;
		top: 32px;
	}

	.cart-summary-container {
		background: white;
		border-radius: 16px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
		padding: 24px;
	}

	.summary-title {
		font-family: 'Nunito', sans-serif;
		font-size: 20px;
		font-weight: 600;
		color: #1a1a1a;
		margin: 0 0 20px 0;
		padding-bottom: 12px;
		border-bottom: 2px solid #f0f0f0;
	}

	.summary-line {
		display: flex;
		justify-content: space-between;
		margin-bottom: 12px;
		font-family: 'Nunito', sans-serif;
		font-size: 14px;
	}

	.summary-label {
		color: #666;
	}

	.summary-value {
		color: #333;
		font-weight: 600;
	}

	.free-label {
		color: #28a745;
		font-weight: 600;
		text-transform: uppercase;
		font-size: 12px;
	}

	.carrier-label {
		color: #6c757d;
		font-weight: 500;
		font-size: 14px;
	}

	.free-shipping-notice {
		background: #e8f5e8;
		border: 1px solid #28a745;
		border-radius: 8px;
		padding: 12px;
		margin: 16px 0;
		text-align: center;
	}

	.notice-text {
		font-size: 13px;
		color: #155724;
		margin: 0;
	}

	.summary-divider {
		height: 2px;
		background: #e0e0e0;
		margin: 16px 0;
	}

	.summary-total {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 16px;
		background: #f8f9fa;
		border-radius: 8px;
		margin-bottom: 24px;
	}

	.total-label {
		font-family: 'Nunito', sans-serif;
		font-size: 18px;
		font-weight: 700;
		color: #1a1a1a;
	}

	.total-value {
		font-family: 'Nunito', sans-serif;
		font-size: 24px;
		font-weight: 700;
		color: #4b766e;
	}

	.summary-actions {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.checkout-btn {
		font-family: 'Nunito', sans-serif;
		font-size: 16px;
		font-weight: 600;
		padding: 16px 24px;
		border-radius: 8px;
		border: none;
		cursor: pointer;
		transition: all 0.2s ease;
		background: #4b766e;
		color: white;
		box-shadow: 0 4px 12px rgba(75, 118, 110, 0.3);
	}

	.checkout-btn:hover {
		background: #3a5d56;
		transform: translateY(-2px);
	}

	.continue-shopping-btn {
		font-family: 'Nunito', sans-serif;
		font-size: 14px;
		font-weight: 500;
		padding: 12px 20px;
		border-radius: 8px;
		border: 2px solid #4b766e;
		cursor: pointer;
		transition: all 0.2s ease;
		background: transparent;
		color: #4b766e;
	}

	.continue-shopping-btn:hover {
		background: #4b766e;
		color: white;
	}

	.empty-cart .continue-shopping-btn {
		background: #4b766e;
		color: white;
		border: none;
		padding: 16px 32px;
		font-size: 16px;
		font-weight: 600;
	}

	/* Responsive Design - 700px Breakpoint */
	@media (max-width: 700px) {
		.cart-layout {
			grid-template-columns: 1fr;
			gap: 24px;
		}

		.cart-summary-column {
			order: 2;
			position: static;
		}

		.cart-items-column {
			order: 1;
		}

		.cart-item {
			grid-template-columns: 80px 1fr;
			gap: 16px;
		}

		.item-quantity {
			grid-column: 1 / -1;
			flex-direction: row;
			justify-content: flex-start;
			margin-top: 12px;
		}

		.item-total {
			grid-column: 1 / -1;
			flex-direction: row;
			justify-content: space-between;
			margin-top: 8px;
		}

		.form-row {
			grid-template-columns: 1fr;
		}
	}

	/* Promo Code Styles */
	.promo-code-section {
		margin: 16px 0;
	}

	.promo-input-group {
		display: flex;
		gap: 8px;
		margin-bottom: 8px;
	}

	.promo-input {
		flex: 1;
		padding: 12px 16px;
		border: 2px solid #e0e0e0;
		border-radius: 8px;
		font-family: 'Nunito', sans-serif;
		font-size: 14px;
		transition: border-color 0.2s ease;
	}

	.promo-input:focus {
		outline: none;
		border-color: #4b766e;
	}

	.promo-input.error {
		border-color: #dc3545;
	}

	.promo-input:disabled {
		background-color: #f8f9fa;
		color: #6c757d;
		cursor: not-allowed;
	}

	.apply-promo-btn {
		padding: 12px 20px;
		background: #4b766e;
		color: white;
		border: none;
		border-radius: 8px;
		font-family: 'Nunito', sans-serif;
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;
		transition: background-color 0.2s ease;
		min-width: 80px;
	}

	.apply-promo-btn:hover:not(:disabled) {
		background: #3a5d56;
	}

	.apply-promo-btn:disabled {
		background: #6c757d;
		cursor: not-allowed;
	}

	.promo-error {
		color: #dc3545;
		font-size: 12px;
		margin: 4px 0 0 0;
		font-family: 'Nunito', sans-serif;
	}

	.applied-promo {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 12px 16px;
		background: #f8f9fa;
		border: 2px solid #4b766e;
		border-radius: 8px;
		margin-bottom: 8px;
	}

	.promo-info {
		display: flex;
		flex-direction: column;
		gap: 4px;
		flex: 1;
	}

	.promo-code {
		font-family: 'Nunito', sans-serif;
		font-size: 14px;
		font-weight: 600;
		color: #4b766e;
	}

	.promo-description {
		font-family: 'Nunito', sans-serif;
		font-size: 12px;
		color: #666;
	}

	.promo-discount {
		font-family: 'Nunito', sans-serif;
		font-size: 14px;
		font-weight: 600;
		color: #28a745;
	}

	.remove-promo-btn {
		background: none;
		border: none;
		color: #6c757d;
		font-size: 18px;
		cursor: pointer;
		padding: 4px;
		border-radius: 4px;
		transition: background-color 0.2s ease;
	}

	.remove-promo-btn:hover {
		background: #e0e0e0;
		color: #495057;
	}

	.original-total {
		font-family: 'Nunito', sans-serif;
		font-size: 12px;
		color: #6c757d;
		text-decoration: line-through;
		margin-left: 8px;
	}

	@media (max-width: 700px) {
		.promo-input-group {
			flex-direction: column;
		}

		.apply-promo-btn {
			width: 100%;
		}

		.applied-promo {
			flex-direction: column;
			align-items: flex-start;
			gap: 8px;
		}

		.remove-promo-btn {
			align-self: flex-end;
		}
	}
</style>
