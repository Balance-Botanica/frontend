import { ProductRepositoryFactory, ProductService } from '$lib/server/products';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		const productService = new ProductService(ProductRepositoryFactory.create('drizzle'));
		const products = await productService.getAllProducts();
		return { products };
	} catch (error) {
		console.error('Error loading home products:', error);
		return { products: [] };
	}
};
