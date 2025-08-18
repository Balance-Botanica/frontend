import { eq, like, desc, lte } from 'drizzle-orm';
import { db } from '../../db/index';
import { product } from '../../db/schema';
import type {
	ProductRepository,
	Product,
	CreateProductData,
	UpdateProductData
} from '../../domain/interfaces/product.interface';

// Drizzle implementation of ProductRepository
export class DrizzleProductRepository implements ProductRepository {
	async getAll(): Promise<Product[]> {
		try {
			const results = await db.select().from(product).orderBy(desc(product.createdAt));

			return results.map(this.mapToDomain);
		} catch (error) {
			console.error('Error fetching products from Drizzle:', error);
			return [];
		}
	}

	async getById(id: string): Promise<Product | null> {
		try {
			const results = await db.select().from(product).where(eq(product.id, id)).limit(1);

			return results[0] ? this.mapToDomain(results[0]) : null;
		} catch (error) {
			console.error('Error fetching product from Drizzle:', error);
			return null;
		}
	}

	async getByCategory(category: string): Promise<Product[]> {
		try {
			const results = await db
				.select()
				.from(product)
				.where(eq(product.category, category))
				.orderBy(desc(product.createdAt));

			return results.map(this.mapToDomain);
		} catch (error) {
			console.error('Error fetching products by category from Drizzle:', error);
			return [];
		}
	}

	async search(query: string): Promise<Product[]> {
		try {
			const results = await db
				.select()
				.from(product)
				.where(like(product.name, `%${query}%`) || like(product.description, `%${query}%`))
				.orderBy(desc(product.createdAt));

			return results.map(this.mapToDomain);
		} catch (error) {
			console.error('Error searching products from Drizzle:', error);
			return [];
		}
	}

	async create(data: CreateProductData): Promise<Product | null> {
		try {
			const id = crypto.randomUUID();
			const now = new Date();

			const newProduct = await db
				.insert(product)
				.values({
					...data,
					id,
					createdAt: now,
					updatedAt: now
				})
				.returning();

			return newProduct[0] ? this.mapToDomain(newProduct[0]) : null;
		} catch (error) {
			console.error('Error creating product in Drizzle:', error);
			return null;
		}
	}

	async update(id: string, data: UpdateProductData): Promise<Product | null> {
		try {
			const updatedProduct = await db
				.update(product)
				.set({
					...data,
					updatedAt: new Date()
				})
				.where(eq(product.id, id))
				.returning();

			return updatedProduct[0] ? this.mapToDomain(updatedProduct[0]) : null;
		} catch (error) {
			console.error('Error updating product in Drizzle:', error);
			return null;
		}
	}

	async delete(id: string): Promise<boolean> {
		try {
			await db.delete(product).where(eq(product.id, id));
			return true;
		} catch (error) {
			console.error('Error deleting product from Drizzle:', error);
			return false;
		}
	}

	async getLowStock(threshold: number = 5): Promise<Product[]> {
		try {
			const results = await db
				.select()
				.from(product)
				.where(lte(product.stock, threshold))
				.orderBy(desc(product.createdAt));

			return results.map(this.mapToDomain);
		} catch (error) {
			console.error('Error fetching low stock products from Drizzle:', error);
			return [];
		}
	}

	// Map Drizzle schema to domain model
	private mapToDomain(dbProduct: any): Product {
		return {
			id: dbProduct.id,
			name: dbProduct.name,
			description: dbProduct.description,
			price: dbProduct.price,
			stock: dbProduct.stock,
			category: dbProduct.category,
			imageUrl: dbProduct.imageUrl,
			createdAt: new Date(dbProduct.createdAt),
			updatedAt: new Date(dbProduct.updatedAt)
		};
	}
}
