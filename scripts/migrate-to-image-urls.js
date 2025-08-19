#!/usr/bin/env node

import Database from 'better-sqlite3';

const db = new Database('local.db');

async function migrateToImageUrls() {
	console.log('🔄 Starting migration to imageUrls array...');

	try {
		// Check if image_urls column exists
		const columns = db.prepare('PRAGMA table_info(products)').all();
		const hasImageUrls = columns.some((col) => col.name === 'image_urls');

		if (!hasImageUrls) {
			// Add imageUrls column if it doesn't exist
			db.exec(`
				ALTER TABLE products ADD COLUMN image_urls TEXT DEFAULT '[]';
			`);
			console.log('✅ Added image_urls column');
		} else {
			console.log('✅ image_urls column already exists');
		}

		// Migrate existing imageUrl data to imageUrls array
		const existingProducts = db
			.prepare('SELECT id, image_url FROM products WHERE image_url IS NOT NULL AND image_url != ""')
			.all();

		for (const product of existingProducts) {
			if (product.image_url) {
				const imageUrls = JSON.stringify([product.image_url]);
				db.prepare('UPDATE products SET image_urls = ? WHERE id = ?').run(imageUrls, product.id);
				console.log(
					`🔄 Migrated product ${product.id}: ${product.image_url} -> [${product.image_url}]`
				);
			}
		}

		console.log(`✅ Migrated ${existingProducts.length} products to imageUrls array`);

		// Create index for better performance (SQLite doesn't support GIN indexes like PostgreSQL)
		db.exec('CREATE INDEX IF NOT EXISTS idx_products_image_urls ON products(image_urls)');
		console.log('✅ Created index on image_urls column');

		console.log('🎉 Migration completed successfully!');
	} catch (error) {
		console.error('❌ Migration failed:', error);
		process.exit(1);
	} finally {
		db.close();
	}
}

migrateToImageUrls();
