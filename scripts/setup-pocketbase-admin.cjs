// Setup PocketBase admin user
const PocketBase = require('pocketbase').default;
require('dotenv').config(); // load .env so plain `node scripts/x.cjs` works

// PocketBase client configuration
const pb = new PocketBase('http://127.0.0.1:8090');

async function setupAdmin() {
    try {
        console.log('Setting up PocketBase admin user...');
        
        // Use superuser credentials from environment (never hardcode!)
        const adminEmail = process.env.POCKETBASE_ADMIN_EMAIL || 'balancebotanicaukraine@gmail.com';
        const adminPassword = process.env.POCKETBASE_ADMIN_PASSWORD;
        if (!adminPassword) throw new Error('POCKETBASE_ADMIN_PASSWORD is not set (see .env)');

        // Check if admin already exists
        try {
            await pb.collection('_superusers').authWithPassword(adminEmail, adminPassword);
            console.log('✅ Admin user already exists and is authenticated');
            return;
        } catch (authError) {
            console.log('Admin user does not exist or password mismatch.');
        }

        // Create/reset superuser via CLI (PocketBase 0.29+):
        // pocketbase.exe superuser upsert <email> <new-password> --dir=<pb_data>
        console.log('📋 To create or reset the superuser, run:');
        console.log('   pocketbase.exe superuser upsert ' + adminEmail + ' <new-password> --dir=<pb_data>');
        
    } catch (error) {
        console.error('❌ Error setting up admin:', error.message);
        console.error('Details:', error);
    }
}

setupAdmin();