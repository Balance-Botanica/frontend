import { config } from 'dotenv';
// Removed DrizzlePromoCodeRepository import since it doesn't exist
import { PocketBasePromoCodeRepository } from '../repositories/pocketbase-promo-code.repository';
import type { PromoCodeRepository } from '../../domain/interfaces/promo-code.interface';

// Load environment variables
config();

// Data source types - keeping the type for compatibility but only supporting pocketbase
export type PromoCodeDataSourceType = 'pocketbase';

// Factory for creating promo code repositories
export class PromoCodeRepositoryFactory {
	/**
	 * Creates a promo code repository based on the specified data source
	 * @param dataSource - The data source to use ('pocketbase' only)
	 * @returns A PromoCodeRepository implementation
	 */
	static create(dataSource: PromoCodeDataSourceType): PromoCodeRepository {
		switch (dataSource) {
			case 'pocketbase':
				return new PocketBasePromoCodeRepository();
			default:
				throw new Error(`Unknown promo code data source: ${dataSource}`);
		}
	}

	/**
	 * Creates a promo code repository based on environment configuration
	 * @returns A PromoCodeRepository implementation
	 */
	static createFromConfig(): PromoCodeRepository {
		// Since Drizzle repositories have been removed, always use PocketBase
		return this.create('pocketbase');
	}

	/**
	 * Creates PocketBase repository for consistency with other factories
	 * @returns PocketBase PromoCodeRepository implementation
	 */
	static createBoth(): { pocketbase: PromoCodeRepository } {
		return {
			pocketbase: new PocketBasePromoCodeRepository()
		};
	}

	/**
	 * Get the default data source (now always PocketBase)
	 */
	static getDefaultDataSource(): PromoCodeDataSourceType {
		return 'pocketbase';
	}

	/**
	 * Check if PocketBase is available (always true now)
	 */
	static isPocketBaseAvailable(): boolean {
		return true;
	}
}
