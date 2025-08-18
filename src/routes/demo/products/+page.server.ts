import { ProductRepositoryFactory, ProductService } from '$lib/server/products';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		// Create product service with Drizzle (default)
		const productService = new ProductService(ProductRepositoryFactory.create('drizzle'));

		// Get all products
		const products = await productService.getAllProducts();

		// Get products by category
		const cbdOils = await productService.getProductsByCategory('cbd-oils');
		const topicals = await productService.getProductsByCategory('topicals');

		// Get low stock products
		const lowStock = await productService.getLowStockProducts(10);

		return {
			products,
			categories: {
				'cbd-oils': cbdOils,
				topicals: topicals
			},
			lowStock,
			dataSource: 'drizzle',
			totalProducts: products.length
		};
	} catch (error) {
		console.error('Error loading products:', error);
		return {
			products: [],
			categories: {},
			lowStock: [],
			dataSource: 'drizzle',
			totalProducts: 0,
			error: 'Failed to load products'
		};
	}
};
