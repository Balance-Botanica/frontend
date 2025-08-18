// Main export file for product management
// This provides a clean interface to access product functionality
// NOTE: Currently defaults to Drizzle. PocketBase is commented out for initial development.

// Import locally for use within this module (avoids runtime ReferenceError)
import { ProductRepositoryFactory } from '../data/factories/product-repository.factory';
import { ProductService } from '../application/services/product.service';

// Export domain interfaces
export type {
	Product,
	CreateProductData,
	UpdateProductData,
	ProductRepository
} from '../domain/interfaces/product.interface';

// Export repositories
export { DrizzleProductRepository } from '../data/repositories/drizzle-product.repository';
// export { PocketBaseProductRepository } from '../data/repositories/pocketbase-product.repository';

// Re-export for consumers
export { ProductRepositoryFactory } from '../data/factories/product-repository.factory';
export { ProductService } from '../application/services/product.service';

// Export data source types
export type { DataSourceType } from '../data/factories/product-repository.factory';

// Convenience function to get product service with configured data source
export async function createProductService(dataSource?: 'drizzle' | 'pocketbase') {
	// For now, always use Drizzle regardless of parameter
	// TODO: Enable PocketBase when ready
	if (dataSource === 'pocketbase') {
		console.warn('⚠️ PocketBase is currently disabled. Using Drizzle instead.');
	}

	const repository = ProductRepositoryFactory.create('drizzle');
	return new ProductService(repository);
}

// No default export to avoid bundling pitfalls; prefer named exports above.
