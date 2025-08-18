import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current file directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to the database file
const dbPath = join(__dirname, '..', 'local.db');

console.log('🔄 Starting price column migration...');
console.log(`📁 Database path: ${dbPath}`);

try {
	// Open the database
	const db = new Database(dbPath);

	// Check if the product table exists
	const tableExists = db
		.prepare(
			`
		SELECT name FROM sqlite_master 
		WHERE type='table' AND name='product'
	`
		)
		.get();

	if (!tableExists) {
		console.log('❌ Product table does not exist. Run db:push first.');
		process.exit(1);
	}

	// Check current schema
	const currentSchema = db
		.prepare(
			`
		PRAGMA table_info(product)
	`
		)
		.all();

	console.log('📋 Current table schema:');
	currentSchema.forEach((col) => {
		console.log(`  - ${col.name}: ${col.type} (notnull: ${col.notnull})`);
	});

	// Check if price column is already real
	const priceColumn = currentSchema.find((col) => col.name === 'price');
	if (priceColumn && priceColumn.type === 'REAL') {
		console.log('✅ Price column is already REAL type. No migration needed.');
		db.close();
		process.exit(0);
	}

	// Begin transaction
	db.prepare('BEGIN TRANSACTION').run();

	try {
		// Create new table with real price
		console.log('🔨 Creating new table structure...');
		db.prepare(
			`
			CREATE TABLE product_new (
				id TEXT PRIMARY KEY,
				name TEXT NOT NULL,
				description TEXT,
				price REAL NOT NULL,
				stock INTEGER NOT NULL DEFAULT 0,
				category TEXT NOT NULL,
				image_url TEXT,
				created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
				updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
			)
		`
		).run();

		// Copy data, keeping the same price values but changing column type to REAL
		console.log('📊 Migrating data (keeping same price values, changing to REAL type)...');
		const insertStmt = db.prepare(`
			INSERT INTO product_new (id, name, description, price, stock, category, image_url, created_at, updated_at)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
		`);

		const selectStmt = db.prepare('SELECT * FROM product');
		const products = selectStmt.all();

		let migratedCount = 0;
		for (const product of products) {
			// Keep the same price value, just change column type to REAL
			insertStmt.run(
				product.id,
				product.name,
				product.description,
				product.price, // Keep original value (e.g., 2999)
				product.stock,
				product.category,
				product.image_url,
				product.created_at,
				product.updated_at
			);
			migratedCount++;
		}

		console.log(`✅ Migrated ${migratedCount} products`);

		// Drop old table and rename new one
		console.log('🔄 Replacing old table...');
		db.prepare('DROP TABLE product').run();
		db.prepare('ALTER TABLE product_new RENAME TO product').run();

		// Commit transaction
		db.prepare('COMMIT').run();

		// Verify new schema
		const newSchema = db
			.prepare(
				`
			PRAGMA table_info(product)
		`
			)
			.all();

		console.log('📋 New table schema:');
		newSchema.forEach((col) => {
			console.log(`  - ${col.name}: ${col.type} (notnull: ${col.notnull})`);
		});

		// Show sample data
		const sampleProducts = db.prepare('SELECT id, name, price FROM product LIMIT 3').all();
		console.log('📊 Sample products with new price format:');
		sampleProducts.forEach((product) => {
			console.log(`  - ${product.name}: $${product.price.toFixed(2)}`);
		});

		console.log('🎉 Migration completed successfully!');
		console.log(
			'💡 Prices are now stored as REAL (double) instead of INTEGER, allowing decimal places.'
		);
	} catch (error) {
		// Rollback on error
		db.prepare('ROLLBACK').run();
		throw error;
	}
} catch (error) {
	console.error('❌ Migration failed:', error.message);
	process.exit(1);
} finally {
	if (db) {
		db.close();
	}
}
