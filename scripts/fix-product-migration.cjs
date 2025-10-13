#!/usr/bin/env node

const PocketBase = require('pocketbase').default;
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

async function updateProductCollectionSchema() {
    try {
        console.log('🔧 Updating products collection schema...');
        
        // Authenticate as admin
        await authenticateAdmin();
        
        // Get the products collection
        const collections = await pb.collections.getFullList();
        const productsCollection = collections.find(c => c.name === 'products');
        
        if (!productsCollection) {
            console.error('❌ Products collection not found');
            return;
        }
        
        console.log('Current collection fields:', JSON.stringify(productsCollection.fields, null, 2));
        
        // Define the new fields (including the existing id field)
        const newFields = [
            // Keep the existing id field
            productsCollection.fields.find(f => f.name === 'id'),
            // Add new fields
            {
                "name": "name",
                "type": "text",
                "required": true,
                "options": {
                    "min": 1,
                    "max": 100
                }
            },
            {
                "name": "description",
                "type": "text",
                "required": false,
                "options": {
                    "max": 1000
                }
            },
            {
                "name": "size",
                "type": "text",
                "required": true,
                "options": {}
            },
            {
                "name": "flavor",
                "type": "text",
                "required": true,
                "options": {}
            },
            {
                "name": "price",
                "type": "number",
                "required": true,
                "options": {
                    "min": 0
                }
            },
            {
                "name": "stock",
                "type": "number",
                "required": true,
                "options": {
                    "min": 0
                }
            },
            {
                "name": "categories",
                "type": "json",
                "required": true,
                "options": {}
            },
            {
                "name": "image_urls",
                "type": "json",
                "required": true,
                "options": {}
            },
            {
                "name": "created",
                "type": "date",
                "required": true,
                "options": {}
            },
            {
                "name": "updated",
                "type": "date",
                "required": true,
                "options": {}
            }
        ];
        
        console.log('New fields to set:', JSON.stringify(newFields, null, 2));
        
        // Update the collection with new fields
        const updatedCollection = await pb.collections.update(productsCollection.id, {
            fields: newFields
        });
        
        console.log('✅ Products collection fields updated successfully');
        console.log('Updated collection fields:', JSON.stringify(updatedCollection.fields, null, 2));
        return updatedCollection;
    } catch (error) {
        console.error('❌ Failed to update products collection fields:', error.message);
        if (error.response) {
            console.error('Response data:', JSON.stringify(error.response, null, 2));
        }
        throw error;
    }
}

async function migrateProductData() {
    try {
        console.log('📦 Migrating product data from Drizzle to PocketBase...');
        
        // Update collection schema first
        await updateProductCollectionSchema();
        
        // Re-authenticate as admin (since update might have invalidated the token)
        await authenticateAdmin();
        
        // Fetch products from Drizzle
        const products = client.prepare('SELECT * FROM products').all();
        console.log(`📊 Found ${products.length} products to migrate`);
        
        // Clear existing products in PocketBase
        console.log('🗑️  Clearing existing products in PocketBase...');
        const existingProducts = await pb.collection('products').getFullList();
        for (const product of existingProducts) {
            try {
                await pb.collection('products').delete(product.id);
            } catch (error) {
                console.error(`❌ Failed to delete product ${product.id}:`, error.message);
            }
        }
        console.log('✅ Existing products cleared');
        
        // Migrate products with correct field mappings
        let migrated = 0;
        let failed = 0;
        
        for (const product of products) {
            try {
                // Convert timestamps
                const created = new Date(parseInt(product.created_at) * 1000);
                const updated = new Date(parseInt(product.updated_at) * 1000);
                
                // Create product in PocketBase with correct field mappings
                const productData = {
                    name: product.name,
                    description: product.description,
                    size: product.size,
                    flavor: product.flavor,
                    price: parseInt(product.price),
                    stock: parseInt(product.stock),
                    categories: JSON.parse(product.categories),
                    image_urls: JSON.parse(product.image_urls),
                    created: created.toISOString(),
                    updated: updated.toISOString()
                };
                
                console.log('Creating product with data:', JSON.stringify(productData, null, 2));
                
                await pb.collection('products').create(productData);
                
                migrated++;
                console.log(`✅ Migrated product: ${product.name} (${product.size}, ${product.flavor})`);
            } catch (error) {
                failed++;
                console.error(`❌ Failed to migrate product ${product.name}:`, error.message);
                if (error.response) {
                    console.error('Response data:', JSON.stringify(error.response, null, 2));
                }
            }
        }
        
        console.log(`📦 Product migration completed: ${migrated} successful, ${failed} failed`);
        return { migrated, failed };
    } catch (error) {
        console.error('❌ Product migration failed:', error.message);
        throw error;
    } finally {
        // Close database connection
        if (client) {
            client.close();
        }
    }
}

// Run the script if executed directly
if (require.main === module) {
    migrateProductData()
        .then((result) => {
            console.log('✅ Product migration script completed');
            console.log(`📊 Summary: ${result.migrated} products migrated, ${result.failed} failed`);
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Script failed:', error.message);
            process.exit(1);
        });
}

module.exports = { migrateProductData, updateProductCollectionSchema };