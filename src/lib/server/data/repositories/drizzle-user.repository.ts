import { eq } from 'drizzle-orm';
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
			const results = await db.select().from(users).where(eq(users.id, id)).limit(1);
			return results[0] ? this.mapUserToDomain(results[0]) : null;
		} catch (error) {
			console.error('Error fetching user from Drizzle:', error);
			return null;
		}
	}

	async getUserByEmail(email: string): Promise<User | null> {
		try {
			const results = await db.select().from(users).where(eq(users.email, email)).limit(1);
			return results[0] ? this.mapUserToDomain(results[0]) : null;
		} catch (error) {
			console.error('Error fetching user by email from Drizzle:', error);
			return null;
		}
	}

	async createUser(data: CreateUserData): Promise<User | null> {
		try {
			const id = crypto.randomUUID();
			const now = new Date();

			const insertData = {
				id,
				email: data.email,
				created_at: Math.floor(now.getTime() / 1000)
			};

			const newUser = await db.insert(users).values(insertData).returning();
			return newUser[0] ? this.mapUserToDomain(newUser[0]) : null;
		} catch (error) {
			console.error('Error creating user in Drizzle:', error);
			return null;
		}
	}

	async getDeliveryAddressByUserId(userId: string): Promise<DeliveryAddress | null> {
		try {
			const results = await db
				.select()
				.from(deliveryAddresses)
				.where(eq(deliveryAddresses.userId, userId))
				.limit(1);

			return results[0] ? this.mapDeliveryAddressToDomain(results[0]) : null;
		} catch (error) {
			console.error('Error fetching delivery address from Drizzle:', error);
			return null;
		}
	}

	async createDeliveryAddress(data: CreateDeliveryAddressData): Promise<DeliveryAddress | null> {
		try {
			const id = crypto.randomUUID();
			const now = new Date();

			const insertData = {
				id,
				userId: data.userId,
				street: data.street,
				city: data.city,
				postalCode: data.postalCode,
				country: data.country,
				created_at: Math.floor(now.getTime() / 1000),
				updated_at: Math.floor(now.getTime() / 1000)
			};

			const newAddress = await db.insert(deliveryAddresses).values(insertData).returning();
			return newAddress[0] ? this.mapDeliveryAddressToDomain(newAddress[0]) : null;
		} catch (error) {
			console.error('Error creating delivery address in Drizzle:', error);
			return null;
		}
	}

	async updateDeliveryAddress(
		userId: string,
		data: UpdateDeliveryAddressData
	): Promise<DeliveryAddress | null> {
		try {
			const updateData: any = {};

			if (data.street !== undefined) updateData.street = data.street;
			if (data.city !== undefined) updateData.city = data.city;
			if (data.postalCode !== undefined) updateData.postalCode = data.postalCode;
			if (data.country !== undefined) updateData.country = data.country;

			updateData.updated_at = Math.floor(new Date().getTime() / 1000);

			const updatedAddress = await db
				.update(deliveryAddresses)
				.set(updateData)
				.where(eq(deliveryAddresses.userId, userId))
				.returning();

			return updatedAddress[0] ? this.mapDeliveryAddressToDomain(updatedAddress[0]) : null;
		} catch (error) {
			console.error('Error updating delivery address in Drizzle:', error);
			return null;
		}
	}

	async deleteDeliveryAddress(userId: string): Promise<boolean> {
		try {
			await db.delete(deliveryAddresses).where(eq(deliveryAddresses.userId, userId));
			return true;
		} catch (error) {
			console.error('Error deleting delivery address from Drizzle:', error);
			return false;
		}
	}

	// Map Drizzle user schema to domain model
	private mapUserToDomain(dbUser: any): User {
		return {
			id: dbUser.id,
			email: dbUser.email,
			createdAt: new Date(dbUser.created_at * 1000) // Convert from Unix timestamp
		};
	}

	// Map Drizzle delivery address schema to domain model
	private mapDeliveryAddressToDomain(dbAddress: any): DeliveryAddress {
		return {
			id: dbAddress.id,
			userId: dbAddress.user_id,
			street: dbAddress.street,
			city: dbAddress.city,
			postalCode: dbAddress.postal_code,
			country: dbAddress.country,
			createdAt: new Date(dbAddress.created_at * 1000), // Convert from Unix timestamp
			updatedAt: new Date(dbAddress.updated_at * 1000) // Convert from Unix timestamp
		};
	}
}
