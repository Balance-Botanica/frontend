import { ProductRepositoryFactory } from '$lib/server/data/repositories/product-repository.factory';
import { DrizzleUserRepository } from '$lib/server/data/repositories/drizzle-user.repository';
import type { UserRepository } from '$lib/server/domain/interfaces/user.interface';

export class UserService {
	private userRepository: UserRepository;

	constructor() {
		// For now, we'll use the Drizzle repository directly
		// In a more complex system, we might use a factory pattern like ProductRepositoryFactory
		this.userRepository = new DrizzleUserRepository();
	}

	/**
	 * Get user delivery address by user ID
	 */
	async getDeliveryAddressByUserId(userId: string) {
		try {
			return await this.userRepository.getDeliveryAddressByUserId(userId);
		} catch (error) {
			console.error('Error getting delivery address:', error);
			return null;
		}
	}

	/**
	 * Save or update user delivery address
	 */
	async saveDeliveryAddress(userId: string, deliveryAddressData: any) {
		try {
			// Check if user already has a delivery address
			const existingAddress = await this.userRepository.getDeliveryAddressByUserId(userId);

			if (existingAddress) {
				// Update existing address
				return await this.userRepository.updateDeliveryAddress(userId, {
					street: deliveryAddressData.street,
					city: deliveryAddressData.city,
					postalCode: deliveryAddressData.postalCode,
					country: deliveryAddressData.country
				});
			} else {
				// Create new address
				return await this.userRepository.createDeliveryAddress({
					userId,
					street: deliveryAddressData.street,
					city: deliveryAddressData.city,
					postalCode: deliveryAddressData.postalCode,
					country: deliveryAddressData.country
				});
			}
		} catch (error) {
			console.error('Error saving delivery address:', error);
			return null;
		}
	}
}

// Export singleton instance
export const userService = new UserService();
