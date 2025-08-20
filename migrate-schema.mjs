import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { config } from 'dotenv';

config();

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');

console.log('🔧 Starting schema migration...');

const client = new Database(DATABASE_URL);
const db = drizzle(client);

try {
	console.log('📋 Current table structure:');
	const tableInfo = client.prepare('PRAGMA table_info(products)').all();
	console.table(tableInfo);

	console.log('\n🔄 Starting migration...');

	// Drop unnecessary columns
	console.log('🗑️ Dropping unnecessary columns...');
	try {
		client.prepare('ALTER TABLE products DROP COLUMN name_en').run();
		console.log('✅ Dropped name_en');
	} catch (e) {
		console.log('ℹ️ name_en column not found or already dropped');
	}

	try {
		client.prepare('ALTER TABLE products DROP COLUMN description_en').run();
		console.log('✅ Dropped description_en');
	} catch (e) {
		console.log('ℹ️ description_en column not found or already dropped');
	}

	try {
		client.prepare('ALTER TABLE products DROP COLUMN size_en').run();
		console.log('✅ Dropped size_en');
	} catch (e) {
		console.log('ℹ️ size_en column not found or already dropped');
	}

	try {
		client.prepare('ALTER TABLE products DROP COLUMN flavor_en').run();
		console.log('✅ Dropped flavor_en');
	} catch (e) {
		console.log('ℹ️ flavor_en column not found or already dropped');
	}

	try {
		client.prepare('ALTER TABLE products DROP COLUMN label_color').run();
		console.log('✅ Dropped label_color');
	} catch (e) {
		console.log('ℹ️ label_color column not found or already dropped');
	}

	// Update product names to English format
	console.log('\n✏️ Updating product names...');
	const updateNames = client.prepare(`
        UPDATE products 
        SET name = CASE 
            WHEN categories LIKE '%Пасти%' THEN 'Balance Botanica Golden Paste CBD'
            WHEN categories LIKE '%Олія%' THEN 'Balance Botanica CBD Oil'
            ELSE name
        END
    `);
	const result = updateNames.run();
	console.log(`✅ Updated ${result.changes} product names`);

	// Update descriptions
	console.log('\n✏️ Updating descriptions...');
	const updateDescriptions = client.prepare(`
        UPDATE products 
        SET description = 'Premium CBD product for pets with natural ingredients and health benefits.'
        WHERE description IS NULL OR description = ''
    `);
	const descResult = updateDescriptions.run();
	console.log(`✅ Updated ${descResult.changes} descriptions`);

	console.log('\n📋 New table structure:');
	const newTableInfo = client.prepare('PRAGMA table_info(products)').all();
	console.table(newTableInfo);

	console.log('\n📊 Sample data after migration:');
	const sampleData = client
		.prepare('SELECT id, name, size, flavor, categories FROM products LIMIT 3')
		.all();
	console.table(sampleData);

	console.log('\n✅ Migration completed successfully!');
} catch (error) {
	console.error('❌ Migration failed:', error);
} finally {
	client.close();
}
