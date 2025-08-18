import { eq, like, desc } from 'drizzle-orm';
import { db } from './index';
import { product, type Product } from './schema';

// Product service using Drizzle ORM
export class DrizzleProductService {
	// Get all products
	static async getAll(): Promise<Product[]> {
		try {
			return await db.select().from(product).orderBy(desc(product.createdAt));
		} catch (error) {
			console.error('Error fetching products:', error);
			return [];
		}
	}

	// Get products by category
	static async getByCategory(category: string): Promise<Product[]> {
		try {
			return await db
				.select()
				.from(product)
				.where(eq(product.category, category))
				.orderBy(desc(product.createdAt));
		} catch (error) {
			console.error('Error fetching products by category:', error);
			return [];
		}
	}

	// Get single product by ID
	static async getById(id: string): Promise<Product | null> {
		try {
			const results = await db.select().from(product).where(eq(product.id, id)).limit(1);

			return results[0] || null;
		} catch (error) {
			console.error('Error fetching product:', error);
			return null;
		}
	}

	// Create new product
	static async create(
		productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
	): Promise<Product | null> {
		try {
			const id = crypto.randomUUID();
			const now = new Date();

			const newProduct = await db
				.insert(product)
				.values({
					...productData,
					id,
					createdAt: now,
					updatedAt: now
				})
				.returning();

			return newProduct[0] || null;
		} catch (error) {
			console.error('Error creating product:', error);
			return null;
		}
	}

	// Update product
	static async update(
		id: string,
		productData: Partial<Omit<Product, 'id' | 'createdAt'>>
	): Promise<Product | null> {
		try {
			const updatedProduct = await db
				.update(product)
				.set({
					...productData,
					updatedAt: new Date()
				})
				.where(eq(product.id, id))
				.returning();

			return updatedProduct[0] || null;
		} catch (error) {
			console.error('Error updating product:', error);
			return null;
		}
	}

	// Delete product
	static async delete(id: string): Promise<boolean> {
		try {
			await db.delete(product).where(eq(product.id, id));
			return true;
		} catch (error) {
			console.error('Error deleting product:', error);
			return false;
		}
	}

	// Search products
	static async search(query: string): Promise<Product[]> {
		try {
			return await db
				.select()
				.from(product)
				.where(like(product.name, `%${query}%`) || like(product.description, `%${query}%`))
				.orderBy(desc(product.createdAt));
		} catch (error) {
			console.error('Error searching products:', error);
			return [];
		}
	}

	// Get products with low stock
	static async getLowStock(threshold: number = 5): Promise<Product[]> {
		try {
			return await db
				.select()
				.from(product)
				.where(eq(product.stock, threshold))
				.orderBy(desc(product.createdAt));
		} catch (error) {
			console.error('Error fetching low stock products:', error);
			return [];
		}
	}
}
