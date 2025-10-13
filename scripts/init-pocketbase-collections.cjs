#!/usr/bin/env node

// Initialize PocketBase collections
// This script requires admin authentication

const PocketBase = require('pocketbase').default;

// Configuration
const POCKETBASE_URL = process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';
const ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL || 'balancebotanicaukraine@gmail.com';
const ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD || 'diaochan1994qQq';

// PocketBase client
const pb = new PocketBase(POCKETBASE_URL);

// Collection definitions
const COLLECTIONS = [
    {
        name: 'users',
        type: 'base',
        schema: [
            { name: 'email', type: 'email', required: true, options: {} },
            { name: 'first_name', type: 'text', required: false, options: {} },
            { name: 'last_name', type: 'text', required: false, options: {} },
            { name: 'phone_number', type: 'text', required: false, options: {} },
            { name: 'created', type: 'date', required: true, options: {} }
        ]
    },
    {
        name: 'products',
        type: 'base',
        schema: [
            { name: 'name', type: 'text', required: true, options: { min: 1, max: 100 } },
            { name: 'description', type: 'text', required: false, options: { max: 1000 } },
            { name: 'size', type: 'text', required: true, options: {} },
            { name: 'flavor', type: 'text', required: true, options: {} },
            { name: 'price', type: 'number', required: true, options: { min: 0 } },
            { name: 'stock', type: 'number', required: true, options: { min: 0 } },
            { name: 'categories', type: 'json', required: true, options: {} },
            { name: 'image_urls', type: 'json', required: true, options: {} },
            { name: 'created', type: 'date', required: true, options: {} },
            { name: 'updated', type: 'date', required: true, options: {} }
        ]
    },
    {
        name: 'promo_codes',
        type: 'base',
        schema: [
            { name: 'code', type: 'text', required: true, options: {} },
            { name: 'description', type: 'text', required: false, options: {} },
            { name: 'discount_type', type: 'select', required: true, options: { values: ['percentage', 'fixed', 'free_shipping'] } },
            { name: 'discount_value', type: 'number', required: true, options: { min: 0 } },
            { name: 'minimum_amount', type: 'number', required: false, options: { min: 0, default: 0 } },
            { name: 'maximum_discount', type: 'number', required: false, options: { min: 0 } },
            { name: 'is_active', type: 'bool', required: true, options: { default: true } },
            { name: 'expires_at', type: 'date', required: false, options: {} },
            { name: 'usage_limit', type: 'number', required: false, options: { min: 0 } },
            { name: 'usage_count', type: 'number', required: false, options: { min: 0, default: 0 } },
            { name: 'created', type: 'date', required: true, options: {} },
            { name: 'updated', type: 'date', required: true, options: {} }
        ]
    }
];

async function authenticateAdmin() {
    try {
        console.log('Authenticating as admin...');
        const authData = await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
        console.log('✅ Admin authenticated successfully');
        return authData;
    } catch (error) {
        console.error('❌ Admin authentication failed:', error.message);
        throw error;
    }
}

async function getExistingCollections() {
    try {
        const collections = await pb.collections.getFullList();
        return collections.map(c => c.name);
    } catch (error) {
        console.error('❌ Failed to fetch existing collections:', error.message);
        return [];
    }
}

async function createCollection(collection) {
    try {
        console.log(`Creating collection: ${collection.name}`);
        const result = await pb.collections.create(collection);
        console.log(`✅ Collection ${collection.name} created successfully`);
        return result.id;
    } catch (error) {
        if (error.status === 400 && error.message.includes('already exists')) {
            console.log(`ℹ️  Collection ${collection.name} already exists`);
            // Get the existing collection ID
            const collections = await pb.collections.getFullList();
            const existing = collections.find(c => c.name === collection.name);
            return existing ? existing.id : null;
        } else {
            console.error(`❌ Failed to create collection ${collection.name}:`, error.message);
            return null;
        }
    }
}

async function setupCollections() {
    try {
        console.log('🚀 Starting PocketBase collection setup...');
        console.log(`🔗 Connecting to: ${POCKETBASE_URL}`);
        
        // Authenticate as admin
        await authenticateAdmin();
        
        // Get existing collections
        const existingCollections = await getExistingCollections();
        console.log(`📊 Found ${existingCollections.length} existing collections`);
        
        // Create collections
        const collectionIds = {};
        for (const collection of COLLECTIONS) {
            // Skip if collection already exists
            if (existingCollections.includes(collection.name)) {
                console.log(`ℹ️  Skipping ${collection.name} (already exists)`);
                // Get the existing collection ID
                const collections = await pb.collections.getFullList();
                const existing = collections.find(c => c.name === collection.name);
                collectionIds[collection.name] = existing ? existing.id : null;
                continue;
            }
            
            const id = await createCollection(collection);
            if (id) {
                collectionIds[collection.name] = id;
            }
        }
        
        console.log('📋 Collection IDs:');
        Object.entries(collectionIds).forEach(([name, id]) => {
            console.log(`   ${name}: ${id}`);
        });
        
        console.log('🎉 Collection setup completed!');
        console.log('📝 Next steps:');
        console.log('1. Create the remaining collections (delivery_addresses, orders, promo_code_usages) with relations');
        console.log('2. Configure relation fields in existing collections');
        console.log('3. Create indexes for better performance');
        
    } catch (error) {
        console.error('❌ Collection setup failed:', error.message);
        process.exit(1);
    }
}

// Run the setup if this script is executed directly
if (require.main === module) {
    setupCollections();
}

module.exports = { setupCollections, COLLECTIONS };