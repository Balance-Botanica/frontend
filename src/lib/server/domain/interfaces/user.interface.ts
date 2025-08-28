// Domain interface for users - defines the contract
export interface User {
	id: string;
	email: string;
	createdAt: Date;
}

// Delivery address interface
export interface DeliveryAddress {
	id: string;
	userId: string;
	street: string;
	city: string;
	postalCode: string;
	country: string;
	createdAt: Date;
	updatedAt: Date;
}

// User creation data (without auto-generated fields)
export interface CreateUserData {
	email: string;
}

// Delivery address creation data
export interface CreateDeliveryAddressData {
	userId: string;
	street: string;
	city: string;
	postalCode: string;
	country: string;
}

// Delivery address update data (partial)
export interface UpdateDeliveryAddressData {
	street?: string;
	city?: string;
	postalCode?: string;
	country?: string;
}

// User repository interface - defines the contract for user data access
export interface UserRepository {
	// User operations
	getUserById(id: string): Promise<User | null>;
	getUserByEmail(email: string): Promise<User | null>;
	createUser(data: CreateUserData): Promise<User | null>;

	// Delivery address operations
	getDeliveryAddressByUserId(userId: string): Promise<DeliveryAddress | null>;
	createDeliveryAddress(data: CreateDeliveryAddressData): Promise<DeliveryAddress | null>;
	updateDeliveryAddress(
		userId: string,
		data: UpdateDeliveryAddressData
	): Promise<DeliveryAddress | null>;
	deleteDeliveryAddress(userId: string): Promise<boolean>;
}
