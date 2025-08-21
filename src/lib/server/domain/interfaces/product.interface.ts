// Domain interface for products - defines the contract
export interface Product {
	id: string;
	name: string;
	description: string;
	price: number; // Price in dollars (e.g., 29.99)
	stock: number;
	size: string; // Size tag (required)
	flavor: string; // Flavor tag (required)
	categories: string; // JSON string of categories (from category field)
	imageUrls: string; // JSON string of Cloudinary images (from image_url or image_urls field)
	createdAt: Date;
	updatedAt: Date;
}

// Product creation data (without auto-generated fields)
export interface CreateProductData {
	name: string;
	description: string;
	price: number;
	stock: number;
	size: string; // Size tag (required)
	flavor: string; // Flavor tag (required)
	categories: string; // JSON string of categories
	imageUrls: string; // JSON string of Cloudinary images
}

// Product update data (partial, without auto-generated fields)
export interface UpdateProductData {
	name?: string;
	description?: string;
	price?: number;
	stock?: number;
	size?: string; // Size tag (optional)
	flavor?: string; // Flavor tag (optional)
	categories?: string; // JSON string of categories
	imageUrls?: string; // JSON string of Cloudinary images
}

// Product repository interface - defines the contract for data access
export interface ProductRepository {
	getAll(): Promise<Product[]>;
	getById(id: string): Promise<Product | null>;
	getByCategory(category: string): Promise<Product[]>;
	search(query: string): Promise<Product[]>;
	create(data: CreateProductData): Promise<Product | null>;
	update(id: string, data: UpdateProductData): Promise<Product | null>;
	delete(id: string): Promise<boolean>;
	getLowStock(threshold?: number): Promise<Product[]>;
}
