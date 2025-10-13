import { DrizzleOrderRepository } from '../repositories/drizzle-order.repository';
import { PocketBaseOrderRepository } from '../repositories/pocketbase-order.repository';
import type { OrderRepository } from '../../domain/interfaces/order.interface';

// Data source types
export type OrderDataSourceType = 'drizzle' | 'pocketbase';

// Factory for creating order repositories
export class OrderRepositoryFactory {
	/**
	 * Creates an order repository based on the specified data source
	 * @param dataSource - The data source to use ('drizzle' or 'pocketbase')
	 * @returns An OrderRepository implementation
	 */
	static create(dataSource: OrderDataSourceType): OrderRepository {
		switch (dataSource) {
			case 'drizzle':
				return new DrizzleOrderRepository();
			case 'pocketbase':
				return new PocketBaseOrderRepository();
			default:
				throw new Error(`Unknown order data source: ${dataSource}`);
		}
	}

	/**
	 * Creates an order repository based on environment configuration
	 * @returns An OrderRepository implementation
	 */
	static createFromConfig(): OrderRepository {
		const usePocketBase = process.env.POCKETBASE_ENABLED === 'true';
		return this.create(usePocketBase ? 'pocketbase' : 'drizzle');
	}

	/**
	 * Creates both repositories for comparison or migration purposes
	 * @returns Object containing both repository implementations
	 */
	static createBoth(): { drizzle: OrderRepository; pocketbase: OrderRepository } {
		return {
			drizzle: new DrizzleOrderRepository(),
			pocketbase: new PocketBaseOrderRepository()
		};
	}

	/**
	 * Get the default data source based on environment configuration
	 */
	static getDefaultDataSource(): OrderDataSourceType {
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
