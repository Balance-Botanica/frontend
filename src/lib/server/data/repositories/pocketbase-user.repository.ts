import { getAuthenticatedClient } from '../../pocketbase/index';
import type {
	UserRepository,
	User,
	DeliveryAddress,
	CreateUserData,
	CreateDeliveryAddressData,
	UpdateDeliveryAddressData,
	UpdateUserData
} from '../../domain/interfaces/user.interface';

// PocketBase implementation of UserRepository
export class PocketBaseUserRepository implements UserRepository {
	async getUserById(id: string): Promise<User | null> {
		try {
			console.log('[PocketBaseUserRepository] Attempting to fetch user by ID:', id);
			const pb = await getAuthenticatedClient();
			const record = await pb.collection('users').getOne(id);
			const user = this.mapUserToDomain(record);
			console.log('[PocketBaseUserRepository] User fetch result:', user ? 'Found' : 'Not found');
			return user;
		} catch (error) {
			console.error('[PocketBaseUserRepository] Error fetching user from PocketBase:', error);
			return null;
		}
	}

	async getUserByEmail(email: string): Promise<User | null> {
		try {
			console.log('[PocketBaseUserRepository] Attempting to fetch user by email:', email);
			const pb = await getAuthenticatedClient();
			const records = await pb.collection('users').getList(1, 1, {
				filter: `email = "${email}"`
			});

			const user = records.items[0] ? this.mapUserToDomain(records.items[0]) : null;
			console.log(
				'[PocketBaseUserRepository] User fetch by email result:',
				user ? 'Found' : 'Not found'
			);
			return user;
		} catch (error) {
			console.error(
				'[PocketBaseUserRepository] Error fetching user by email from PocketBase:',
				error
			);
			return null;
		}
	}

	async createUser(data: CreateUserData): Promise<User | null> {
		try {
			console.log('[PocketBaseUserRepository] Creating new user with data:', data);
			const pb = await getAuthenticatedClient();

			const record = await pb.collection('users').create({
				email: data.email,
				first_name: data.firstName || null,
				last_name: data.lastName || null,
				phone_number: data.phoneNumber || null,
				created: new Date().toISOString()
			});

			const user = this.mapUserToDomain(record);
			console.log('[PocketBaseUserRepository] User creation result:', user ? 'Success' : 'Failed');
			return user;
		} catch (error) {
			console.error('[PocketBaseUserRepository] Error creating user in PocketBase:', error);
			return null;
		}
	}

	async updateUser(id: string, data: UpdateUserData): Promise<User | null> {
		try {
			console.log('[PocketBaseUserRepository] Updating user', id, 'with data:', data);
			const pb = await getAuthenticatedClient();

			const updateData: any = {};
			if (data.firstName !== undefined) updateData.first_name = data.firstName;
			if (data.lastName !== undefined) updateData.last_name = data.lastName;
			if (data.phoneNumber !== undefined) updateData.phone_number = data.phoneNumber;

			const record = await pb.collection('users').update(id, updateData);
			const user = this.mapUserToDomain(record);
			console.log('[PocketBaseUserRepository] User update result:', user ? 'Success' : 'Failed');
			return user;
		} catch (error) {
			console.error('[PocketBaseUserRepository] Error updating user in PocketBase:', error);
			return null;
		}
	}

	async getDeliveryAddressesByUserId(userId: string): Promise<DeliveryAddress[]> {
		try {
			console.log('[PocketBaseUserRepository] Fetching delivery addresses for user:', userId);
			const pb = await getAuthenticatedClient();
			const records = await pb.collection('delivery_addresses').getList(1, 50, {
				filter: `user_id = "${userId}"`,
				sort: '-is_default,-created'
			});

			const addresses = records.items.map((record) => this.mapDeliveryAddressToDomain(record));
			console.log(
				'[PocketBaseUserRepository] Found',
				addresses.length,
				'delivery addresses for user'
			);
			return addresses;
		} catch (error) {
			console.error(
				'[PocketBaseUserRepository] Error fetching delivery addresses from PocketBase:',
				error
			);
			return [];
		}
	}

	async getDeliveryAddressById(id: string): Promise<DeliveryAddress | null> {
		try {
			console.log('[PocketBaseUserRepository] Fetching delivery address by ID:', id);
			const pb = await getAuthenticatedClient();
			const record = await pb.collection('delivery_addresses').getOne(id);
			const address = this.mapDeliveryAddressToDomain(record);
			console.log(
				'[PocketBaseUserRepository] Delivery address fetch result:',
				address ? 'Found' : 'Not found'
			);
			return address;
		} catch (error) {
			console.error(
				'[PocketBaseUserRepository] Error fetching delivery address from PocketBase:',
				error
			);
			return null;
		}
	}

	async createDeliveryAddress(data: CreateDeliveryAddressData): Promise<DeliveryAddress | null> {
		try {
			console.log('[PocketBaseUserRepository] Creating delivery address with data:', data);
			const pb = await getAuthenticatedClient();

			// If this is marked as default, clear other default addresses
			if (data.isDefault) {
				console.log(
					'[PocketBaseUserRepository] Clearing other default addresses for user:',
					data.userId
				);
				const existingAddresses = await this.getDeliveryAddressesByUserId(data.userId);
				for (const address of existingAddresses) {
					if (address.isDefault) {
						await pb.collection('delivery_addresses').update(address.id, { is_default: false });
					}
				}
			}

			// If no addresses exist yet, make this one default
			const existingAddresses = await this.getDeliveryAddressesByUserId(data.userId);
			const shouldBeDefault = data.isDefault || existingAddresses.length === 0;
			console.log('[PocketBaseUserRepository] Address should be default:', shouldBeDefault);

			const now = new Date().toISOString();

			const record = await pb.collection('delivery_addresses').create({
				user_id: data.userId,
				name: data.name || null,
				is_default: shouldBeDefault,
				country: data.country,
				// Nova Poshta fields
				np_city_name: data.npCityName || null,
				np_city_full_name: data.npCityFullName || null,
				np_warehouse: data.npWarehouse || null,
				use_nova_post: data.useNovaPost || false,
				created: now,
				updated: now
			});

			const address = this.mapDeliveryAddressToDomain(record);
			console.log(
				'[PocketBaseUserRepository] Delivery address creation result:',
				address ? 'Success' : 'Failed'
			);
			return address;
		} catch (error) {
			console.error(
				'[PocketBaseUserRepository] Error creating delivery address in PocketBase:',
				error
			);
			return null;
		}
	}

	async updateDeliveryAddress(
		id: string,
		data: UpdateDeliveryAddressData
	): Promise<DeliveryAddress | null> {
		try {
			console.log('[PocketBaseUserRepository] Updating delivery address', id, 'with data:', data);
			const pb = await getAuthenticatedClient();

			const updateData: any = {};
			const now = new Date().toISOString();

			if (data.name !== undefined) updateData.name = data.name;
			if (data.country !== undefined) updateData.country = data.country;

			// Nova Poshta fields
			if (data.npCityName !== undefined) updateData.np_city_name = data.npCityName;
			if (data.npCityFullName !== undefined) updateData.np_city_full_name = data.npCityFullName;
			if (data.npWarehouse !== undefined) updateData.np_warehouse = data.npWarehouse;
			if (data.useNovaPost !== undefined) updateData.use_nova_post = data.useNovaPost;

			// Handle default flag
			if (data.isDefault) {
				// Get the address to find its user ID
				const address = await this.getDeliveryAddressById(id);
				if (address) {
					console.log(
						'[PocketBaseUserRepository] Clearing other default addresses for user:',
						address.userId
					);
					// Clear other default addresses for this user
					const userAddresses = await this.getDeliveryAddressesByUserId(address.userId);
					for (const userAddress of userAddresses) {
						if (userAddress.isDefault && userAddress.id !== id) {
							await pb
								.collection('delivery_addresses')
								.update(userAddress.id, { is_default: false });
						}
					}
				}
				updateData.is_default = true;
			} else if (data.isDefault === false) {
				updateData.is_default = false;
			}

			updateData.updated = now;

			const record = await pb.collection('delivery_addresses').update(id, updateData);
			const address = this.mapDeliveryAddressToDomain(record);
			console.log(
				'[PocketBaseUserRepository] Delivery address update result:',
				address ? 'Success' : 'Failed'
			);
			return address;
		} catch (error) {
			console.error(
				'[PocketBaseUserRepository] Error updating delivery address in PocketBase:',
				error
			);
			return null;
		}
	}

	async deleteDeliveryAddressById(id: string): Promise<boolean> {
		try {
			console.log('[PocketBaseUserRepository] Deleting delivery address:', id);
			const pb = await getAuthenticatedClient();
			await pb.collection('delivery_addresses').delete(id);
			console.log('[PocketBaseUserRepository] Delivery address deleted successfully');
			return true;
		} catch (error) {
			console.error(
				'[PocketBaseUserRepository] Error deleting delivery address from PocketBase:',
				error
			);
			return false;
		}
	}

	async setDefaultAddress(userId: string, addressId: string): Promise<boolean> {
		try {
			console.log(
				'[PocketBaseUserRepository] Setting default address for user:',
				userId,
				'address:',
				addressId
			);
			const pb = await getAuthenticatedClient();

			// First, clear all default addresses for this user
			const userAddresses = await this.getDeliveryAddressesByUserId(userId);
			for (const address of userAddresses) {
				if (address.isDefault) {
					await pb.collection('delivery_addresses').update(address.id, { is_default: false });
				}
			}

			// Then set the specified address as default
			await pb.collection('delivery_addresses').update(addressId, { is_default: true });

			console.log('[PocketBaseUserRepository] Default address set successfully');
			return true;
		} catch (error) {
			console.error(
				'[PocketBaseUserRepository] Error setting default address in PocketBase:',
				error
			);
			return false;
		}
	}

	// Helper methods for mapping PocketBase records to domain objects
	private mapUserToDomain(record: any): User {
		return {
			id: record.id,
			email: record.email,
			firstName: record.first_name,
			lastName: record.last_name,
			phoneNumber: record.phone_number,
			createdAt: new Date(record.created)
		};
	}

	private mapDeliveryAddressToDomain(record: any): DeliveryAddress {
		return {
			id: record.id,
			userId: record.user_id,
			name: record.name,
			isDefault: record.is_default,
			country: record.country,
			npCityName: record.np_city_name,
			npCityFullName: record.np_city_full_name,
			npWarehouse: record.np_warehouse,
			useNovaPost: record.use_nova_post,
			createdAt: new Date(record.created),
			updatedAt: new Date(record.updated)
		};
	}
}
