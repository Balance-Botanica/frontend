import { error } from '@sveltejs/kit';
import { ProductRepositoryFactory, ProductService } from '$lib/server/products';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const productService = new ProductService(ProductRepositoryFactory.createFromConfig());
		const product = await productService.getProductById(params.id);

		if (!product) {
			throw error(404, 'Product not found');
		}

		return { product };
	} catch (e: any) {
		if (e?.status === 404) throw e;
		console.error('❌ Error loading product detail:', e);
		throw error(500, 'Failed to load product');
	}
};
