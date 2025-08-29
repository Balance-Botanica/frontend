// Domain interface for users - defines the contract
export interface User {
	id: string;
	email: string;
	firstName?: string;
	lastName?: string;
	phoneNumber?: string;
	createdAt: Date;
}

// Delivery address interface
export interface DeliveryAddress {
	id: string;
	userId: string;
	name?: string;
	isDefault?: boolean;
	street: string;
	city: string;
	postalCode: string;
	country: string;
	// Nova Poshta fields
	npCityName?: string;
	npCityFullName?: string;
	npWarehouse?: string;
	useNovaPost?: boolean;
	createdAt: Date;
	updatedAt: Date;
}

// User creation data (without auto-generated fields)
export interface CreateUserData {
	email: string;
	firstName?: string;
	lastName?: string;
	phoneNumber?: string;
}

// Delivery address creation data
export interface CreateDeliveryAddressData {
	userId: string;
	name?: string;
	isDefault?: boolean;
	street: string;
	city: string;
	postalCode: string;
	country: string;
	// Nova Poshta fields
	npCityName?: string;
	npCityFullName?: string;
	npWarehouse?: string;
	useNovaPost?: boolean;
}

// Delivery address update data (partial)
export interface UpdateDeliveryAddressData {
	name?: string;
	isDefault?: boolean;
	street?: string;
	city?: string;
	postalCode?: string;
	country?: string;
	// Nova Poshta fields
	npCityName?: string;
	npCityFullName?: string;
	npWarehouse?: string;
	useNovaPost?: boolean;
}

// User update data (partial)
export interface UpdateUserData {
	firstName?: string;
	lastName?: string;
	phoneNumber?: string;
}

// User repository interface - defines the contract for user data access
export interface UserRepository {
	// User operations
	getUserById(id: string): Promise<User | null>;
	getUserByEmail(email: string): Promise<User | null>;
	createUser(data: CreateUserData): Promise<User | null>;
	updateUser(id: string, data: UpdateUserData): Promise<User | null>;

	// Delivery address operations
	getDeliveryAddressesByUserId(userId: string): Promise<DeliveryAddress[]>;
	getDeliveryAddressById(id: string): Promise<DeliveryAddress | null>;
	createDeliveryAddress(data: CreateDeliveryAddressData): Promise<DeliveryAddress | null>;
	updateDeliveryAddress(
		id: string,
		data: UpdateDeliveryAddressData
	): Promise<DeliveryAddress | null>;
	deleteDeliveryAddressById(id: string): Promise<boolean>;
	setDefaultAddress(userId: string, addressId: string): Promise<boolean>;
}
