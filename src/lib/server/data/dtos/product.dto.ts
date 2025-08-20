// Data Transfer Object for database operations
export interface ProductDTO {
	id: string;
	name: string; // English name only
	description?: string;
	size: string; // Size tag: 15г, 30г, 45г, 30мл, 60мл
	flavor: string; // Flavor tag: натуральний, бекон, риба
	price: number;
	stock: number;
	categories: string; // JSON string
	image_urls: string; // JSON string
	created_at: number; // Unix timestamp
	updated_at: number; // Unix timestamp
}

// DTO for creating products
export interface CreateProductDTO {
	name: string; // English name only
	description?: string;
	size: string; // Size tag
	flavor: string; // Flavor tag
	price: number;
	stock: number;
	categories: string;
	image_urls: string;
}

// DTO for updating products
export interface UpdateProductDTO {
	name?: string; // English name only
	description?: string;
	size?: string; // Size tag
	flavor?: string; // Flavor tag
	price?: number;
	stock?: number;
	categories?: string;
	image_urls?: string;
}
