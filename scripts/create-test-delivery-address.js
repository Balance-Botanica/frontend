#!/usr/bin/env node

// Create a test delivery address
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../local.db');
console.log('Database path:', dbPath);

// Open database connection
const db = new Database(dbPath);

try {
    console.log('🏠 Creating test delivery address...');

    // Create test delivery address that matches the one from logs
    const addressId = '529cf62a-54ba-47af-8c5e-7f6073209d48';
    const userId = '7907d65a-35d1-4c44-b941-76fe92c9d551';

    // Check if address already exists
    const existingAddress = db.prepare('SELECT id FROM delivery_addresses WHERE id = ?').get(addressId);
    if (existingAddress) {
        console.log('✅ Test delivery address already exists:', existingAddress.id);
        process.exit(0);
    }

    const insertAddressSQL = `
        INSERT INTO delivery_addresses (
            id, user_id, name, is_default, street, city, postal_code, country,
            np_city_name, np_city_full_name, np_warehouse, use_nova_post,
            created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const now = Date.now();

    db.prepare(insertAddressSQL).run(
        addressId,
        userId,
        'фівфів', // name from logs
        1, // is_default = true
        '', // street
        '', // city
        '', // postal_code
        'Ukraine', // country
        'Коцюбинське', // np_city_name
        'смт Коцюбинське, Бучанський р-н, Київська обл.', // np_city_full_name
        'Поштомат "Нова Пошта" №2631: вул. Пономарьова, 26 к1, під\'їзд №4 (ТІЛЬКИ ДЛЯ МЕШКАНЦІВ)', // np_warehouse
        1, // use_nova_post = true
        now,
        now
    );

    console.log('✅ Test delivery address created successfully!');
    console.log('   ID:', addressId);
    console.log('   User ID:', userId);
    console.log('   Name: фівфів');

    // Verify the address was created
    const verifyAddress = db.prepare('SELECT * FROM delivery_addresses WHERE id = ?').get(addressId);
    console.log('📋 Created address:', verifyAddress);

} catch (error) {
    console.error('❌ Failed to create test delivery address:', error);
    process.exit(1);
} finally {
    db.close();
}
