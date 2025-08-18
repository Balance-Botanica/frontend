import { pb, type Record } from 'pocketbase';

// Product interface based on PocketBase collection
export interface Product {
	id: string;
	name: string;
	description: string;
	price: number;
	stock: number;
	category: string;
	imageUrl?: string;
	created: string;
	updated: string;
}

// Product service using PocketBase
export class ProductService {
	// Get all products
	static async getAll(): Promise<Product[]> {
		try {
			const records = await pb.collection('products').getList(1, 50, {
				sort: '-created'
			});
			return records.items.map(this.mapRecordToProduct);
		} catch (error) {
			console.error('Error fetching products:', error);
			return [];
		}
	}

	// Get products by category
	static async getByCategory(category: string): Promise<Product[]> {
		try {
			const records = await pb.collection('products').getList(1, 50, {
				filter: `category = "${category}"`,
				sort: '-created'
			});
			return records.items.map(this.mapRecordToProduct);
		} catch (error) {
			console.error('Error fetching products by category:', error);
			return [];
		}
	}

	// Get single product by ID
	static async getById(id: string): Promise<Product | null> {
		try {
			const record = await pb.collection('products').getOne(id);
			return this.mapRecordToProduct(record);
		} catch (error) {
			console.error('Error fetching product:', error);
			return null;
		}
	}

	// Create new product (admin only)
	static async create(
		productData: Omit<Product, 'id' | 'created' | 'updated'>
	): Promise<Product | null> {
		try {
			const record = await pb.collection('products').create(productData);
			return this.mapRecordToProduct(record);
		} catch (error) {
			console.error('Error creating product:', error);
			return null;
		}
	}

	// Update product (admin only)
	static async update(id: string, productData: Partial<Product>): Promise<Product | null> {
		try {
			const record = await pb.collection('products').update(id, productData);
			return this.mapRecordToProduct(record);
		} catch (error) {
			console.error('Error updating product:', error);
			return null;
		}
	}

	// Delete product (admin only)
	static async delete(id: string): Promise<boolean> {
		try {
			await pb.collection('products').delete(id);
			return true;
		} catch (error) {
			console.error('Error deleting product:', error);
			return false;
		}
	}

	// Search products
	static async search(query: string): Promise<Product[]> {
		try {
			const records = await pb.collection('products').getList(1, 50, {
				filter: `name ~ "${query}" || description ~ "${query}"`,
				sort: '-created'
			});
			return records.items.map(this.mapRecordToProduct);
		} catch (error) {
			console.error('Error searching products:', error);
			return [];
		}
	}

	// Map PocketBase record to Product interface
	private static mapRecordToProduct(record: Record): Product {
		return {
			id: record.id,
			name: record.name,
			description: record.description,
			price: record.price,
			stock: record.stock,
			category: record.category,
			imageUrl: record.imageUrl,
			created: record.created,
			updated: record.updated
		};
	}
}
