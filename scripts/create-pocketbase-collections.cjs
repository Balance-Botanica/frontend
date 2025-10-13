// Create PocketBase collections programmatically
const PocketBase = require('pocketbase').default;

// PocketBase client configuration
const pb = new PocketBase('http://127.0.0.1:8090');

async function createCollections() {
    try {
        console.log('Creating PocketBase collections...');
        
        // You'll need to authenticate as admin first
        // This would typically be done with:
        // await pb.admins.authWithPassword('admin@balancebotanica.com', 'admin123456');
        
        console.log('⚠️  This script requires manual admin authentication first.');
        console.log('📋 Please authenticate as admin in the PocketBase admin panel:');
        console.log('   URL: http://127.0.0.1:8090/_/');
        console.log('   Email: admin@balancebotanica.com');
        console.log('   Password: admin123456');
        console.log('');
        
        // Define collections structure
        const collections = [
            {
                name: 'products',
                type: 'base',
                schema: [
                    { name: 'name', type: 'text', required: true, options: { min: 1, max: 100 } },
                    { name: 'description', type: 'text', required: false, options: { max: 1000 } },
                    { name: 'size', type: 'text', required: true },
                    { name: 'flavor', type: 'text', required: true },
                    { name: 'price', type: 'number', required: true, options: { min: 0 } },
                    { name: 'stock', type: 'number', required: true, options: { min: 0 } },
                    { name: 'categories', type: 'json', required: true },
                    { name: 'image_urls', type: 'json', required: true },
                    { name: 'created', type: 'date', required: true },
                    { name: 'updated', type: 'date', required: true }
                ]
            },
            {
                name: 'users',
                type: 'base',
                schema: [
                    { name: 'email', type: 'email', required: true },
                    { name: 'first_name', type: 'text', required: false },
                    { name: 'last_name', type: 'text', required: false },
                    { name: 'phone_number', type: 'text', required: false },
                    { name: 'created', type: 'date', required: true }
                ]
            },
            {
                name: 'delivery_addresses',
                type: 'base',
                schema: [
                    { name: 'user_id', type: 'relation', required: true, options: { collectionId: '', cascadeDelete: true } },
                    { name: 'name', type: 'text', required: false },
                    { name: 'is_default', type: 'bool', required: false, options: { default: false } },
                    { name: 'country', type: 'text', required: true, options: { default: 'Ukraine' } },
                    { name: 'np_city_name', type: 'text', required: false },
                    { name: 'np_city_full_name', type: 'text', required: false },
                    { name: 'np_warehouse', type: 'text', required: false },
                    { name: 'use_nova_post', type: 'bool', required: false, options: { default: false } },
                    { name: 'created', type: 'date', required: true },
                    { name: 'updated', type: 'date', required: true }
                ]
            },
            {
                name: 'orders',
                type: 'base',
                schema: [
                    { name: 'user_id', type: 'relation', required: true, options: { collectionId: '', cascadeDelete: false } },
                    { name: 'items', type: 'json', required: true },
                    { name: 'total', type: 'number', required: true, options: { min: 0 } },
                    { name: 'status', type: 'select', required: true, options: { values: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'], default: 'pending' } },
                    { name: 'delivery_address', type: 'json', required: false },
                    { name: 'notes', type: 'text', required: false },
                    { name: 'customer_name', type: 'text', required: false },
                    { name: 'customer_phone', type: 'text', required: false },
                    { name: 'user_email', type: 'email', required: false },
                    { name: 'created', type: 'date', required: true },
                    { name: 'updated', type: 'date', required: true }
                ]
            },
            {
                name: 'promo_codes',
                type: 'base',
                schema: [
                    { name: 'code', type: 'text', required: true },
                    { name: 'description', type: 'text', required: false },
                    { name: 'discount_type', type: 'select', required: true, options: { values: ['percentage', 'fixed', 'free_shipping'] } },
                    { name: 'discount_value', type: 'number', required: true, options: { min: 0 } },
                    { name: 'minimum_amount', type: 'number', required: false, options: { min: 0, default: 0 } },
                    { name: 'maximum_discount', type: 'number', required: false, options: { min: 0 } },
                    { name: 'is_active', type: 'bool', required: true, options: { default: true } },
                    { name: 'expires_at', type: 'date', required: false },
                    { name: 'usage_limit', type: 'number', required: false, options: { min: 0 } },
                    { name: 'usage_count', type: 'number', required: false, options: { min: 0, default: 0 } },
                    { name: 'created', type: 'date', required: true },
                    { name: 'updated', type: 'date', required: true }
                ]
            },
            {
                name: 'promo_code_usages',
                type: 'base',
                schema: [
                    { name: 'promo_code_id', type: 'relation', required: true, options: { collectionId: '', cascadeDelete: false } },
                    { name: 'user_id', type: 'relation', required: true, options: { collectionId: '', cascadeDelete: false } },
                    { name: 'order_id', type: 'text', required: false },
                    { name: 'used_at', type: 'date', required: true }
                ]
            }
        ];
        
        console.log('📋 Collections defined:');
        collections.forEach(collection => {
            console.log(`   - ${collection.name}`);
        });
        
        console.log('');
        console.log('📝 To create collections programmatically:');
        console.log('1. Uncomment the admin authentication code');
        console.log('2. Update relation collection IDs after creating base collections');
        console.log('3. Use pb.collections.create() for each collection');
        
        // Example of how to create a collection (commented out for safety):
        /*
        for (const collection of collections) {
            try {
                const result = await pb.collections.create(collection);
                console.log(`✅ Created collection: ${collection.name}`);
            } catch (error) {
                console.error(`❌ Failed to create collection ${collection.name}:`, error.message);
            }
        }
        */
        
    } catch (error) {
        console.error('❌ Error creating collections:', error.message);
        console.error('Details:', error);
    }
}

createCollections();