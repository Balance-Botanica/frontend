import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { products } from '../src/lib/server/db/schema.ts';

// Create database connection
const sqlite = new Database('./drizzle.db');
const db = drizzle(sqlite);

// Test products data
const testProducts = [
	{
		id: crypto.randomUUID(),
		name: 'CBD Oil for Dogs - Anxiety Relief',
		description:
			'Premium CBD oil specially formulated for dogs to help with anxiety, stress, and behavioral issues. Made with organic hemp extract and natural ingredients.',
		price: 2500, // 25.00 UAH in kopiyky
		stock: 15,
		category: 'cbd-oils',
		imageUrl: '/images/animal1.jpg',
		imageUrls: JSON.stringify(['/images/animal1.jpg', '/images/animal1.jpg', '/images/animal1.jpg'])
	},
	{
		id: crypto.randomUUID(),
		name: 'CBD Oil for Cats - Calming Formula',
		description:
			'Gentle CBD oil designed for cats to promote calmness and reduce stress. Perfect for anxious cats and multi-cat households.',
		price: 2200, // 22.00 UAH in kopiyky
		stock: 12,
		category: 'cbd-oils',
		imageUrl: '/images/animal1.jpg',
		imageUrls: JSON.stringify(['/images/animal1.jpg'])
	},
	{
		id: crypto.randomUUID(),
		name: 'CBD Topical Cream for Horses',
		description:
			'Professional-grade CBD topical cream for horses to help with joint pain, muscle soreness, and inflammation. Fast-acting relief.',
		price: 4500, // 45.00 UAH in kopiyky
		stock: 8,
		category: 'topicals',
		imageUrl: '/images/animal1.jpg',
		imageUrls: JSON.stringify(['/images/animal1.jpg', '/images/animal1.jpg'])
	},
	{
		id: crypto.randomUUID(),
		name: 'CBD Oil for Small Animals',
		description:
			'Concentrated CBD oil for rabbits, hamsters, and other small pets. Helps with stress, appetite, and overall wellness.',
		price: 1800, // 18.00 UAH in kopiyky
		stock: 20,
		category: 'cbd-oils',
		imageUrl: '/images/animal1.jpg',
		imageUrls: JSON.stringify(['/images/animal1.jpg'])
	}
];

async function seedProducts() {
	try {
		console.log('🌱 Seeding test products...');

		// Insert test products
		for (const product of testProducts) {
			await db.insert(products).values(product);
			console.log(`✅ Added: ${product.name}`);
		}

		console.log(`🎉 Successfully added ${testProducts.length} test products!`);

		// Verify products were added
		const allProducts = await db.select().from(products);
		console.log(`📊 Total products in database: ${allProducts.length}`);
	} catch (error) {
		console.error('❌ Error seeding products:', error);
	} finally {
		sqlite.close();
	}
}

// Run the seeding function
seedProducts();
