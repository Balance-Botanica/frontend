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

async function testSingleProduct() {
    try {
        console.log('🔍 Testing single product creation...');
        
        // Authenticate as admin
        await authenticateAdmin();
        
        // Create a test product with all fields
        const productData = {
            name: "Test Product",
            description: "This is a test product for debugging",
            size: "30г",
            flavor: "натуральний",
            price: 1000,
            stock: 5,
            categories: ["Тест"],
            image_urls: ["https://example.com/test.jpg"],
            created: new Date().toISOString(),
            updated: new Date().toISOString()
        };
        
        console.log('Creating product with data:', JSON.stringify(productData, null, 2));
        
        const createdProduct = await pb.collection('products').create(productData);
        console.log('Created product:', JSON.stringify(createdProduct, null, 2));
        
        // Try to retrieve the product
        const retrievedProduct = await pb.collection('products').getOne(createdProduct.id);
        console.log('Retrieved product:', JSON.stringify(retrievedProduct, null, 2));
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.response) {
            console.error('Response data:', JSON.stringify(error.response, null, 2));
        }
        throw error;
    }
}

// Run the script if executed directly
if (require.main === module) {
    testSingleProduct()
        .then(() => {
            console.log('✅ Single product test completed');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Script failed:', error.message);
            process.exit(1);
        });
}

module.exports = { testSingleProduct };