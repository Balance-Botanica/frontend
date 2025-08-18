import { DrizzleProductRepository } from '../repositories/drizzle-product.repository';
// TODO: Uncomment when ready to use PocketBase
// import { PocketBaseProductRepository } from '../repositories/pocketbase-product.repository';
import type { ProductRepository } from '../../domain/interfaces/product.interface';

// Data source types
export type DataSourceType = 'drizzle' | 'pocketbase';

// Factory for creating product repositories
// NOTE: Currently defaults to Drizzle. PocketBase is commented out for initial development.
export class ProductRepositoryFactory {
	/**
	 * Creates a product repository based on the specified data source
	 * @param dataSource - The data source to use ('drizzle' or 'pocketbase')
	 * @returns A ProductRepository implementation
	 */
	static create(dataSource: DataSourceType): ProductRepository {
		switch (dataSource) {
			case 'drizzle':
				return new DrizzleProductRepository();
			case 'pocketbase':
				// TODO: Uncomment when ready to use PocketBase
				// return new PocketBaseProductRepository();
				throw new Error('PocketBase is currently disabled. Use Drizzle for now.');
			default:
				throw new Error(`Unknown data source: ${dataSource}`);
		}
	}

	/**
	 * Creates a product repository based on environment configuration
	 * @returns A ProductRepository implementation (defaults to Drizzle)
	 */
	static createFromConfig(): ProductRepository {
		// For now, always use Drizzle regardless of env var
		// TODO: Enable PocketBase when ready
		// const usePocketBase = process.env.POCKETBASE_ENABLED === 'true';
		// return this.create(usePocketBase ? 'pocketbase' : 'drizzle');
		return this.create('drizzle');
	}

	/**
	 * Creates both repositories for comparison or migration purposes
	 * @returns Object containing both repository implementations
	 */
	static createBoth(): { drizzle: ProductRepository; pocketbase: ProductRepository | null } {
		return {
			drizzle: new DrizzleProductRepository(),
			pocketbase: null // TODO: Enable when ready
			// pocketbase: new PocketBaseProductRepository()
		};
	}

	/**
	 * Get the default data source (always Drizzle for now)
	 */
	static getDefaultDataSource(): DataSourceType {
		return 'drizzle';
	}

	/**
	 * Check if PocketBase is available
	 */
	static isPocketBaseAvailable(): boolean {
		return false; // TODO: Enable when ready
	}
}
