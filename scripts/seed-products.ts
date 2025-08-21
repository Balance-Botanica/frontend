import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { product } from '../src/lib/server/db/schema.ts';
import { randomUUID } from 'crypto';

// Initialize database
const sqlite = new Database('./local.db');
const db = drizzle(sqlite);

// Sample CBD products for Balance Botanica
const sampleProducts = [
	{
		id: randomUUID(),
		name: 'Premium CBD Oil 1000mg',
		description:
			'Full-spectrum CBD oil extracted from organic hemp plants. Promotes relaxation and supports overall wellness.',
		price: 5999, // $59.99 in cents
		stock: 45,
		category: 'cbd-oils',
		imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop'
	},
	{
		id: randomUUID(),
		name: 'CBD Relief Cream 500mg',
		description:
			'Topical CBD cream with menthol and essential oils for targeted pain relief and muscle recovery.',
		price: 3999, // $39.99 in cents
		stock: 32,
		category: 'topicals',
		imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop'
	},
	{
		id: randomUUID(),
		name: 'CBD Gummies 25mg (30 count)',
		description:
			'Delicious berry-flavored CBD gummies. Perfect for daily wellness support and stress relief.',
		price: 4499, // $44.99 in cents
		stock: 28,
		category: 'edibles',
		imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop'
	},
	{
		id: randomUUID(),
		name: 'CBD Vape Pen 300mg',
		description:
			'Disposable CBD vape pen with natural terpenes. Fast-acting relief for anxiety and stress.',
		price: 2999, // $29.99 in cents
		stock: 15,
		category: 'vapes',
		imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop'
	},
	{
		id: randomUUID(),
		name: 'Hemp Seed Oil Capsules',
		description:
			'Pure hemp seed oil capsules rich in omega-3 and omega-6 fatty acids for heart health.',
		price: 2499, // $24.99 in cents
		stock: 67,
		category: 'supplements',
		imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop'
	},
	{
		id: randomUUID(),
		name: 'CBD Bath Bombs (Pack of 6)',
		description:
			'Luxurious CBD-infused bath bombs with lavender and eucalyptus for ultimate relaxation.',
		price: 3499, // $34.99 in cents
		stock: 23,
		category: 'topicals',
		imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop'
	},
	{
		id: randomUUID(),
		name: 'Organic Hemp Protein Powder',
		description:
			'Plant-based protein powder from organic hemp seeds. Complete protein with all essential amino acids.',
		price: 3999, // $39.99 in cents
		stock: 41,
		category: 'supplements',
		imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop'
	},
	{
		id: randomUUID(),
		name: 'CBD Sleep Tincture 750mg',
		description: 'Nighttime CBD tincture with melatonin and chamomile for better sleep quality.',
		price: 5499, // $54.99 in cents
		stock: 19,
		category: 'cbd-oils',
		imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop'
	}
];

async function seedProducts() {
	try {
		console.log('🌱 Seeding database with sample products...');

		// Insert all products
		const result = await db.insert(product).values(sampleProducts);

		console.log(`✅ Successfully created ${sampleProducts.length} products!`);
		console.log('\n📋 Products created:');

		sampleProducts.forEach((prod, index) => {
			console.log(`${index + 1}. ${prod.name} - $${(prod.price / 100).toFixed(2)}`);
		});

		console.log('\n🚀 You can now view products at: http://localhost:5173/demo/products');
	} catch (error) {
		console.error('❌ Error seeding products:', error);
	} finally {
		sqlite.close();
	}
}

// Run the seeding
seedProducts();
