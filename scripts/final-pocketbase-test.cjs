// Final PocketBase Integration Test
const PocketBase = require('pocketbase').default;

console.log('=== POCKETBASE INTEGRATION TEST ===');

// Test 1: Check if PocketBase package is available
try {
    console.log('✅ PocketBase package imported successfully');
} catch (error) {
    console.error('❌ Failed to import PocketBase package:', error.message);
    process.exit(1);
}

// Test 2: Check PocketBase client creation
try {
    const pb = new PocketBase('http://127.0.0.1:8090');
    console.log('✅ PocketBase client created successfully');
} catch (error) {
    console.error('❌ Failed to create PocketBase client:', error.message);
    process.exit(1);
}

// Test 3: Check environment variables
console.log('📋 Environment Configuration:');
console.log('   POCKETBASE_URL:', process.env.POCKETBASE_URL || 'http://127.0.0.1:8090 (default)');

// Test 4: Test connection to server
const pb = new PocketBase(process.env.POCKETBASE_URL || 'http://127.0.0.1:8090');

async function testConnection() {
    try {
        const health = await pb.health.check();
        console.log('✅ PocketBase server connection successful');
        console.log('   Server Status:', health.message);
        console.log('   Response Code:', health.code);
        
        console.log('\n=== NEXT STEPS ===');
        console.log('1. Create admin user at http://127.0.0.1:8090/_/');
        console.log('   Email: admin@balancebotanica.com');
        console.log('   Password: admin123456');
        console.log('2. Create collections using the admin UI or scripts');
        console.log('3. Test existing PocketBaseProductRepository');
        console.log('4. Implement remaining repositories');
        
        console.log('\n🎉 PocketBase integration is ready for use!');
        
    } catch (error) {
        console.error('❌ PocketBase server connection failed:', error.message);
        console.log('\n🔧 Troubleshooting:');
        console.log('   - Ensure PocketBase server is running on port 8090');
        console.log('   - Check if the URL is correct');
        console.log('   - Verify network connectivity');
        process.exit(1);
    }
}

testConnection();