import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use the same database path as the app
const dbPath = path.join(__dirname, '..', 'drizzle.db');
const db = new Database(dbPath);

console.log('Creating sample promo codes...');

// Sample promo codes data
const samplePromoCodes = [
    {
        id: crypto.randomUUID(),
        code: 'WELCOME10',
        description: 'Welcome discount for new customers',
        discountType: 'percentage',
        discountValue: 10,
        minimumAmount: 0,
        maximumDiscount: null,
        isActive: 1,
        expiresAt: null,
        usageLimit: 1,
        usageCount: 0,
        createdAt: Date.now(),
        updatedAt: Date.now()
    },
    {
        id: crypto.randomUUID(),
        code: 'SAVE50',
        description: 'Save ₴50 on orders over ₴500',
        discountType: 'fixed',
        discountValue: 50,
        minimumAmount: 500,
        maximumDiscount: null,
        isActive: 1,
        expiresAt: null,
        usageLimit: null,
        usageCount: 0,
        createdAt: Date.now(),
        updatedAt: Date.now()
    },
    {
        id: crypto.randomUUID(),
        code: 'FREESHIP',
        description: 'Free shipping on all orders',
        discountType: 'free_shipping',
        discountValue: 0,
        minimumAmount: 0,
        maximumDiscount: null,
        isActive: 1,
        expiresAt: null,
        usageLimit: null,
        usageCount: 0,
        createdAt: Date.now(),
        updatedAt: Date.now()
    },
    {
        id: crypto.randomUUID(),
        code: 'FLASH20',
        description: 'Limited time 20% off - expires in 7 days',
        discountType: 'percentage',
        discountValue: 20,
        minimumAmount: 0,
        maximumDiscount: null,
        isActive: 1,
        expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days from now
        usageLimit: null,
        usageCount: 0,
        createdAt: Date.now(),
        updatedAt: Date.now()
    }
];

// Insert sample promo codes
const insertPromoCode = db.prepare(`
    INSERT OR REPLACE INTO promo_codes
    (id, code, description, discount_type, discount_value, minimum_amount, maximum_discount, is_active, expires_at, usage_limit, usage_count, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

try {
    for (const promoCode of samplePromoCodes) {
        insertPromoCode.run(
            promoCode.id,
            promoCode.code,
            promoCode.description,
            promoCode.discountType,
            promoCode.discountValue,
            promoCode.minimumAmount,
            promoCode.maximumDiscount,
            promoCode.isActive,
            promoCode.expiresAt,
            promoCode.usageLimit,
            promoCode.usageCount,
            promoCode.createdAt,
            promoCode.updatedAt
        );
    }

    console.log('✅ Sample promo codes created successfully!');
    console.log('\n📋 Available promo codes:');
    console.log('   • WELCOME10: 10% off (new customers only)');
    console.log('   • SAVE50: ₴50 off on orders over ₴500');
    console.log('   • FREESHIP: Free shipping');
    console.log('   • FLASH20: 20% off (expires in 7 days)');

} catch (error) {
    console.error('❌ Error creating sample promo codes:', error);
} finally {
    db.close();
}
