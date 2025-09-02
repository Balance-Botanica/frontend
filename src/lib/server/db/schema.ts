import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const products = sqliteTable('products', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	description: text('description'),
	size: text('size').notNull(),
	flavor: text('flavor').notNull(),
	price: integer('price').notNull(), // Price in UAH kopiyky (1 UAH = 100 kopiyky)
	stock: integer('stock').notNull(),
	categories: text('categories').notNull(),
	image_urls: text('image_urls').notNull(),
	created_at: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
	updated_at: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const users = sqliteTable('users', {
	id: text('id').primaryKey(),
	email: text('email').notNull().unique(),
	firstName: text('first_name'),
	lastName: text('last_name'),
	phoneNumber: text('phone_number'),
	createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const deliveryAddresses = sqliteTable('delivery_addresses', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	name: text('name'),
	isDefault: integer('is_default', { mode: 'boolean' }).default(false),
	street: text('street').notNull(),
	city: text('city').notNull(),
	postalCode: text('postal_code').notNull(),
	country: text('country').notNull().default('Ukraine'),
	// Nova Poshta fields
	npCityName: text('np_city_name'),
	npCityFullName: text('np_city_full_name'),
	npWarehouse: text('np_warehouse'),
	useNovaPost: integer('use_nova_post', { mode: 'boolean' }).default(false),
	createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const sessions = sqliteTable('sessions', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export const orders = sqliteTable('orders', {
	id: text('id').primaryKey(), // 6-digit order code (e.g., "123456")
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	items: text('items').notNull(), // JSON string of cart items
	total: integer('total').notNull(), // Total in kopiyky
	status: text('status').notNull().default('pending'), // pending, confirmed, shipped, delivered, cancelled
	deliveryAddress: text('delivery_address'), // JSON string of delivery address
	notes: text('notes'), // Customer notes

	// Customer information (for Google Sheets sync)
	customerName: text('customer_name'), // Full name (First + Last)
	customerPhone: text('customer_phone'), // Phone number

	// User email for Google Sheets sync
	userEmail: text('user_email'),

	createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const promoCodes = sqliteTable('promo_codes', {
	id: text('id').primaryKey(),
	code: text('code').notNull().unique(),
	description: text('description'),
	discountType: text('discount_type').notNull(), // 'percentage', 'fixed', 'free_shipping'
	discountValue: real('discount_value').notNull(),
	minimumAmount: real('minimum_amount').default(0),
	maximumDiscount: real('maximum_discount'),
	isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
	expiresAt: integer('expires_at', { mode: 'timestamp' }),
	usageLimit: integer('usage_limit'),
	usageCount: integer('usage_count').default(0),
	createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const promoCodeUsages = sqliteTable('promo_code_usages', {
	id: text('id').primaryKey(),
	promoCodeId: text('promo_code_id')
		.notNull()
		.references(() => promoCodes.id),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	orderId: text('order_id'),
	usedAt: integer('used_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export type Session = typeof sessions.$inferSelect;
export type User = typeof users.$inferSelect;
export type DeliveryAddress = typeof deliveryAddresses.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type PromoCode = typeof promoCodes.$inferSelect;
export type PromoCodeUsage = typeof promoCodeUsages.$inferSelect;
