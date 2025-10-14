import PocketBase from 'pocketbase';

async function checkPocketBaseData() {
    try {
        console.log('🔍 Checking PocketBase data...');
        
        // Initialize PocketBase client
        const pb = new PocketBase('http://127.0.0.1:8090');
        
        // Check if we can access the collections
        console.log('\n📋 Checking collections...');
        const collections = await pb.collections.getFullList();
        console.log('Available collections:', collections.map(c => c.name));
        
        // Check products
        console.log('\n📦 Checking products...');
        try {
            const products = await pb.collection('products').getFullList();
            console.log(`Found ${products.length} products in PocketBase`);
            if (products.length > 0) {
                console.log('Sample product:', products[0]);
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
                console.log('Sample user:', users[0]);
            }
        } catch (error) {
            console.log('Error fetching users:', error.message);
        }
        
        // Check delivery addresses
        console.log('\n📍 Checking delivery addresses...');
        try {
            const addresses = await pb.collection('delivery_addresses').getFullList();
            console.log(`Found ${addresses.length} delivery addresses in PocketBase`);
            if (addresses.length > 0) {
                console.log('Sample address:', addresses[0]);
            }
        } catch (error) {
            console.log('Error fetching delivery addresses:', error.message);
        }
        
        console.log('\n✅ PocketBase data check completed!');
    } catch (error) {
        console.error('❌ Error checking PocketBase data:', error.message);
    }
}

checkPocketBaseData();