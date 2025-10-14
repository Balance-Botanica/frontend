// Direct test of PocketBase repositories
const { execSync } = require('child_process');

// Load environment variables
require('dotenv/config');

async function testPocketBaseRepositories() {
    try {
        console.log('🧪 Direct PocketBase Repository Test');
        console.log('=====================================');
        
        console.log('Environment Variables:');
        console.log('  POCKETBASE_URL:', process.env.POCKETBASE_URL);
        console.log('  POCKETBASE_ENABLED:', process.env.POCKETBASE_ENABLED);
        
        // Test PocketBase connectivity directly
        console.log('\n🔍 Testing PocketBase connectivity...');
        try {
            const result = execSync('curl -s http://127.0.0.1:8090/api/collections/products/records', { encoding: 'utf-8' });
            const data = JSON.parse(result);
            console.log(`   ✅ Successfully connected to PocketBase`);
            console.log(`   ✅ Found ${data.items?.length || 0} products in PocketBase`);
            if (data.items?.length > 0) {
                console.log('   Sample product:', {
                    id: data.items[0].id,
                    name: data.items[0].name,
                    price: data.items[0].price
                });
            }
        } catch (error) {
            console.log('   ❌ Error connecting to PocketBase:', error.message);
        }
        
        console.log('\n🎉 Direct PocketBase test completed!');
        
    } catch (error) {
        console.error('❌ Direct PocketBase test failed:', error.message);
        console.error('Details:', error);
    }
}

testPocketBaseRepositories();