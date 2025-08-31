import Database from 'better-sqlite3';

const sqlite = new Database('./drizzle.db');

function addOrderFields() {
	try {
		console.log('🔧 Adding customer fields to orders table...');

		// Проверить, существуют ли уже поля
		const tableInfo = sqlite.prepare('PRAGMA table_info(orders)').all();
		const hasCustomerName = tableInfo.some(col => col.name === 'customer_name');
		const hasCustomerPhone = tableInfo.some(col => col.name === 'customer_phone');

		console.log('📊 Current orders table columns:', tableInfo.map(col => col.name));

		// Добавить поле customer_name если его нет
		if (!hasCustomerName) {
			console.log('➕ Adding customer_name column...');
			sqlite.prepare('ALTER TABLE orders ADD customer_name text').run();
			console.log('✅ customer_name column added');
		} else {
			console.log('ℹ️ customer_name column already exists');
		}

		// Добавить поле customer_phone если его нет
		if (!hasCustomerPhone) {
			console.log('➕ Adding customer_phone column...');
			sqlite.prepare('ALTER TABLE orders ADD customer_phone text').run();
			console.log('✅ customer_phone column added');
		} else {
			console.log('ℹ️ customer_phone column already exists');
		}

		// Проверить результат
		const updatedTableInfo = sqlite.prepare('PRAGMA table_info(orders)').all();
		console.log('📊 Updated orders table columns:', updatedTableInfo.map(col => col.name));

		console.log('🎉 Order fields migration completed successfully!');

	} catch (error) {
		console.error('❌ Error during migration:', error);
	} finally {
		sqlite.close();
	}
}

addOrderFields();
