// Domain interface for products - defines the contract
export interface Product {
	id: string;
	name: string;
	description: string;
	price: number; // Price in dollars (e.g., 29.99)
	stock: number;
	category: string;
	imageUrl?: string;
	createdAt: Date;
	updatedAt: Date;
}

// Product creation data (without auto-generated fields)
export interface CreateProductData {
	name: string;
	description: string;
	price: number;
	stock: number;
	category: string;
	imageUrl?: string;
}

// Product update data (partial, without auto-generated fields)
export interface UpdateProductData {
	name?: string;
	description?: string;
	price?: number;
	stock?: number;
	category?: string;
	imageUrl?: string;
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
