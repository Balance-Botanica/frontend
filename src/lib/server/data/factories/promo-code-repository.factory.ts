import { DrizzlePromoCodeRepository } from '../repositories/drizzle-promo-code.repository';
import { PocketBasePromoCodeRepository } from '../repositories/pocketbase-promo-code.repository';
import type { PromoCodeRepository } from '../../domain/interfaces/promo-code.interface';

// Data source types
export type PromoCodeDataSourceType = 'drizzle' | 'pocketbase';

// Factory for creating promo code repositories
export class PromoCodeRepositoryFactory {
	/**
	 * Creates a promo code repository based on the specified data source
	 * @param dataSource - The data source to use ('drizzle' or 'pocketbase')
	 * @returns A PromoCodeRepository implementation
	 */
	static create(dataSource: PromoCodeDataSourceType): PromoCodeRepository {
		switch (dataSource) {
			case 'drizzle':
				return new DrizzlePromoCodeRepository();
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
		const usePocketBase = process.env.POCKETBASE_ENABLED === 'true';
		return this.create(usePocketBase ? 'pocketbase' : 'drizzle');
	}

	/**
	 * Creates both repositories for comparison or migration purposes
	 * @returns Object containing both repository implementations
	 */
	static createBoth(): { drizzle: PromoCodeRepository; pocketbase: PromoCodeRepository } {
		return {
			drizzle: new DrizzlePromoCodeRepository(),
			pocketbase: new PocketBasePromoCodeRepository()
		};
	}

	/**
	 * Get the default data source based on environment configuration
	 */
	static getDefaultDataSource(): PromoCodeDataSourceType {
		const usePocketBase = process.env.POCKETBASE_ENABLED === 'true';
		return usePocketBase ? 'pocketbase' : 'drizzle';
	}

	/**
	 * Check if PocketBase is available and enabled
	 */
	static isPocketBaseAvailable(): boolean {
		return process.env.POCKETBASE_ENABLED === 'true';
	}
}
