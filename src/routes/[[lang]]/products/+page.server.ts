import { ProductRepositoryFactory, ProductService } from '$lib/server/products';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	try {
		// Get search parameters from URL
		const searchTerm = url.searchParams.get('search') || '';
		const category = url.searchParams.get('category') || '';
		const size = url.searchParams.get('size') || '';
		const flavor = url.searchParams.get('flavor') || '';
		const minPriceParam = url.searchParams.get('minPrice');
		const maxPriceParam = url.searchParams.get('maxPrice');

		console.log('SERVER: URL search params received:', {
			searchTerm,
			category,
			size,
			flavor,
			minPriceParam,
			maxPriceParam,
			fullUrl: url.toString()
		});

		// Parse price parameters with better error handling
		let minPrice: number | null = null;
		let maxPrice: number | null = null;

		if (minPriceParam !== null && minPriceParam !== '') {
			const parsed = parseFloat(minPriceParam);
			if (!isNaN(parsed)) {
				minPrice = parsed;
			}
		}

		if (maxPriceParam !== null && maxPriceParam !== '') {
			const parsed = parseFloat(maxPriceParam);
			if (!isNaN(parsed)) {
				maxPrice = parsed;
			}
		}

		// Create product service with Drizzle (default)
		const productService = new ProductService(ProductRepositoryFactory.create('drizzle'));

		// Get all products first to extract filter options and count
		const allProducts = await productService.getAllProducts();
		console.log('SERVER: All products count:', allProducts.length);

		// Extract unique categories, sizes, and flavors for filter dropdowns
		const categories = await productService.getUniqueCategories();
		const sizes = await productService.getUniqueSizes();
		const flavors = await productService.getUniqueFlavors();

		// Filter products based on search criteria
		let filteredProducts = allProducts;

		// Only apply filtering if at least one filter is active
		if (searchTerm || category || size || flavor || minPrice !== null || maxPrice !== null) {
			console.log('SERVER: Applying filters with:', {
				searchTerm: searchTerm || undefined,
				category: category || undefined,
				size: size || undefined,
				flavor: flavor || undefined,
				minPrice: minPrice !== null ? minPrice : undefined,
				maxPrice: maxPrice !== null ? maxPrice : undefined
			});

			filteredProducts = await productService.searchProductsWithFilters({
				searchTerm: searchTerm || undefined,
				category: category || undefined,
				size: size || undefined,
				flavor: flavor || undefined,
				minPrice: minPrice !== null ? minPrice : undefined,
				maxPrice: maxPrice !== null ? maxPrice : undefined
			});

			console.log('SERVER: Filtered products count:', filteredProducts.length);
		}

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
		console.error('SERVER ERROR: Error loading products:', error);
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
