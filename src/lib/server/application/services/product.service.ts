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
}
