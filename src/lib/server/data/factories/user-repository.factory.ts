import { config } from 'dotenv';
// Removed DrizzleUserRepository import since it doesn't exist
import { PocketBaseUserRepository } from '../repositories/pocketbase-user.repository';
import type { UserRepository } from '../../domain/interfaces/user.interface';

// Load environment variables
config();

// Data source types - keeping the type for compatibility but only supporting pocketbase
export type UserDataSourceType = 'pocketbase';

// Factory for creating user repositories
export class UserRepositoryFactory {
	/**
	 * Creates a user repository based on the specified data source
	 * @param dataSource - The data source to use ('pocketbase' only)
	 * @returns A UserRepository implementation
	 */
	static create(dataSource: UserDataSourceType): UserRepository {
		console.log('[UserRepositoryFactory] Creating repository for data source:', dataSource);
		switch (dataSource) {
			case 'pocketbase':
				console.log('[UserRepositoryFactory] Creating PocketBaseUserRepository');
				return new PocketBaseUserRepository();
			default:
				throw new Error(`Unknown user data source: ${dataSource}`);
		}
	}

	/**
	 * Creates a user repository based on environment configuration
	 * @returns A UserRepository implementation
	 */
	static createFromConfig(): UserRepository {
		console.log('[UserRepositoryFactory] Environment variables:');
		console.log('[UserRepositoryFactory]   POCKETBASE_ENABLED:', process.env.POCKETBASE_ENABLED);
		console.log('[UserRepositoryFactory]   POCKETBASE_URL:', process.env.POCKETBASE_URL);

		// Since Drizzle repositories have been removed, always use PocketBase
		console.log('[UserRepositoryFactory] Using PocketBase: true');
		return this.create('pocketbase');
	}

	/**
	 * Creates PocketBase repository for consistency with other factories
	 * @returns PocketBase UserRepository implementation
	 */
	static createBoth(): { pocketbase: UserRepository } {
		return {
			pocketbase: new PocketBaseUserRepository()
		};
	}

	/**
	 * Get the default data source (now always PocketBase)
	 */
	static getDefaultDataSource(): UserDataSourceType {
		return 'pocketbase';
	}

	/**
	 * Check if PocketBase is available (always true now)
	 */
	static isPocketBaseAvailable(): boolean {
		return true;
	}
}
