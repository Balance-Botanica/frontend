#!/usr/bin/env node

const PocketBase = require('pocketbase').default;

// Configuration
const POCKETBASE_URL = process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';
const POCKETBASE_ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL || 'balancebotanicaukraine@gmail.com';
const POCKETBASE_ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD || 'diaochan1994qQq';

// PocketBase client
const pb = new PocketBase(POCKETBASE_URL);

async function testConnection() {
    try {
        console.log('🔍 Testing PocketBase connection...');
        const health = await pb.health.check();
        console.log('✅ PocketBase is running:', health);
        return health;
    } catch (error) {
        console.error('❌ PocketBase connection failed:', error.message);
        throw error;
    }
}

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

async function listCollections() {
    try {
        console.log('📂 Fetching collections from PocketBase...');
        
        // Authenticate as admin first
        await authenticateAdmin();
        
        // Fetch collections
        const collections = await pb.collections.getFullList();
        
        console.log(`📊 Found ${collections.length} collections:`);
        collections.forEach((collection, index) => {
            console.log(`${index + 1}. ${collection.name} (${collection.type})`);
        });
        
        return collections;
    } catch (error) {
        console.error('❌ Failed to fetch collections:', error.message);
        if (error.response) {
            console.error('Response data:', JSON.stringify(error.response, null, 2));
        }
        throw error;
    }
}

// Run the script if executed directly
if (require.main === module) {
    testConnection()
        .then(() => listCollections())
        .then(() => {
            console.log('✅ Test completed successfully');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Test failed:', error.message);
            process.exit(1);
        });
}

module.exports = { testConnection, listCollections };