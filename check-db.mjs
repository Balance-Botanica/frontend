import Database from 'better-sqlite3';

try {
	const db = new Database('./drizzle.db');

	console.log('=== Drizzle Database Check ===');

	// Check tables
	const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
	console.log(
		'Tables found:',
		tables.map((t) => t.name)
	);

	// Check products table if it exists
	if (tables.some((t) => t.name === 'products')) {
		const products = db.prepare('SELECT * FROM products').all();
		console.log('Products count:', products.length);
		if (products.length > 0) {
			console.log('First product:', {
				id: products[0].id,
				name: products[0].name,
				imageUrl: products[0].image_url,
				imageUrls: products[0].image_urls
			});
		}
	}

	db.close();
} catch (error) {
	console.error('Error:', error.message);
}
