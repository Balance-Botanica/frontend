#!/usr/bin/env node

const Database = require('better-sqlite3');

// Database connection
const client = new Database('./drizzle.db');

try {
    console.log('🔍 Checking products in Drizzle database...');
    
    // Fetch products from Drizzle
    const products = client.prepare('SELECT * FROM products LIMIT 5').all();
    
    console.log(`📊 Found ${products.length} products in Drizzle:`);
    console.log('=====================================');
    
    products.forEach((product, index) => {
        console.log(`${index + 1}. Product Details:`);
        console.log(`   ID: ${product.id}`);
        console.log(`   Name: ${product.name}`);
        console.log(`   Description: ${product.description}`);
        console.log(`   Size: ${product.size}`);
        console.log(`   Flavor: ${product.flavor}`);
        console.log(`   Price: ${product.price}`);
        console.log(`   Stock: ${product.stock}`);
        console.log(`   Categories: ${product.categories}`);
        console.log(`   Image URLs: ${product.image_urls}`);
        console.log(`   Created At: ${new Date(parseInt(product.created_at) * 1000)}`);
        console.log(`   Updated At: ${new Date(parseInt(product.updated_at) * 1000)}`);
        console.log('-------------------------------------');
    });
    
    // Get total count
    const count = client.prepare('SELECT COUNT(*) as total FROM products').get();
    console.log(`📈 Total products in Drizzle: ${count.total}`);
    
} catch (error) {
    console.error('❌ Failed to fetch products from Drizzle:', error.message);
} finally {
    client.close();
}