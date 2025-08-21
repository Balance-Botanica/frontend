import { ProductRepositoryFactory, ProductService } from '$lib/server/products';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		console.log('🔄 Loading products from server...');
		const productService = new ProductService(ProductRepositoryFactory.create('drizzle'));
		const products = await productService.getAllProducts();
		console.log('✅ Products loaded:', products.length, 'products');

		// Log each product with details
		products.forEach((product, index) => {
			console.log(`\n🔍 Product ${index + 1}:`);
			console.log('  Name:', product.name);
			console.log('  ImageUrls (raw):', product.imageUrls);
			console.log('  Categories (raw):', product.categories);
			console.log('  Size:', product.size);
			console.log('  Flavor:', product.flavor);

			// Try to parse imageUrls
			if (product.imageUrls) {
				try {
					const parsed = JSON.parse(product.imageUrls);
					console.log('  Parsed ImageUrls:', parsed);
					console.log('  Image count:', Array.isArray(parsed) ? parsed.length : 'Not array');
				} catch (error) {
					console.log('  ❌ Failed to parse imageUrls as JSON:', error.message);
				}
			}
		});

		return { products };
	} catch (error) {
		console.error('❌ Error loading home products:', error);
		return { products: [] };
	}
};
