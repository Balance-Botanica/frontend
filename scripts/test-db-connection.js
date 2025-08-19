#!/usr/bin/env node

import Database from 'better-sqlite3';

const db = new Database('local.db');

try {
	console.log('🔍 Testing database connection...');

	// Check if products table exists
	const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
	console.log(
		'📋 Tables found:',
		tables.map((t) => t.name)
	);

	if (tables.some((t) => t.name === 'products')) {
		// Count total products
		const totalProducts = db.prepare('SELECT COUNT(*) as count FROM products').get();
		console.log(`📊 Total products in database: ${totalProducts.count}`);

		// Show all products
		const products = db.prepare('SELECT * FROM products ORDER BY created_at DESC').all();
		console.log('\n📝 All products:');
		products.forEach((product, index) => {
			console.log(`\n${index + 1}. ${product.name}`);
			console.log(`   ID: ${product.id}`);
			console.log(`   Price: ₴${(product.price / 100).toFixed(2)} (${product.price} kopiyky)`);
			console.log(`   Stock: ${product.stock}`);
			console.log(`   Category: ${product.category}`);
			console.log(`   Image URL: ${product.image_url || 'None'}`);
			console.log(`   Image URLs: ${product.image_urls || 'None'}`);
			console.log(`   Created: ${new Date(product.created_at).toLocaleString()}`);
		});

		// Check if image_urls field exists and has data
		const columns = db.prepare('PRAGMA table_info(products)').all();
		const hasImageUrls = columns.some((col) => col.name === 'image_urls');
		console.log(`\n🔍 image_urls column exists: ${hasImageUrls}`);

		if (hasImageUrls) {
			const productsWithImages = db
				.prepare(
					'SELECT id, name, image_urls FROM products WHERE image_urls IS NOT NULL AND image_urls != "[]"'
				)
				.all();
			console.log(`📸 Products with image_urls: ${productsWithImages.length}`);
			productsWithImages.forEach((product) => {
				try {
					const urls = JSON.parse(product.image_urls);
					console.log(`   ${product.name}: ${urls.length} images`);
				} catch (e) {
					console.log(`   ${product.name}: Invalid JSON in image_urls`);
				}
			});
		}
	} else {
		console.log('❌ Products table not found');
	}
} catch (error) {
	console.error('❌ Database error:', error);
} finally {
	db.close();
}
