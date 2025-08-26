import type {
	ProductRepository,
	Product,
	CreateProductData,
	UpdateProductData
} from '../../domain/interfaces/product.interface';

// Application service for product operations
export class ProductService {
	constructor(private productRepository: ProductRepository) {}

	// Get all products
	async getAllProducts(): Promise<Product[]> {
		return await this.productRepository.getAll();
	}

	// Get product by ID
	async getProductById(id: string): Promise<Product | null> {
		return await this.productRepository.getById(id);
	}

	// Get products by category
	async getProductsByCategory(category: string): Promise<Product[]> {
		return await this.productRepository.getByCategory(category);
	}

	// Search products
	async searchProducts(query: string): Promise<Product[]> {
		if (!query.trim()) {
			return [];
		}
		return await this.productRepository.search(query);
	}

	// Advanced search with multiple filters
	async searchProductsWithFilters(filters: {
		searchTerm?: string;
		category?: string;
		size?: string;
		flavor?: string;
		minPrice?: number;
		maxPrice?: number;
	}): Promise<Product[]> {
		const allProducts = await this.getAllProducts();

		return allProducts.filter((product) => {
			// Search term filter (name or description)
			if (filters.searchTerm) {
				const term = filters.searchTerm.toLowerCase();
				if (
					!product.name.toLowerCase().includes(term) &&
					(!product.description || !product.description.toLowerCase().includes(term))
				) {
					return false;
				}
			}

			// Category filter
			if (filters.category) {
				try {
					const categories = JSON.parse(product.categories);
					if (!Array.isArray(categories) || !categories.includes(filters.category)) {
						return false;
					}
				} catch {
					return false;
				}
			}

			// Size filter
			if (filters.size && product.size !== filters.size) {
				return false;
			}

			// Flavor filter
			if (filters.flavor && product.flavor !== filters.flavor) {
				return false;
			}

			// Price filters (convert from kopiyky to UAH)
			const priceUAH = product.price / 100;
			if (filters.minPrice !== undefined && priceUAH < filters.minPrice) {
				return false;
			}
			if (filters.maxPrice !== undefined && priceUAH > filters.maxPrice) {
				return false;
			}

			return true;
		});
	}

	// Create new product
	async createProduct(data: CreateProductData): Promise<Product | null> {
		// Business logic validation
		if (data.price < 0) {
			throw new Error('Price cannot be negative');
		}
		if (data.stock < 0) {
			throw new Error('Stock cannot be negative');
		}
		if (!data.name.trim()) {
			throw new Error('Product name is required');
		}

		return await this.productRepository.create(data);
	}

	// Update product
	async updateProduct(id: string, data: UpdateProductData): Promise<Product | null> {
		// Business logic validation
		if (data.price !== undefined && data.price < 0) {
			throw new Error('Price cannot be negative');
		}
		if (data.stock !== undefined && data.stock < 0) {
			throw new Error('Stock cannot be negative');
		}
		if (data.name !== undefined && !data.name.trim()) {
			throw new Error('Product name cannot be empty');
		}

		return await this.productRepository.update(id, data);
	}

	// Delete product
	async deleteProduct(id: string): Promise<boolean> {
		return await this.productRepository.delete(id);
	}

	// Get low stock products
	async getLowStockProducts(threshold: number = 5): Promise<Product[]> {
		return await this.productRepository.getLowStock(threshold);
	}

	// Business logic: Check if product is available
	async isProductAvailable(id: string): Promise<boolean> {
		const product = await this.productRepository.getById(id);
		return product ? product.stock > 0 : false;
	}

	// Business logic: Get product price in dollars
	async getProductPriceInDollars(id: string): Promise<number | null> {
		const product = await this.productRepository.getById(id);
		return product ? product.price / 100 : null; // Convert cents to dollars
	}

	// Business logic: Get products by price range
	async getProductsByPriceRange(minPrice: number, maxPrice: number): Promise<Product[]> {
		const allProducts = await this.productRepository.getAll();
		return allProducts.filter((product) => {
			const priceInDollars = product.price / 100;
			return priceInDollars >= minPrice && priceInDollars <= maxPrice;
		});
	}

	// Get unique categories from all products
	async getUniqueCategories(): Promise<string[]> {
		const allProducts = await this.getAllProducts();
		const categories = new Set<string>();

		allProducts.forEach((product) => {
			try {
				const productCategories = JSON.parse(product.categories);
				if (Array.isArray(productCategories)) {
					productCategories.forEach((cat) => categories.add(cat));
				}
			} catch (e) {
				// Ignore parsing errors
			}
		});

		return Array.from(categories);
	}

	// Get unique sizes from all products
	async getUniqueSizes(): Promise<string[]> {
		const allProducts = await this.getAllProducts();
		const sizes = new Set<string>();

		allProducts.forEach((product) => {
			if (product.size) {
				sizes.add(product.size);
			}
		});

		return Array.from(sizes);
	}

	// Get unique flavors from all products
	async getUniqueFlavors(): Promise<string[]> {
		const allProducts = await this.getAllProducts();
		const flavors = new Set<string>();

		allProducts.forEach((product) => {
			if (product.flavor) {
				flavors.add(product.flavor);
			}
		});

		return Array.from(flavors);
	}
}
