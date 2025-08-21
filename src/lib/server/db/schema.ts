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
	createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const sessions = sqliteTable('sessions', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export type Session = typeof sessions.$inferSelect;
export type User = typeof users.$inferSelect;
export type Product = typeof products.$inferSelect;
