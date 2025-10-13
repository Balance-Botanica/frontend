import { DrizzleUserRepository } from '../repositories/drizzle-user.repository';
import { PocketBaseUserRepository } from '../repositories/pocketbase-user.repository';
import type { UserRepository } from '../../domain/interfaces/user.interface';

// Data source types
export type UserDataSourceType = 'drizzle' | 'pocketbase';

// Factory for creating user repositories
export class UserRepositoryFactory {
	/**
	 * Creates a user repository based on the specified data source
	 * @param dataSource - The data source to use ('drizzle' or 'pocketbase')
	 * @returns A UserRepository implementation
	 */
	static create(dataSource: UserDataSourceType): UserRepository {
		switch (dataSource) {
			case 'drizzle':
				return new DrizzleUserRepository();
			case 'pocketbase':
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
		const usePocketBase = process.env.POCKETBASE_ENABLED === 'true';
		return this.create(usePocketBase ? 'pocketbase' : 'drizzle');
	}

	/**
	 * Creates both repositories for comparison or migration purposes
	 * @returns Object containing both repository implementations
	 */
	static createBoth(): { drizzle: UserRepository; pocketbase: UserRepository } {
		return {
			drizzle: new DrizzleUserRepository(),
			pocketbase: new PocketBaseUserRepository()
		};
	}

	/**
	 * Get the default data source based on environment configuration
	 */
	static getDefaultDataSource(): UserDataSourceType {
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
