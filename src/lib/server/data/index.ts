// Main export file for data layer
// This provides a clean interface to access all data functionality

// Export repositories
export { DrizzleProductRepository } from './repositories/drizzle-product.repository';
export { PocketBaseProductRepository } from './repositories/pocketbase-product.repository';
export { DrizzleUserRepository } from './repositories/drizzle-user.repository';
export { PocketBaseUserRepository } from './repositories/pocketbase-user.repository';
export { DrizzleOrderRepository } from './repositories/drizzle-order.repository';
export { PocketBaseOrderRepository } from './repositories/pocketbase-order.repository';
export { DrizzlePromoCodeRepository } from './repositories/drizzle-promo-code.repository';
export { PocketBasePromoCodeRepository } from './repositories/pocketbase-promo-code.repository';

// Export factories
export { ProductRepositoryFactory } from './factories/product-repository.factory';
export { UserRepositoryFactory } from './factories/user-repository.factory';
export { OrderRepositoryFactory } from './factories/order-repository.factory';
export { PromoCodeRepositoryFactory } from './factories/promo-code-repository.factory';

// Export data source types
export type { DataSourceType } from './factories/product-repository.factory';
export type { UserDataSourceType } from './factories/user-repository.factory';
export type { OrderDataSourceType } from './factories/order-repository.factory';
export type { PromoCodeDataSourceType } from './factories/promo-code-repository.factory';

// Export domain interfaces
export type {
	Product,
	CreateProductData,
	UpdateProductData,
	ProductRepository
} from '../domain/interfaces/product.interface';

export type {
	User,
	DeliveryAddress,
	CreateUserData,
	CreateDeliveryAddressData,
	UpdateDeliveryAddressData,
	UpdateUserData,
	UserRepository
} from '../domain/interfaces/user.interface';

export type {
	Order,
	OrderItem,
	OrderStatus,
	CreateOrderData,
	OrderRepository
} from '../domain/interfaces/order.interface';

export type {
	PromoCodeRepository,
	CreatePromoCodeData,
	PromoCodeValidationResult
} from '../domain/interfaces/promo-code.interface';
