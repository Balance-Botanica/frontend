// Check PocketBase data with admin authentication
const PocketBase = require('pocketbase').default;
require('dotenv').config(); // load .env so plain `node scripts/x.cjs` works

async function checkPocketBaseData() {
    try {
        console.log('🔍 Checking PocketBase data with admin authentication...');
        
        // Initialize PocketBase client
        const pb = new PocketBase('http://127.0.0.1:8090');
        
        // Authenticate as admin
        console.log('🔐 Authenticating as admin...');
        const adminEmail = process.env.POCKETBASE_ADMIN_EMAIL || 'balancebotanicaukraine@gmail.com';
        const adminPassword = process.env.POCKETBASE_ADMIN_PASSWORD;
        if (!adminPassword) throw new Error('POCKETBASE_ADMIN_PASSWORD is not set (see .env)');
        await pb.collection('_superusers').authWithPassword(adminEmail, adminPassword);
        console.log('✅ Admin authenticated successfully');
        
        // Check collections
        console.log('\n📋 Checking collections...');
        const collections = await pb.collections.getFullList();
        console.log('Available collections:', collections.map(c => c.name));
        
        // Check products
        console.log('\n📦 Checking products...');
        try {
            const products = await pb.collection('products').getFullList();
            console.log(`Found ${products.length} products in PocketBase`);
            if (products.length > 0) {
                console.log('Sample product:', {
                    id: products[0].id,
                    name: products[0].name,
                    price: products[0].price
                });
            } else {
                console.log('No products found in PocketBase');
            }
        } catch (error) {
            console.log('Error fetching products:', error.message);
        }
        
        // Check users
        console.log('\n👤 Checking users...');
        try {
            const users = await pb.collection('users').getFullList();
            console.log(`Found ${users.length} users in PocketBase`);
            if (users.length > 0) {
                console.log('Sample user:', {
                    id: users[0].id,
                    email: users[0].email
                });
            } else {
                console.log('No users found in PocketBase');
            }
        } catch (error) {
            console.log('Error fetching users:', error.message);
        }
        
        console.log('\n✅ PocketBase data check completed!');
    } catch (error) {
        console.error('❌ Error checking PocketBase data:', error.message);
        if (error.response) {
            console.error('Response:', error.response);
        }
    }
}

checkPocketBaseData();