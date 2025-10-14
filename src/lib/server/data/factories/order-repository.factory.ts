import { config } from 'dotenv';
// Removed DrizzleOrderRepository import since it doesn't exist
import { PocketBaseOrderRepository } from '../repositories/pocketbase-order.repository';
import type { OrderRepository } from '../../domain/interfaces/order.interface';

// Load environment variables
config();

// Data source types - keeping the type for compatibility but only supporting pocketbase
export type OrderDataSourceType = 'pocketbase';

// Factory for creating order repositories
export class OrderRepositoryFactory {
	/**
	 * Creates an order repository based on the specified data source
	 * @param dataSource - The data source to use ('pocketbase' only)
	 * @returns An OrderRepository implementation
	 */
	static create(dataSource: OrderDataSourceType): OrderRepository {
		switch (dataSource) {
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
		// Since Drizzle repositories have been removed, always use PocketBase
		return this.create('pocketbase');
	}

	/**
	 * Creates PocketBase repository for consistency with other factories
	 * @returns PocketBase OrderRepository implementation
	 */
	static createBoth(): { pocketbase: OrderRepository } {
		return {
			pocketbase: new PocketBaseOrderRepository()
		};
	}

	/**
	 * Get the default data source (now always PocketBase)
	 */
	static getDefaultDataSource(): OrderDataSourceType {
		return 'pocketbase';
	}

	/**
	 * Check if PocketBase is available (always true now)
	 */
	static isPocketBaseAvailable(): boolean {
		return true;
	}
}
