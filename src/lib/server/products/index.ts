// Main export file for product management
// This provides a clean interface to access product functionality
// NOTE: Currently defaults to PocketBase since Drizzle repositories have been removed.

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
// Removed DrizzleProductRepository export since it doesn't exist
export { PocketBaseProductRepository } from '../data/repositories/pocketbase-product.repository';

// Re-export for consumers
export { ProductRepositoryFactory } from '../data/factories/product-repository.factory';
export { ProductService } from '../application/services/product.service';

// Export data source types
export type { DataSourceType } from '../data/factories/product-repository.factory';

// Convenience function to get product service with configured data source
export async function createProductService(dataSource?: 'pocketbase') {
	// For now, always use PocketBase since Drizzle repositories have been removed
	const repository = ProductRepositoryFactory.create(
		dataSource || ProductRepositoryFactory.getDefaultDataSource()
	);
	return new ProductService(repository);
}
