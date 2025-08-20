import { ProductRepositoryFactory, ProductService } from '$lib/server/products';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		// Create product service with Drizzle (default)
		const productService = new ProductService(ProductRepositoryFactory.create('drizzle'));

		// Get all products
		console.log('🔍 Loading products...');
		const products = await productService.getAllProducts();
		console.log('📦 Products loaded:', products.length, products);

		// Get products by category (using actual categories from our database)
		const pastes = await productService.getProductsByCategory('Пасти');
		const oils = await productService.getProductsByCategory('Олія');

		// Get low stock products
		const lowStock = await productService.getLowStockProducts(10);

		return {
			products,
			categories: {
				pastes: pastes,
				oils: oils
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
