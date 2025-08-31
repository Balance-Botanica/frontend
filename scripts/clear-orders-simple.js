import Database from 'better-sqlite3';

const sqlite = new Database('./drizzle.db');

function clearOrders() {
	try {
		console.log('🧹 Starting simple order cleanup...');

		// Подсчитать заказы перед удалением
		const ordersBefore = sqlite.prepare('SELECT COUNT(*) as count FROM orders').get();

		console.log(`📊 Found ${ordersBefore.count} orders`);

		// Удалить все заказы
		console.log('🗑️ Deleting orders...');
		const deleteOrders = sqlite.prepare('DELETE FROM orders');
		const ordersDeleted = deleteOrders.run();
		console.log(`🗑️ Deleted ${ordersDeleted.changes} orders`);

		// Проверить результат
		const ordersAfter = sqlite.prepare('SELECT COUNT(*) as count FROM orders').get();

		console.log('✅ Cleanup completed!');
		console.log(`📊 After cleanup: ${ordersAfter.count} orders`);

		if (ordersAfter.count === 0) {
			console.log('🎉 Database is clean!');
		} else {
			console.log('⚠️ Some orders might still remain');
		}

	} catch (error) {
		console.error('❌ Error during cleanup:', error);
	} finally {
		sqlite.close();
	}
}

clearOrders();
