import { ProductRepositoryFactory, ProductService } from '$lib/server/products';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	try {
		// Get search parameters from URL
		const searchTerm = url.searchParams.get('search') || '';
		const category = url.searchParams.get('category') || '';
		const size = url.searchParams.get('size') || '';
		const flavor = url.searchParams.get('flavor') || '';
		const minPrice = url.searchParams.get('minPrice')
			? parseFloat(url.searchParams.get('minPrice')!)
			: null;
		const maxPrice = url.searchParams.get('maxPrice')
			? parseFloat(url.searchParams.get('maxPrice')!)
			: null;

		// Create product service with Drizzle (default)
		const productService = new ProductService(ProductRepositoryFactory.create('drizzle'));

		// Get all products first to extract filter options
		const allProducts = await productService.getAllProducts();

		// Extract unique categories, sizes, and flavors for filter dropdowns
		const categories = await productService.getUniqueCategories();
		const sizes = await productService.getUniqueSizes();
		const flavors = await productService.getUniqueFlavors();

		// Filter products based on search criteria
		const filteredProducts = await productService.searchProductsWithFilters({
			searchTerm: searchTerm || undefined,
			category: category || undefined,
			size: size || undefined,
			flavor: flavor || undefined,
			minPrice: minPrice !== null ? minPrice : undefined,
			maxPrice: maxPrice !== null ? maxPrice : undefined
		});

		return {
			products: filteredProducts,
			totalProducts: filteredProducts.length,
			allProductsCount: allProducts.length,
			searchTerm,
			category,
			size,
			flavor,
			minPrice,
			maxPrice,
			categories,
			sizes,
			flavors
		};
	} catch (error) {
		console.error('Error loading products:', error);
		return {
			products: [],
			totalProducts: 0,
			allProductsCount: 0,
			searchTerm: '',
			category: '',
			size: '',
			flavor: '',
			minPrice: null,
			maxPrice: null,
			categories: [],
			sizes: [],
			flavors: [],
			error: 'Failed to load products'
		};
	}
};
