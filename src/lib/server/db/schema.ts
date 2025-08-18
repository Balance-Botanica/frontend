import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	age: integer('age'),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull()
});

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

// Products table for Drizzle approach
export const product = sqliteTable('product', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	description: text('description'),
	price: real('price').notNull(), // Price in dollars (e.g., 29.99)
	stock: integer('stock').notNull().default(0),
	category: text('category').notNull(),
	imageUrl: text('image_url'),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`)
});

export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
export type Product = typeof product.$inferSelect;
