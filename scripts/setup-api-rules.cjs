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

async function setupPromoCodeUsagesCollection() {
  try {
    console.log('🔧 Setting up promo_code_usages collection...');
    
    // Authenticate as admin
    await authenticateAdmin();
    
    // Get all collections
    const collections = await pb.collections.getFullList();
    
    // Find required collections
    const usersCollection = collections.find(c => c.name === 'users');
    const promoCodesCollection = collections.find(c => c.name === 'promo_codes');
    const promoCodeUsagesCollection = collections.find(c => c.name === 'promo_code_usages');
    
    if (!usersCollection || !promoCodesCollection) {
      console.error('❌ Required collections not found');
      return;
    }
    
    if (promoCodeUsagesCollection) {
      console.log('   📦 Updating promo_code_usages collection fields...');
      
      // Define the fields for promo_code_usages
      const fields = [
        // Keep the existing id field
        promoCodeUsagesCollection.fields.find(f => f.name === 'id'),
        // Add relation to users
        {
          "name": "user_id",
          "type": "relation",
          "required": true,
          "options": {
            "collectionId": usersCollection.id,
            "cascadeDelete": false,
            "minSelect": 1,
            "maxSelect": 1
          }
        },
        // Add relation to promo_codes
        {
          "name": "promo_code_id",
          "type": "relation",
          "required": true,
          "options": {
            "collectionId": promoCodesCollection.id,
            "cascadeDelete": false,
            "minSelect": 1,
            "maxSelect": 1
          }
        },
        // Add order_id field
        {
          "name": "order_id",
          "type": "text",
          "required": false,
          "options": {}
        },
        // Add used_at field
        {
          "name": "used_at",
          "type": "date",
          "required": true,
          "options": {}
        }
      ];
      
      // Update the collection with new fields
      const updateData = {
        fields: fields
      };
      
      await pb.collections.update(promoCodeUsagesCollection.id, updateData);
      console.log('   ✅ promo_code_usages collection updated with fields');
    }
    
  } catch (error) {
    console.error('❌ Failed to setup promo_code_usages collection:', error.message);
    if (error.response) {
      console.error('Response data:', JSON.stringify(error.response, null, 2));
    }
  }
}

async function setupApiRules() {
  try {
    console.log('🔧 Setting up API rules for collections...');
    
    // Authenticate as admin
    await authenticateAdmin();
    
    // Get all collections
    const collections = await pb.collections.getFullList();
    
    console.log('\n🛠️  Setting up API Rules:');
    console.log('====================');
    
    // Users collection rules
    const usersCollection = collections.find(c => c.name === 'users');
    if (usersCollection) {
      console.log('\n📝 Setting rules for: users');
      try {
        await pb.collections.update(usersCollection.id, {
          listRule: null, // Admin only
          viewRule: null, // Admin only
          createRule: "email != ''", // Anyone can create with email
          updateRule: "id = @request.auth.id", // Users can update their own
          deleteRule: "id = @request.auth.id"  // Users can delete their own
        });
        console.log('✅ Rules set for: users');
      } catch (error) {
        console.error('❌ Failed to set rules for users:', error.message);
      }
    }
    
    // Products collection rules
    const productsCollection = collections.find(c => c.name === 'products');
    if (productsCollection) {
      console.log('\n📝 Setting rules for: products');
      try {
        await pb.collections.update(productsCollection.id, {
          listRule: null, // Public read
          viewRule: null, // Public read
          createRule: null, // Admin only
          updateRule: null, // Admin only
          deleteRule: null  // Admin only
        });
        console.log('✅ Rules set for: products');
      } catch (error) {
        console.error('❌ Failed to set rules for products:', error.message);
      }
    }
    
    // Promo codes collection rules
    const promoCodesCollection = collections.find(c => c.name === 'promo_codes');
    if (promoCodesCollection) {
      console.log('\n📝 Setting rules for: promo_codes');
      try {
        await pb.collections.update(promoCodesCollection.id, {
          listRule: "is_active = true", // Public read (active only)
          viewRule: "is_active = true", // Public read (active only)
          createRule: null, // Admin only
          updateRule: null, // Admin only
          deleteRule: null  // Admin only
        });
        console.log('✅ Rules set for: promo_codes');
      } catch (error) {
        console.error('❌ Failed to set rules for promo_codes:', error.message);
      }
    }
    
    // Delivery addresses collection rules
    const deliveryAddressesCollection = collections.find(c => c.name === 'delivery_addresses');
    if (deliveryAddressesCollection) {
      console.log('\n📝 Setting rules for: delivery_addresses');
      try {
        await pb.collections.update(deliveryAddressesCollection.id, {
          listRule: "user_id = @request.auth.id", // Users can list their own
          viewRule: "user_id = @request.auth.id", // Users can view their own
          createRule: "user_id = @request.auth.id", // Users can create for themselves
          updateRule: "user_id = @request.auth.id", // Users can update their own
          deleteRule: "user_id = @request.auth.id"  // Users can delete their own
        });
        console.log('✅ Rules set for: delivery_addresses');
      } catch (error) {
        console.error('❌ Failed to set rules for delivery_addresses:', error.message);
      }
    }
    
    // Orders collection rules
    const ordersCollection = collections.find(c => c.name === 'orders');
    if (ordersCollection) {
      console.log('\n📝 Setting rules for: orders');
      try {
        await pb.collections.update(ordersCollection.id, {
          listRule: "user_id = @request.auth.id", // Users can list their own
          viewRule: "user_id = @request.auth.id", // Users can view their own
          createRule: "user_id = @request.auth.id", // Users can create for themselves
          updateRule: "user_id = @request.auth.id && status = 'pending'", // Users can update pending orders
          deleteRule: "user_id = @request.auth.id && status = 'pending'"  // Users can delete pending orders
        });
        console.log('✅ Rules set for: orders');
      } catch (error) {
        console.error('❌ Failed to set rules for orders:', error.message);
      }
    }
    
    // Promo code usages collection rules
    const promoCodeUsagesCollection = collections.find(c => c.name === 'promo_code_usages');
    if (promoCodeUsagesCollection) {
      console.log('\n📝 Setting rules for: promo_code_usages');
      try {
        await pb.collections.update(promoCodeUsagesCollection.id, {
          listRule: "user_id = @request.auth.id", // Users can list their own
          viewRule: "user_id = @request.auth.id", // Users can view their own
          createRule: "user_id = @request.auth.id", // Users can create for themselves
          updateRule: null, // No updates allowed
          deleteRule: null  // No deletions allowed
        });
        console.log('✅ Rules set for: promo_code_usages');
      } catch (error) {
        console.error('❌ Failed to set rules for promo_code_usages:', error.message);
      }
    }
    
    console.log('\n🎉 API rules setup completed!');
    
  } catch (error) {
    console.error('❌ Failed to setup API rules:', error.message);
    throw error;
  }
}

async function verifyApiRules() {
  try {
    console.log('🔍 Verifying API rules...');
    
    // Authenticate as admin
    await authenticateAdmin();
    
    // Get all collections
    const collections = await pb.collections.getFullList();
    
    console.log('\n✅ Final API Rules Verification:');
    console.log('==============================');
    
    collections.forEach((collection, index) => {
      // Skip system collections for verification
      if (collection.name.startsWith('_')) {
        return;
      }
      
      console.log(`\n${index + 1}. ${collection.name} (${collection.type})`);
      console.log(`   List Rule: ${collection.listRule || 'None'}`);
      console.log(`   View Rule: ${collection.viewRule || 'None'}`);
      console.log(`   Create Rule: ${collection.createRule || 'None'}`);
      console.log(`   Update Rule: ${collection.updateRule || 'None'}`);
      console.log(`   Delete Rule: ${collection.deleteRule || 'None'}`);
    });
    
  } catch (error) {
    console.error('❌ Failed to verify API rules:', error.message);
    throw error;
  }
}

// Run the script if executed directly
if (require.main === module) {
  setupPromoCodeUsagesCollection()
    .then(() => setupApiRules())
    .then(() => verifyApiRules())
    .then(() => {
      console.log('\n✅ API rules setup completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script failed:', error.message);
      process.exit(1);
    });
}

module.exports = { setupApiRules, setupPromoCodeUsagesCollection, verifyApiRules };