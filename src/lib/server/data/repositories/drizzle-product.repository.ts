import { eq, like, desc, lte } from 'drizzle-orm';
import { db } from '../../db/index';
import { products } from '../../db/schema';
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
			// console.log('🔍 Fetching products from Drizzle...');
			const results = await db.select().from(products).orderBy(desc(products.created_at));
			// console.log('📊 Raw results from DB:', results.length, 'products');
			// console.log('🔍 First raw result:', results[0]);

			const mappedProducts = results.map(this.mapToDomain);
			// console.log('✅ Mapped products:', mappedProducts.length, 'products');
			// console.log('🔍 First mapped product:', mappedProducts[0]);

			return mappedProducts;
		} catch (error) {
			console.error('❌ Error fetching products from Drizzle:', error);
			return [];
		}
	}

	async getById(id: string): Promise<Product | null> {
		try {
			const results = await db.select().from(products).where(eq(products.id, id)).limit(1);

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
				.from(products)
				.where(eq(products.categories, category))
				.orderBy(desc(products.created_at));

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
				.from(products)
				.where(like(products.name, `%${query}%`) || like(products.description, `%${query}%`))
				.orderBy(desc(products.created_at));

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

			const insertData = {
				id,
				name: data.name,
				description: data.description,
				size: data.size,
				flavor: data.flavor,
				price: data.price,
				stock: data.stock,
				categories: data.categories,
				image_urls: data.imageUrls,
				created_at: Math.floor(now.getTime() / 1000),
				updated_at: Math.floor(now.getTime() / 1000)
			};

			const newProduct = await db.insert(products).values(insertData).returning();

			return newProduct[0] ? this.mapToDomain(newProduct[0]) : null;
		} catch (error) {
			console.error('Error creating product in Drizzle:', error);
			return null;
		}
	}

	async update(id: string, data: UpdateProductData): Promise<Product | null> {
		try {
			const updateData: any = {};

			if (data.name !== undefined) updateData.name = data.name;
			if (data.description !== undefined) updateData.description = data.description;
			if (data.size !== undefined) updateData.size = data.size;
			if (data.flavor !== undefined) updateData.flavor = data.flavor;
			if (data.price !== undefined) updateData.price = data.price;
			if (data.stock !== undefined) updateData.stock = data.stock;
			if (data.categories !== undefined) updateData.categories = data.categories;
			if (data.imageUrls !== undefined) updateData.image_urls = data.imageUrls;

			updateData.updated_at = Math.floor(new Date().getTime() / 1000);

			const updatedProduct = await db
				.update(products)
				.set(updateData)
				.where(eq(products.id, id))
				.returning();

			return updatedProduct[0] ? this.mapToDomain(updatedProduct[0]) : null;
		} catch (error) {
			console.error('Error updating product in Drizzle:', error);
			return null;
		}
	}

	async delete(id: string): Promise<boolean> {
		try {
			await db.delete(products).where(eq(products.id, id));
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
				.from(products)
				.where(lte(products.stock, threshold))
				.orderBy(desc(products.created_at));

			return results.map(this.mapToDomain);
		} catch (error) {
			console.error('Error fetching low stock products from Drizzle:', error);
			return [];
		}
	}

	// Map Drizzle schema to domain model
	private mapToDomain(dbProduct: any): Product {
		// console.log('🔧 Mapping DB product to domain:', {
		// 	id: dbProduct.id,
		// 	name: dbProduct.name,
		// 	size: dbProduct.size,
		// 	flavor: dbProduct.flavor,
		// 	categories: dbProduct.categories,
		// 	image_urls: dbProduct.image_urls,
		// 	created_at: dbProduct.created_at,
		// 	updated_at: dbProduct.updated_at
		// });

		const mapped = {
			id: dbProduct.id,
			name: dbProduct.name,
			description: dbProduct.description,
			price: dbProduct.price,
			stock: dbProduct.stock,
			size: dbProduct.size,
			flavor: dbProduct.flavor,
			categories: dbProduct.categories,
			imageUrls: dbProduct.image_urls,
			createdAt: new Date(dbProduct.created_at * 1000), // Convert from Unix timestamp
			updatedAt: new Date(dbProduct.updated_at * 1000) // Convert from Unix timestamp
		};

		// console.log('✅ Mapped product:', mapped);
		return mapped;
	}
}
