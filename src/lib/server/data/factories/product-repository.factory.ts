import { config } from 'dotenv';
// Removed DrizzleProductRepository import since it doesn't exist
import { PocketBaseProductRepository } from '../repositories/pocketbase-product.repository';
import type { ProductRepository } from '../../domain/interfaces/product.interface';

// Load environment variables
config();

// Data source types - keeping the type for compatibility but only supporting pocketbase
export type DataSourceType = 'pocketbase';

// Factory for creating product repositories
export class ProductRepositoryFactory {
	/**
	 * Creates a product repository based on the specified data source
	 * @param dataSource - The data source to use ('pocketbase' only)
	 * @returns A ProductRepository implementation
	 */
	static create(dataSource: DataSourceType): ProductRepository {
		console.log('[ProductRepositoryFactory] Creating repository for data source:', dataSource);
		switch (dataSource) {
			case 'pocketbase':
				console.log('[ProductRepositoryFactory] Creating PocketBaseProductRepository');
				return new PocketBaseProductRepository();
			default:
				throw new Error(`Unknown data source: ${dataSource}`);
		}
	}

	/**
	 * Creates a product repository based on environment configuration
	 * @returns A ProductRepository implementation
	 */
	static createFromConfig(): ProductRepository {
		console.log('[ProductRepositoryFactory] Environment variables:');
		console.log('[ProductRepositoryFactory]   POCKETBASE_ENABLED:', process.env.POCKETBASE_ENABLED);
		console.log('[ProductRepositoryFactory]   POCKETBASE_URL:', process.env.POCKETBASE_URL);

		// Since Drizzle repositories have been removed, always use PocketBase
		console.log('[ProductRepositoryFactory] Using PocketBase: true');
		return this.create('pocketbase');
	}

	/**
	 * Creates PocketBase repository for consistency with other factories
	 * @returns PocketBase ProductRepository implementation
	 */
	static createBoth(): { pocketbase: ProductRepository } {
		return {
			pocketbase: new PocketBaseProductRepository()
		};
	}

	/**
	 * Get the default data source (now always PocketBase)
	 */
	static getDefaultDataSource(): DataSourceType {
		return 'pocketbase';
	}

	/**
	 * Check if PocketBase is available (always true now)
	 */
	static isPocketBaseAvailable(): boolean {
		return true;
	}
}
