#!/usr/bin/env node

// Create a test user in the database
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../local.db');
console.log('Database path:', dbPath);

// Open database connection
const db = new Database(dbPath);

try {
    console.log('👤 Creating test user...');

    // Generate user data
    const userId = '7907d65a-35d1-4c44-b941-76fe92c9d551'; // Fixed ID for testing
    const email = 'test@example.com';

    // Check if user already exists
    const existingUser = db.prepare('SELECT id FROM users WHERE id = ?').get(userId);
    if (existingUser) {
        console.log('✅ Test user already exists:', existingUser.id);
        process.exit(0);
    }

    // Insert test user
    const insertUserSQL = `
        INSERT INTO users (id, email, created_at)
        VALUES (?, ?, ?)
    `;

    const now = Date.now();

    db.prepare(insertUserSQL).run(
        userId,
        email,
        now
    );

    console.log('✅ Test user created successfully!');
    console.log('   ID:', userId);
    console.log('   Email:', email);

    // Verify the user was created
    const verifyUser = db.prepare('SELECT id, email, created_at FROM users WHERE id = ?').get(userId);
    console.log('📋 Created user:', verifyUser);

} catch (error) {
    console.error('❌ Failed to create test user:', error);
    process.exit(1);
} finally {
    db.close();
}
