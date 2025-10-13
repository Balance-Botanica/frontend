// Direct PocketBase API test
const PocketBase = require('pocketbase').default;

// PocketBase client configuration
const pb = new PocketBase('http://127.0.0.1:8090');

async function testDirectAPI() {
    try {
        console.log('Testing direct PocketBase API...');
        
        // Test health check
        const health = await pb.health.check();
        console.log('✅ PocketBase health check:', health);
        
        // Try to list collections (will be empty initially)
        try {
            const collections = await pb.collections.getFullList();
            console.log(`✅ Found ${collections.length} collections`);
            collections.forEach(collection => {
                console.log(`   - ${collection.name}`);
            });
        } catch (error) {
            console.log('ℹ️  No collections found or not authenticated (this is expected initially)');
        }
        
        console.log('🎉 Direct API test completed!');
        console.log('🔗 Admin Dashboard: http://127.0.0.1:8090/_/');
        console.log('🔗 REST API: http://127.0.0.1:8090/api/');
        
    } catch (error) {
        console.error('❌ Direct API test failed:', error.message);
        console.error('Details:', error);
    }
}

testDirectAPI();