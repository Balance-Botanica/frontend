import { ProductRepositoryFactory, ProductService } from '$lib/server/products';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		// Create product service with Drizzle (default)
		const productService = new ProductService(ProductRepositoryFactory.create('drizzle'));

		// Get all products
		const products = await productService.getAllProducts();

		return {
			products,
			totalProducts: products.length
		};
	} catch (error) {
		console.error('Error loading products:', error);
		return {
			products: [],
			totalProducts: 0,
			error: 'Failed to load products'
		};
	}
};
