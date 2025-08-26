import type { PageServerLoad } from './$types';
import { ProductService } from '$lib/server/application/services/product.service';
import { DrizzleProductRepository } from '$lib/server/data/repositories/drizzle-product.repository';
import { db } from '$lib/server/db';
import type { Product } from '$lib/server/domain/interfaces/product.interface';

// Create repository and service instances
const productRepository = new DrizzleProductRepository(db);
const productService = new ProductService(productRepository);

export const load: PageServerLoad = async ({ url }) => {
	try {
		// Get query parameters
		const category = url.searchParams.get('category') || '';
		const searchTerm = url.searchParams.get('search') || '';
		const size = url.searchParams.get('size') || '';
		const flavor = url.searchParams.get('flavor') || '';
		const minPrice = url.searchParams.get('minPrice')
			? Number(url.searchParams.get('minPrice'))
			: undefined;
		const maxPrice = url.searchParams.get('maxPrice')
			? Number(url.searchParams.get('maxPrice'))
			: undefined;

		// Get all products for category view
		const allProducts = await productService.getAllProducts();

		// Get unique categories, sizes, and flavors for filter dropdowns
		const categories = await productService.getUniqueCategories();
		const sizes = await productService.getUniqueSizes();
		const flavors = await productService.getUniqueFlavors();

		// Apply filters
		let filteredProducts: Product[] = [];
		let totalProducts = 0;

		if (category) {
			// Filter by category
			filteredProducts = await productService.searchProductsWithFilters({
				searchTerm,
				category,
				size: size || undefined,
				flavor: flavor || undefined,
				minPrice,
				maxPrice
			});
			totalProducts = filteredProducts.length;
		} else {
			// No category selected, show all products with filters
			filteredProducts = await productService.searchProductsWithFilters({
				searchTerm,
				size: size || undefined,
				flavor: flavor || undefined,
				minPrice,
				maxPrice
			});
			totalProducts = filteredProducts.length;
		}

		return {
			products: filteredProducts,
			allProductsCount: allProducts.length,
			totalProducts,
			categories,
			sizes,
			flavors,
			category,
			searchTerm,
			size,
			flavor,
			minPrice,
			maxPrice,
			error: null
		};
	} catch (error) {
		console.error('Error loading products:', error);
		return {
			products: [],
			allProductsCount: 0,
			totalProducts: 0,
			categories: [],
			sizes: [],
			flavors: [],
			category: '',
			searchTerm: '',
			size: '',
			flavor: '',
			minPrice: null,
			maxPrice: null,
			error: 'Failed to load products'
		};
	}
};
