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
	 * Get user by ID or create if not exists
	 * Note: The userId parameter is the Supabase user ID, but we store our own ID in the database
	 */
	async getOrCreateUser(userId: string, email: string) {
		try {
			console.log('[UserService] Getting or creating user - Supabase ID:', userId, 'Email:', email);

			// First, try to find user by email since that's our unique identifier
			let user = await this.userRepository.getUserByEmail(email);

			if (!user) {
				console.log('[UserService] User not found by email, creating new user with email:', email);
				// Create user with email - the database will generate its own ID
				user = await this.userRepository.createUser({ email });
				console.log('[UserService] User creation result:', user ? 'Success' : 'Failed');
			} else {
				console.log('[UserService] User found by email:', user.id);
			}

			return user;
		} catch (error) {
			console.error('[UserService] Error getting or creating user:', error);
			return null;
		}
	}

	async updateUserProfile(
		userId: string,
		profileData: { firstName?: string; lastName?: string; phoneNumber?: string }
	) {
		try {
			console.log(
				'[UserService] Updating user profile for user:',
				userId,
				'with data:',
				profileData
			);

			// Update user profile
			const result = await this.userRepository.updateUser(userId, profileData);

			console.log('[UserService] User profile update result:', result ? 'Success' : 'Failed');
			return result;
		} catch (error) {
			console.error('[UserService] Error updating user profile:', error);
			return null;
		}
	}

	/**
	 * Get all delivery addresses for a user
	 */
	async getDeliveryAddressesByUserId(userId: string) {
		try {
			console.log('[UserService] Getting delivery addresses for user:', userId);
			const addresses = await this.userRepository.getDeliveryAddressesByUserId(userId);
			console.log('[UserService] Found', addresses.length, 'delivery addresses for user:', userId);
			return addresses;
		} catch (error) {
			console.error('[UserService] Error getting delivery addresses:', error);
			return [];
		}
	}

	/**
	 * Get user delivery address by user ID
	 */
	async getDeliveryAddressByUserId(userId: string) {
		try {
			console.log('[UserService] Getting delivery address for user:', userId);
			const addresses = await this.userRepository.getDeliveryAddressesByUserId(userId);
			const address = addresses.length > 0 ? addresses[0] : null;
			console.log('[UserService] Delivery address result:', address ? 'Found' : 'Not found');
			return address;
		} catch (error) {
			console.error('[UserService] Error getting delivery address:', error);
			return null;
		}
	}

	/**
	 * Save or update user delivery address
	 */
	async saveDeliveryAddress(userId: string, deliveryAddressData: any) {
		try {
			console.log('[UserService] Saving delivery address for user:', userId);
			console.log('[UserService] Delivery address data:', deliveryAddressData);

			// Create new address
			const result = await this.userRepository.createDeliveryAddress({
				userId,
				name: deliveryAddressData.name,
				isDefault: deliveryAddressData.isDefault,
				street: deliveryAddressData.street || '',
				city: deliveryAddressData.city || '',
				postalCode: deliveryAddressData.postalCode || '',
				country: deliveryAddressData.country || 'Ukraine',
				npCityName: deliveryAddressData.npCityName,
				npCityFullName: deliveryAddressData.npCityFullName,
				npWarehouse: deliveryAddressData.npWarehouse,
				useNovaPost: deliveryAddressData.useNovaPost
			});

			console.log('[UserService] Delivery address save result:', result ? 'Success' : 'Failed');
			return result;
		} catch (error) {
			console.error('[UserService] Error saving delivery address:', error);
			return null;
		}
	}

	/**
	 * Update delivery address
	 */
	async updateDeliveryAddress(userId: string, addressId: string, deliveryAddressData: any) {
		try {
			console.log('[UserService] Updating delivery address:', addressId, 'for user:', userId);
			console.log('[UserService] Delivery address update data:', deliveryAddressData);

			// Update existing address
			const result = await this.userRepository.updateDeliveryAddress(addressId, {
				name: deliveryAddressData.name,
				isDefault: deliveryAddressData.isDefault,
				street: deliveryAddressData.street || '',
				city: deliveryAddressData.city || '',
				postalCode: deliveryAddressData.postalCode || '',
				country: deliveryAddressData.country || 'Ukraine',
				npCityName: deliveryAddressData.npCityName,
				npCityFullName: deliveryAddressData.npCityFullName,
				npWarehouse: deliveryAddressData.npWarehouse,
				useNovaPost: deliveryAddressData.useNovaPost
			});

			console.log('[UserService] Delivery address update result:', result ? 'Success' : 'Failed');
			return result;
		} catch (error) {
			console.error('[UserService] Error updating delivery address:', error);
			return null;
		}
	}

	/**
	 * Delete a delivery address
	 */
	async deleteDeliveryAddress(addressId: string) {
		try {
			console.log('[UserService] Deleting delivery address:', addressId);
			const result = await this.userRepository.deleteDeliveryAddressById(addressId);
			console.log('[UserService] Delivery address deletion result:', result ? 'Success' : 'Failed');
			return result;
		} catch (error) {
			console.error('[UserService] Error deleting delivery address:', error);
			return false;
		}
	}
}

// Export singleton instance
export const userService = new UserService();
