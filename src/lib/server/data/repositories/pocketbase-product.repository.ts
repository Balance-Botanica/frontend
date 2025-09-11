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
				filter: `categories ~ "${category}"`,
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
			const record = await pb.collection('products').create({
				name: data.name,
				description: data.description,
				price: data.price,
				stock: data.stock,
				size: data.size,
				flavor: data.flavor,
				categories: data.categories,
				image_urls: data.imageUrls
			});
			return this.mapToDomain(record);
		} catch (error) {
			console.error('Error creating product in PocketBase:', error);
			return null;
		}
	}

	async update(id: string, data: UpdateProductData): Promise<Product | null> {
		try {
			const updateData: any = {};
			if (data.name !== undefined) updateData.name = data.name;
			if (data.description !== undefined) updateData.description = data.description;
			if (data.price !== undefined) updateData.price = data.price;
			if (data.stock !== undefined) updateData.stock = data.stock;
			if (data.size !== undefined) updateData.size = data.size;
			if (data.flavor !== undefined) updateData.flavor = data.flavor;
			if (data.categories !== undefined) updateData.categories = data.categories;
			if (data.imageUrls !== undefined) updateData.image_urls = data.imageUrls;

			const record = await pb.collection('products').update(id, updateData);
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
			size: record.size,
			flavor: record.flavor,
			categories: record.categories,
			imageUrls: record.image_urls,
			createdAt: new Date(record.created),
			updatedAt: new Date(record.updated)
		};
	}
}
