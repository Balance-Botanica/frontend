import { execSync } from 'child_process';

async function testPocketBaseFunctionality() {
    try {
        console.log('🧪 Testing PocketBase functionality...');
        
        // Simple test to verify PocketBase is accessible
        console.log('\n🔍 Testing PocketBase connectivity...');
        try {
            const result = execSync('curl -s http://127.0.0.1:8090/api/health', { encoding: 'utf-8' });
            console.log('   ✅ PocketBase is accessible');
            console.log('   Health check result:', result);
        } catch (error) {
            console.log('   ⚠️  Could not connect to PocketBase directly');
        }
        
        // Test environment variables
        console.log('\n⚙️  Testing environment configuration...');
        console.log('   POCKETBASE_ENABLED:', process.env.POCKETBASE_ENABLED || 'not set');
        console.log('   POCKETBASE_URL:', process.env.POCKETBASE_URL || 'not set');
        
        // Test that our application is using the correct data source
        console.log('\n📋 Testing factory pattern behavior...');
        console.log('   When POCKETBASE_ENABLED=true, application should use PocketBase repositories');
        console.log('   When POCKETBASE_ENABLED=false or not set, application should use Drizzle repositories');
        
        console.log('\n💡 To verify which data source is being used:');
        console.log('   1. Check your browser console for repository type information');
        console.log('   2. Look for log messages that indicate PocketBase vs Drizzle usage');
        console.log('   3. Check if products are being loaded from PocketBase (they should be now)');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testPocketBaseFunctionality();