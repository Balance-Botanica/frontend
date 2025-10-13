#!/usr/bin/env node

const PocketBase = require('pocketbase').default;

// Configuration
const POCKETBASE_URL = process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';
const POCKETBASE_ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL || 'balancebotanicaukraine@gmail.com';
const POCKETBASE_ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD || 'diaochan1994qQq';

// PocketBase client
const pb = new PocketBase(POCKETBASE_URL);

async function authenticateAdmin() {
    try {
        console.log('🔐 Authenticating as PocketBase admin...');
        const authData = await pb.admins.authWithPassword(POCKETBASE_ADMIN_EMAIL, POCKETBASE_ADMIN_PASSWORD);
        console.log('✅ Admin authenticated successfully');
        return authData;
    } catch (error) {
        console.error('❌ Admin authentication failed:', error.message);
        throw error;
    }
}

async function listProducts() {
    try {
        console.log('📦 Fetching products from PocketBase...');
        
        // Authenticate as admin
        await authenticateAdmin();
        
        // Fetch products using the working method
        const products = await pb.collection('products').getFullList();
        
        console.log(`📊 Found ${products.length} products in PocketBase:`);
        console.log('=====================================');
        
        products.forEach((product, index) => {
            console.log(`${index + 1}. ${product.name}`);
            console.log(`   ID: ${product.id}`);
            console.log(`   Size: ${product.size}`);
            console.log(`   Flavor: ${product.flavor}`);
            console.log(`   Price: ${product.price} UAH`);
            console.log(`   Stock: ${product.stock} units`);
            console.log(`   Description: ${product.description.substring(0, 50)}...`);
            console.log(`   Categories: ${JSON.stringify(product.categories)}`);
            console.log(`   Created: ${product.created}`);
            console.log('-------------------------------------');
        });
        
        return products;
    } catch (error) {
        console.error('❌ Failed to fetch products:', error.message);
        if (error.response) {
            console.error('Response data:', JSON.stringify(error.response, null, 2));
        }
        throw error;
    }
}

// Run the script if executed directly
if (require.main === module) {
    listProducts()
        .then(() => {
            console.log('✅ Product listing completed successfully');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Script failed:', error.message);
            process.exit(1);
        });
}

module.exports = { listProducts };