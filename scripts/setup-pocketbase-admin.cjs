// Setup PocketBase admin user
const PocketBase = require('pocketbase').default;

// PocketBase client configuration
const pb = new PocketBase('http://127.0.0.1:8090');

async function setupAdmin() {
    try {
        console.log('Setting up PocketBase admin user...');
        
        // Create admin user
        const adminData = {
            email: 'balancebotanicaukraine@gmail.com',
            password: 'diaochan1994qQq',
            passwordConfirm: 'diaochan1994qQq'
        };
        
        // Check if admin already exists
        try {
            await pb.admins.authWithPassword(adminData.email, adminData.password);
            console.log('✅ Admin user already exists and is authenticated');
            return;
        } catch (authError) {
            console.log('Admin user does not exist, creating new one...');
        }
        
        // Create new admin (this might not work depending on PocketBase setup)
        // For now, we'll just log the credentials to use in the admin panel
        console.log('📋 Please create an admin user manually in the PocketBase admin panel:');
        console.log('   URL: http://127.0.0.1:8090/_/');
        console.log('   Email:', adminData.email);
        console.log('   Password:', adminData.password);
        console.log('   Password Confirm:', adminData.passwordConfirm);
        
    } catch (error) {
        console.error('❌ Error setting up admin:', error.message);
        console.error('Details:', error);
    }
}

setupAdmin();