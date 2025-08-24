// ================================
// 🏗️ CLIENT-SIDE PRODUCT TYPES
// ================================
// These types mirror the server-side domain entities but are safe for client-side use

export interface ClientProduct {
	id: ProductId;
	name: ProductName;
	description?: string;
	price: Money;
	stock: Stock;
	size: string;
	flavor: string;
	categories: string[];
	imageUrls: string[];
	createdAt: Date;
	updatedAt: Date;
}

// Value Objects for client-side use
export interface ProductId {
	getValue(): string;
}

export interface ProductName {
	getUkrainian(): string;
	getEnglish(): string;
}

export interface Money {
	getKopiyky(): number;
	getUAH(): number;
}

export interface Stock {
	getValue(): number;
	isAvailable(): boolean;
}

// Factory functions to create client-side Product from raw data
export function createClientProduct(rawProduct: {
	id: string;
	name: string;
	description?: string | null;
	price: number; // in kopiyky
	stock: number;
	size: string;
	flavor: string;
	categories?: string | null;
	imageUrls?: string | null;
	createdAt?: Date;
	updatedAt?: Date;
}): ClientProduct {
	// Helper function to parse JSON strings safely
	function parseJsonArray(jsonString: string | null | undefined): string[] {
		if (!jsonString) return [];
		try {
			const parsed = JSON.parse(jsonString);
			return Array.isArray(parsed) ? parsed : [];
		} catch {
			return [];
		}
	}

	return {
		id: createProductId(rawProduct.id),
		name: createProductName(rawProduct.name),
		description: rawProduct.description || undefined,
		price: createMoney(rawProduct.price),
		stock: createStock(rawProduct.stock),
		size: rawProduct.size,
		flavor: rawProduct.flavor,
		categories: parseJsonArray(rawProduct.categories),
		imageUrls: parseJsonArray(rawProduct.imageUrls),
		createdAt: rawProduct.createdAt || new Date(),
		updatedAt: rawProduct.updatedAt || new Date()
	};
}

// Value Object factories
export function createProductId(id: string): ProductId {
	return {
		getValue: () => id
	};
}

export function createProductName(name: string): ProductName {
	return {
		getUkrainian: () => name,
		getEnglish: () => name // For now, same as Ukrainian
	};
}

export function createMoney(kopiyky: number): Money {
	return {
		getKopiyky: () => kopiyky,
		getUAH: () => kopiyky / 100
	};
}

export function createStock(stock: number): Stock {
	return {
		getValue: () => stock,
		isAvailable: () => stock > 0
	};
}

// Raw product type for props from server
export interface RawProduct {
	id: string;
	name: string;
	description?: string | null;
	price: number;
	stock: number;
	size: string;
	flavor: string;
	categories?: string | null;
	imageUrls?: string | null;
	createdAt?: Date;
	updatedAt?: Date;
}
