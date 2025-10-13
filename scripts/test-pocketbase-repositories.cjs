// Test PocketBase repositories
const { PocketBaseProductRepository } = require('../src/lib/server/data/repositories/pocketbase-product.repository');
const { PocketBaseUserRepository } = require('../src/lib/server/data/repositories/pocketbase-user.repository');
const { PocketBaseOrderRepository } = require('../src/lib/server/data/repositories/pocketbase-order.repository');
const { PocketBasePromoCodeRepository } = require('../src/lib/server/data/repositories/pocketbase-promo-code.repository');

async function testRepositories() {
    try {
        console.log('🧪 Testing PocketBase Repositories...');
        
        // Test Product Repository
        console.log('\n📦 Testing Product Repository...');
        const productRepo = new PocketBaseProductRepository();
        
        // Test getAll (this will fail until we have collections and data)
        console.log('   Testing getAll()...');
        const products = await productRepo.getAll();
        console.log(`   ✅ Retrieved ${products.length} products`);
        
        // Test User Repository
        console.log('\n👤 Testing User Repository...');
        const userRepo = new PocketBaseUserRepository();
        
        console.log('   Testing getUserByEmail()...');
        const user = await userRepo.getUserByEmail('test@example.com');
        console.log(`   ✅ User lookup result: ${user ? 'Found' : 'Not found'}`);
        
        // Test Order Repository
        console.log('\n📝 Testing Order Repository...');
        const orderRepo = new PocketBaseOrderRepository();
        
        console.log('   Testing getAllOrders()...');
        const orders = await orderRepo.getAllOrders();
        console.log(`   ✅ Retrieved ${orders.length} orders`);
        
        // Test Promo Code Repository
        console.log('\n🏷️  Testing Promo Code Repository...');
        const promoRepo = new PocketBasePromoCodeRepository();
        
        console.log('   Testing findAll()...');
        const promoCodes = await promoRepo.findAll();
        console.log(`   ✅ Retrieved ${promoCodes.length} promo codes`);
        
        console.log('\n🎉 All repository tests completed!');
        console.log('📝 Note: Some operations may fail if collections are not yet created');
        
    } catch (error) {
        console.error('❌ Repository test failed:', error.message);
        console.error('Details:', error);
    }
}

testRepositories();