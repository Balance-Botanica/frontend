import { eq, and } from 'drizzle-orm';
import { db } from '../../db/index';
import { users, deliveryAddresses } from '../../db/schema';
import type {
	UserRepository,
	User,
	DeliveryAddress,
	CreateUserData,
	CreateDeliveryAddressData,
	UpdateDeliveryAddressData
} from '../../domain/interfaces/user.interface';

// Drizzle implementation of UserRepository
export class DrizzleUserRepository implements UserRepository {
	async getUserById(id: string): Promise<User | null> {
		try {
			console.log('[DrizzleUserRepository] Attempting to fetch user by database ID:', id);
			const results = await db.select().from(users).where(eq(users.id, id)).limit(1);
			const user = results[0] ? this.mapUserToDomain(results[0]) : null;
			console.log('[DrizzleUserRepository] User fetch result:', user ? 'Found' : 'Not found');
			return user;
		} catch (error) {
			console.error('[DrizzleUserRepository] Error fetching user from Drizzle:', error);
			return null;
		}
	}

	async getUserByEmail(email: string): Promise<User | null> {
		try {
			console.log('[DrizzleUserRepository] Attempting to fetch user by email:', email);
			const results = await db.select().from(users).where(eq(users.email, email)).limit(1);
			const user = results[0] ? this.mapUserToDomain(results[0]) : null;
			console.log(
				'[DrizzleUserRepository] User fetch by email result:',
				user ? 'Found' : 'Not found'
			);
			return user;
		} catch (error) {
			console.error('[DrizzleUserRepository] Error fetching user by email from Drizzle:', error);
			return null;
		}
	}

	async createUser(data: CreateUserData): Promise<User | null> {
		try {
			console.log('[DrizzleUserRepository] Creating new user with data:', data);
			const id = crypto.randomUUID();
			const now = new Date();

			const insertData = {
				id,
				email: data.email,
				createdAt: now
			};

			const newUser = await db.insert(users).values(insertData).returning();
			const user = newUser[0] ? this.mapUserToDomain(newUser[0]) : null;
			console.log('[DrizzleUserRepository] User creation result:', user ? 'Success' : 'Failed');
			return user;
		} catch (error) {
			console.error('[DrizzleUserRepository] Error creating user in Drizzle:', error);
			return null;
		}
	}

	async getDeliveryAddressesByUserId(userId: string): Promise<DeliveryAddress[]> {
		try {
			console.log('[DrizzleUserRepository] Fetching delivery addresses for user:', userId);
			const results = await db
				.select()
				.from(deliveryAddresses)
				.where(eq(deliveryAddresses.userId, userId))
				.orderBy(deliveryAddresses.isDefault, deliveryAddresses.createdAt);

			const addresses = results.map((address) => this.mapDeliveryAddressToDomain(address));
			console.log('[DrizzleUserRepository] Found', addresses.length, 'delivery addresses for user');
			return addresses;
		} catch (error) {
			console.error(
				'[DrizzleUserRepository] Error fetching delivery addresses from Drizzle:',
				error
			);
			return [];
		}
	}

	async getDeliveryAddressById(id: string): Promise<DeliveryAddress | null> {
		try {
			console.log('[DrizzleUserRepository] Fetching delivery address by ID:', id);
			const results = await db
				.select()
				.from(deliveryAddresses)
				.where(eq(deliveryAddresses.id, id))
				.limit(1);

			const address = results[0] ? this.mapDeliveryAddressToDomain(results[0]) : null;
			console.log(
				'[DrizzleUserRepository] Delivery address fetch result:',
				address ? 'Found' : 'Not found'
			);
			return address;
		} catch (error) {
			console.error('[DrizzleUserRepository] Error fetching delivery address from Drizzle:', error);
			return null;
		}
	}

	async createDeliveryAddress(data: CreateDeliveryAddressData): Promise<DeliveryAddress | null> {
		try {
			console.log('[DrizzleUserRepository] Creating delivery address with data:', data);
			const id = crypto.randomUUID();
			const now = new Date();

			// If this is the first address or marked as default, clear other default addresses
			if (data.isDefault) {
				console.log(
					'[DrizzleUserRepository] Clearing other default addresses for user:',
					data.userId
				);
				await db
					.update(deliveryAddresses)
					.set({ isDefault: false })
					.where(eq(deliveryAddresses.userId, data.userId));
			}

			// If no addresses exist yet, make this one default
			const existingAddresses = await this.getDeliveryAddressesByUserId(data.userId);
			const shouldBeDefault = data.isDefault || existingAddresses.length === 0;
			console.log('[DrizzleUserRepository] Address should be default:', shouldBeDefault);

			const insertData = {
				id,
				userId: data.userId,
				name: data.name || null,
				isDefault: shouldBeDefault,
				country: data.country,
				// Nova Poshta fields
				npCityName: data.npCityName || null,
				npCityFullName: data.npCityFullName || null,
				npWarehouse: data.npWarehouse || null,
				useNovaPost: data.useNovaPost,
				createdAt: now,
				updatedAt: now
			};

			const newAddress = await db.insert(deliveryAddresses).values(insertData).returning();
			const address = newAddress[0] ? this.mapDeliveryAddressToDomain(newAddress[0]) : null;
			console.log(
				'[DrizzleUserRepository] Delivery address creation result:',
				address ? 'Success' : 'Failed'
			);
			return address;
		} catch (error) {
			console.error('[DrizzleUserRepository] Error creating delivery address in Drizzle:', error);
			return null;
		}
	}

	async updateDeliveryAddress(
		id: string,
		data: UpdateDeliveryAddressData
	): Promise<DeliveryAddress | null> {
		try {
			console.log('[DrizzleUserRepository] Updating delivery address', id, 'with data:', data);
			const updateData: any = {};
			const now = new Date();

			if (data.name !== undefined) updateData.name = data.name;
			if (data.country !== undefined) updateData.country = data.country;

			// Nova Poshta fields
			if (data.npCityName !== undefined) updateData.npCityName = data.npCityName;
			if (data.npCityFullName !== undefined) updateData.npCityFullName = data.npCityFullName;
			if (data.npWarehouse !== undefined) updateData.npWarehouse = data.npWarehouse;
			if (data.useNovaPost !== undefined) updateData.useNovaPost = data.useNovaPost;

			// Handle default flag
			if (data.isDefault) {
				// Get the address to find its user ID
				const address = await this.getDeliveryAddressById(id);
				if (address) {
					console.log(
						'[DrizzleUserRepository] Clearing other default addresses for user:',
						address.userId
					);
					// Clear other default addresses for this user
					await db
						.update(deliveryAddresses)
						.set({ isDefault: false })
						.where(eq(deliveryAddresses.userId, address.userId));
				}
				updateData.isDefault = true;
			} else if (data.isDefault === false) {
				updateData.isDefault = false;
			}

			updateData.updatedAt = now;

			const updatedAddress = await db
				.update(deliveryAddresses)
				.set(updateData)
				.where(eq(deliveryAddresses.id, id))
				.returning();

			const address = updatedAddress[0] ? this.mapDeliveryAddressToDomain(updatedAddress[0]) : null;
			console.log(
				'[DrizzleUserRepository] Delivery address update result:',
				address ? 'Success' : 'Failed'
			);
			return address;
		} catch (error) {
			console.error('[DrizzleUserRepository] Error updating delivery address in Drizzle:', error);
			return null;
		}
	}

	async deleteDeliveryAddressById(id: string): Promise<boolean> {
		try {
			console.log('[DrizzleUserRepository] Deleting delivery address:', id);
			// Get the address first to see if it's default
			const address = await this.getDeliveryAddressById(id);

			// Delete the address
			await db.delete(deliveryAddresses).where(eq(deliveryAddresses.id, id));
			console.log('[DrizzleUserRepository] Delivery address deleted successfully');
			return true;
		} catch (error) {
			console.error('[DrizzleUserRepository] Error deleting delivery address from Drizzle:', error);
			return false;
		}
	}

	async updateUser(id: string, data: Partial<User>): Promise<User | null> {
		try {
			console.log('[DrizzleUserRepository] Updating user', id, 'with data:', data);
			const updateData: any = {};
			const now = new Date();

			if (data.firstName !== undefined) updateData.firstName = data.firstName;
			if (data.lastName !== undefined) updateData.lastName = data.lastName;
			if (data.phoneNumber !== undefined) updateData.phoneNumber = data.phoneNumber;

			const updatedUser = await db
				.update(users)
				.set(updateData)
				.where(eq(users.id, id))
				.returning();

			const user = updatedUser[0] ? this.mapUserToDomain(updatedUser[0]) : null;
			console.log('[DrizzleUserRepository] User update result:', user ? 'Success' : 'Failed');
			return user;
		} catch (error) {
			console.error('[DrizzleUserRepository] Error updating user in Drizzle:', error);
			return null;
		}
	}

	async setDefaultAddress(userId: string, addressId: string): Promise<boolean> {
		try {
			console.log(
				'[DrizzleUserRepository] Setting default address for user:',
				userId,
				'address:',
				addressId
			);

			// First, clear all default addresses for this user
			await db
				.update(deliveryAddresses)
				.set({ isDefault: false })
				.where(eq(deliveryAddresses.userId, userId));

			// Then set the specified address as default
			await db
				.update(deliveryAddresses)
				.set({ isDefault: true })
				.where(eq(deliveryAddresses.id, addressId));

			console.log('[DrizzleUserRepository] Default address set successfully');
			return true;
		} catch (error) {
			console.error('[DrizzleUserRepository] Error setting default address in Drizzle:', error);
			return false;
		}
	}

	// Helper methods for mapping database records to domain objects
	private mapUserToDomain(dbUser: any): User {
		return {
			id: dbUser.id,
			email: dbUser.email,
			firstName: dbUser.firstName,
			lastName: dbUser.lastName,
			phoneNumber: dbUser.phoneNumber,
			createdAt: dbUser.createdAt
		};
	}

	private mapDeliveryAddressToDomain(dbAddress: any): DeliveryAddress {
		return {
			id: dbAddress.id,
			userId: dbAddress.userId,
			name: dbAddress.name,
			isDefault: dbAddress.isDefault,
			country: dbAddress.country,
			npCityName: dbAddress.npCityName,
			npCityFullName: dbAddress.npCityFullName,
			npWarehouse: dbAddress.npWarehouse,
			useNovaPost: dbAddress.useNovaPost,
			createdAt: dbAddress.createdAt,
			updatedAt: dbAddress.updatedAt
		};
	}
}
