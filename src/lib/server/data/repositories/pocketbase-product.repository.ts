import { pb, type Record } from '../../pocketbase/index';
import type {
	ProductRepository,
	Product,
	CreateProductData,
	UpdateProductData
} from '../../domain/interfaces/product.interface';

// PocketBase implementation of ProductRepository
export class PocketBaseProductRepository implements ProductRepository {
	async getAll(): Promise<Product[]> {
		try {
			const records = await pb.collection('products').getList(1, 50, {
				sort: '-created'
			});
			return records.items.map(this.mapToDomain);
		} catch (error) {
			console.error('Error fetching products from PocketBase:', error);
			return [];
		}
	}

	async getById(id: string): Promise<Product | null> {
		try {
			const record = await pb.collection('products').getOne(id);
			return this.mapToDomain(record);
		} catch (error) {
			console.error('Error fetching product from PocketBase:', error);
			return null;
		}
	}

	async getByCategory(category: string): Promise<Product[]> {
		try {
			const records = await pb.collection('products').getList(1, 50, {
				filter: `category = "${category}"`,
				sort: '-created'
			});
			return records.items.map(this.mapToDomain);
		} catch (error) {
			console.error('Error fetching products by category from PocketBase:', error);
			return [];
		}
	}

	async search(query: string): Promise<Product[]> {
		try {
			const records = await pb.collection('products').getList(1, 50, {
				filter: `name ~ "${query}" || description ~ "${query}"`,
				sort: '-created'
			});
			return records.items.map(this.mapToDomain);
		} catch (error) {
			console.error('Error searching products from PocketBase:', error);
			return [];
		}
	}

	async create(data: CreateProductData): Promise<Product | null> {
		try {
			const record = await pb.collection('products').create(data);
			return this.mapToDomain(record);
		} catch (error) {
			console.error('Error creating product in PocketBase:', error);
			return null;
		}
	}

	async update(id: string, data: UpdateProductData): Promise<Product | null> {
		try {
			const record = await pb.collection('products').update(id, data);
			return this.mapToDomain(record);
		} catch (error) {
			console.error('Error updating product in PocketBase:', error);
			return null;
		}
	}

	async delete(id: string): Promise<boolean> {
		try {
			await pb.collection('products').delete(id);
			return true;
		} catch (error) {
			console.error('Error deleting product from PocketBase:', error);
			return false;
		}
	}

	async getLowStock(threshold: number = 5): Promise<Product[]> {
		try {
			const records = await pb.collection('products').getList(1, 50, {
				filter: `stock <= ${threshold}`,
				sort: '-created'
			});
			return records.items.map(this.mapToDomain);
		} catch (error) {
			console.error('Error fetching low stock products from PocketBase:', error);
			return [];
		}
	}

	// Map PocketBase record to domain model
	private mapToDomain(record: Record): Product {
		return {
			id: record.id,
			name: record.name,
			description: record.description,
			price: record.price,
			stock: record.stock,
			category: record.category,
			imageUrl: record.imageUrl,
			createdAt: new Date(record.created),
			updatedAt: new Date(record.updated)
		};
	}
}
