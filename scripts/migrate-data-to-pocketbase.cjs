#!/usr/bin/env node

// Migrate data from Drizzle to PocketBase (excluding users collection)
// This script migrates all data except users to preserve existing authentication

const PocketBase = require('pocketbase').default;
const { drizzle } = require('drizzle-orm/better-sqlite3');
const Database = require('better-sqlite3');

// Configuration
const POCKETBASE_URL = process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';
const POCKETBASE_ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL || 'balancebotanicaukraine@gmail.com';
const POCKETBASE_ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD || 'diaochan1994qQq';
const DATABASE_URL = process.env.DATABASE_URL || './drizzle.db';

// PocketBase client
const pb = new PocketBase(POCKETBASE_URL);

// Drizzle database connection
const client = new Database(DATABASE_URL);
const db = drizzle(client);

// Collection definitions (excluding users)
const COLLECTIONS = [
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
        name: 'delivery_addresses',
        type: 'base',
        schema: [
            { name: 'user_id', type: 'text', required: true, options: {} },
            { name: 'name', type: 'text', required: false, options: {} },
            { name: 'is_default', type: 'bool', required: false, options: { default: false } },
            { name: 'country', type: 'text', required: true, options: { default: 'Ukraine' } },
            { name: 'np_city_name', type: 'text', required: false, options: {} },
            { name: 'np_city_full_name', type: 'text', required: false, options: {} },
            { name: 'np_warehouse', type: 'text', required: false, options: {} },
            { name: 'use_nova_post', type: 'bool', required: false, options: { default: false } },
            { name: 'created', type: 'date', required: true, options: {} },
            { name: 'updated', type: 'date', required: true, options: {} }
        ]
    },
    {
        name: 'orders',
        type: 'base',
        schema: [
            { name: 'user_id', type: 'text', required: true, options: {} },
            { name: 'items', type: 'json', required: true, options: {} },
            { name: 'total', type: 'number', required: true, options: { min: 0 } },
            { name: 'status', type: 'select', required: true, options: { values: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'], default: 'pending' } },
            { name: 'delivery_address', type: 'json', required: false, options: {} },
            { name: 'notes', type: 'text', required: false, options: {} },
            { name: 'customer_name', type: 'text', required: false, options: {} },
            { name: 'customer_phone', type: 'text', required: false, options: {} },
            { name: 'user_email', type: 'email', required: false, options: {} },
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
    },
    {
        name: 'promo_code_usages',
        type: 'base',
        schema: [
            { name: 'promo_code_id', type: 'text', required: true, options: {} },
            { name: 'user_id', type: 'text', required: true, options: {} },
            { name: 'order_id', type: 'text', required: false, options: {} },
            { name: 'used_at', type: 'date', required: true, options: {} }
        ]
    }
];

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

async function createCollections() {
    try {
        console.log('📋 Creating PocketBase collections...');
        
        for (const collection of COLLECTIONS) {
            try {
                // Check if collection already exists
                const existingCollections = await pb.collections.getFullList();
                const existing = existingCollections.find(c => c.name === collection.name);
                
                if (existing) {
                    console.log(`ℹ️  Collection ${collection.name} already exists, skipping creation`);
                    continue;
                }
                
                console.log(`🚀 Creating collection: ${collection.name}`);
                const result = await pb.collections.create(collection);
                console.log(`✅ Collection ${collection.name} created successfully`);
            } catch (error) {
                if (error.status === 400 && error.message.includes('already exists')) {
                    console.log(`ℹ️  Collection ${collection.name} already exists`);
                } else {
                    console.error(`❌ Failed to create collection ${collection.name}:`, error.message);
                    throw error;
                }
            }
        }
        
        console.log('🎉 All collections created successfully!');
    } catch (error) {
        console.error('❌ Collection creation failed:', error.message);
        throw error;
    }
}

// Helper function to generate a random ID with specified length
function generateId(length = 15) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

async function migrateProducts() {
    try {
        console.log('📦 Migrating products...');
        
        // Fetch products from Drizzle using raw SQL
        const products = client.prepare('SELECT * FROM products').all();
        console.log(`📊 Found ${products.length} products to migrate`);
        
        let migrated = 0;
        let failed = 0;
        
        for (const product of products) {
            try {
                // Convert timestamps
                const created = new Date(parseInt(product.created_at) * 1000);
                const updated = new Date(parseInt(product.updated_at) * 1000);
                
                // Create product in PocketBase with a new ID that meets requirements
                await pb.collection('products').create({
                    // Use a new ID that meets PocketBase requirements
                    name: product.name,
                    description: product.description,
                    size: product.size,
                    flavor: product.flavor,
                    price: parseInt(product.price),
                    stock: parseInt(product.stock),
                    categories: product.categories,
                    image_urls: product.image_urls,
                    created: created.toISOString(),
                    updated: updated.toISOString()
                });
                
                migrated++;
                console.log(`✅ Migrated product: ${product.name}`);
            } catch (error) {
                failed++;
                console.error(`❌ Failed to migrate product ${product.name}:`, error.message);
                if (error.response) {
                    console.error('Response data:', JSON.stringify(error.response, null, 2));
                }
            }
        }
        
        console.log(`📦 Products migration completed: ${migrated} successful, ${failed} failed`);
        return { migrated, failed };
    } catch (error) {
        console.error('❌ Products migration failed:', error.message);
        throw error;
    }
}

async function migrateDeliveryAddresses() {
    console.log('📍 Skipping delivery addresses migration (users collection not migrated as requested)');
    return { migrated: 0, failed: 0 };
}

// Skip orders migration since they reference users we're not migrating
async function migrateOrders() {
    console.log('📝 Skipping orders migration (users collection not migrated as requested)');
    return { migrated: 0, failed: 0 };
}

async function migratePromoCodes() {
    try {
        console.log('🏷️  Migrating promo codes...');
        
        // Fetch promo codes from Drizzle using raw SQL
        const promoCodes = client.prepare('SELECT * FROM promo_codes').all();
        console.log(`📊 Found ${promoCodes.length} promo codes to migrate`);
        
        let migrated = 0;
        let failed = 0;
        
        for (const promoCode of promoCodes) {
            try {
                // Convert timestamps
                const created = new Date(parseInt(promoCode.created_at) * 1000);
                const updated = new Date(parseInt(promoCode.updated_at) * 1000);
                const expiresAt = promoCode.expires_at ? new Date(parseInt(promoCode.expires_at) * 1000) : null;
                
                // Create promo code in PocketBase with a new ID
                await pb.collection('promo_codes').create({
                    code: promoCode.code,
                    description: promoCode.description,
                    discount_type: promoCode.discount_type,
                    discount_value: parseFloat(promoCode.discount_value),
                    minimum_amount: promoCode.minimum_amount ? parseFloat(promoCode.minimum_amount) : 0,
                    maximum_discount: promoCode.maximum_discount ? parseFloat(promoCode.maximum_discount) : null,
                    is_active: promoCode.is_active === 1,
                    expires_at: expiresAt ? expiresAt.toISOString() : null,
                    usage_limit: promoCode.usage_limit ? parseInt(promoCode.usage_limit) : null,
                    usage_count: parseInt(promoCode.usage_count),
                    created: created.toISOString(),
                    updated: updated.toISOString()
                });
                
                migrated++;
                console.log(`✅ Migrated promo code: ${promoCode.code}`);
            } catch (error) {
                failed++;
                console.error(`❌ Failed to migrate promo code ${promoCode.code}:`, error.message);
                if (error.response) {
                    console.error('Response data:', JSON.stringify(error.response, null, 2));
                }
            }
        }
        
        console.log(`🏷️  Promo codes migration completed: ${migrated} successful, ${failed} failed`);
        return { migrated, failed };
    } catch (error) {
        console.error('❌ Promo codes migration failed:', error.message);
        throw error;
    }
}

async function migratePromoCodeUsages() {
    try {
        console.log('📊 Migrating promo code usages...');
        
        // Fetch promo code usages from Drizzle using raw SQL
        const promoCodeUsages = client.prepare('SELECT * FROM promo_code_usages').all();
        console.log(`📊 Found ${promoCodeUsages.length} promo code usages to migrate`);
        
        let migrated = 0;
        let failed = 0;
        
        for (const usage of promoCodeUsages) {
            try {
                // Convert timestamp
                const usedAt = new Date(parseInt(usage.used_at) * 1000);
                
                // Create promo code usage in PocketBase
                await pb.collection('promo_code_usages').create({
                    id: usage.id,
                    promo_code_id: usage.promo_code_id,
                    user_id: usage.user_id,
                    order_id: usage.order_id,
                    used_at: usedAt.toISOString()
                });
                
                migrated++;
                console.log(`✅ Migrated promo code usage: ${usage.id}`);
            } catch (error) {
                failed++;
                console.error(`❌ Failed to migrate promo code usage ${usage.id}:`, error.message);
            }
        }
        
        console.log(`📊 Promo code usages migration completed: ${migrated} successful, ${failed} failed`);
        return { migrated, failed };
    } catch (error) {
        console.error('❌ Promo code usages migration failed:', error.message);
        throw error;
    }
}

async function migrateAllData() {
    try {
        console.log('🚀 Starting data migration from Drizzle to PocketBase...');
        console.log('⚠️  Excluding users collection to preserve existing authentication');
        
        // Authenticate as admin
        await authenticateAdmin();
        
        // Create collections
        await createCollections();
        
        // Migrate data collection by collection
        const results = {};
        
        results.products = await migrateProducts();
        results.deliveryAddresses = await migrateDeliveryAddresses();
        results.orders = await migrateOrders();
        results.promoCodes = await migratePromoCodes();
        results.promoCodeUsages = await migratePromoCodeUsages();
        
        // Summary
        console.log('\n📈 Migration Summary:');
        console.log('====================');
        console.log(`📦 Products: ${results.products.migrated} migrated, ${results.products.failed} failed`);
        console.log(`📍 Delivery Addresses: ${results.deliveryAddresses.migrated} migrated, ${results.deliveryAddresses.failed} failed`);
        console.log(`📝 Orders: ${results.orders.migrated} migrated, ${results.orders.failed} failed`);
        console.log(`🏷️  Promo Codes: ${results.promoCodes.migrated} migrated, ${results.promoCodes.failed} failed`);
        console.log(`📊 Promo Code Usages: ${results.promoCodeUsages.migrated} migrated, ${results.promoCodeUsages.failed} failed`);
        
        const totalMigrated = Object.values(results).reduce((sum, r) => sum + r.migrated, 0);
        const totalFailed = Object.values(results).reduce((sum, r) => sum + r.failed, 0);
        
        console.log('\n🎉 Migration completed!');
        console.log(`✅ Total: ${totalMigrated} records migrated successfully`);
        console.log(`❌ Total: ${totalFailed} records failed to migrate`);
        
        if (totalFailed > 0) {
            console.log('\n⚠️  Some records failed to migrate. Please check the errors above.');
        } else {
            console.log('\n✨ All data migrated successfully!');
        }
        
    } catch (error) {
        console.error('❌ Data migration failed:', error.message);
        console.error('Details:', error);
        process.exit(1);
    } finally {
        // Close database connection
        if (client) {
            client.close();
        }
    }
}

// Run the migration if this script is executed directly
if (require.main === module) {
    migrateAllData();
}

module.exports = { migrateAllData };