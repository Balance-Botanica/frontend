#!/usr/bin/env node

const PocketBase = require('pocketbase').default;

// Configuration
const POCKETBASE_URL = process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';
const POCKETBASE_ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL || 'balancebotanicaukraine@gmail.com';
const POCKETBASE_ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD || 'diaochan1994qQq';

// PocketBase client
const pb = new PocketBase(POCKETBASE_URL);

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

async function checkCollectionDetails() {
    try {
        console.log('🔍 Checking collection details...');
        
        // Authenticate as admin
        await authenticateAdmin();
        
        // Get all collections
        const collections = await pb.collections.getFullList();
        console.log(`📊 Total collections: ${collections.length}`);
        
        // Find the products collection
        const productsCollection = collections.find(c => c.name === 'products');
        
        if (productsCollection) {
            console.log('\n📦 Products Collection Details:');
            console.log('=====================================');
            console.log(`ID: ${productsCollection.id}`);
            console.log(`Name: ${productsCollection.name}`);
            console.log(`Type: ${productsCollection.type}`);
            console.log(`Created: ${productsCollection.created}`);
            console.log(`Updated: ${productsCollection.updated}`);
            console.log(`System: ${productsCollection.system}`);
            
            // Check fields
            console.log('\nFields:');
            if (productsCollection.fields && productsCollection.fields.length > 0) {
                productsCollection.fields.forEach((field, index) => {
                    console.log(`  ${index + 1}. ${field.name} (${field.type})`);
                    console.log(`     Required: ${field.required}`);
                    console.log(`     System: ${field.system}`);
                    if (field.options) {
                        console.log(`     Options: ${JSON.stringify(field.options)}`);
                    }
                });
            } else {
                console.log('  No fields defined');
            }
            
            // Check schema
            console.log('\nSchema:');
            if (productsCollection.schema) {
                console.log(JSON.stringify(productsCollection.schema, null, 2));
            } else {
                console.log('  No schema defined');
            }
        } else {
            console.log('❌ Products collection not found');
        }
        
    } catch (error) {
        console.error('❌ Collection check failed:', error.message);
        if (error.response) {
            console.error('Response data:', JSON.stringify(error.response, null, 2));
        }
        throw error;
    }
}

// Run the script if executed directly
if (require.main === module) {
    checkCollectionDetails()
        .then(() => {
            console.log('✅ Collection check completed');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Script failed:', error.message);
            process.exit(1);
        });
}

module.exports = { checkCollectionDetails };