// Test PocketBase connection
import { pb } from '../src/lib/server/pocketbase/index';

async function testConnection() {
    try {
        console.log('Testing PocketBase connection...');
        
        // Test health check
        const health = await pb.health.check();
        console.log('✅ PocketBase health check:', health);
        
        console.log('🎉 PocketBase connection successful!');
        console.log('🔗 Admin Dashboard: http://127.0.0.1:8090/_/');
        console.log('🔗 REST API: http://127.0.0.1:8090/api/');
        
    } catch (error) {
        console.error('❌ PocketBase connection failed:', error.message);
        console.error('Details:', error);
    }
}

testConnection();