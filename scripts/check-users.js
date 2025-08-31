#!/usr/bin/env node

// Check what users exist in the database
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
    console.log('🔍 Checking users in database...');

    // Get all users
    const users = db.prepare('SELECT id, email, first_name, last_name FROM users').all();
    console.log('👥 Found users:', users.length);
    users.forEach(user => {
        console.log(`  - ID: ${user.id}`);
        console.log(`    Email: ${user.email}`);
        console.log(`    Name: ${user.first_name} ${user.last_name}`);
        console.log('');
    });

    if (users.length === 0) {
        console.log('⚠️  No users found in database!');
        console.log('💡 You need to create a user first or seed the database.');
    } else {
        console.log('✅ Found users in database');
    }

} catch (error) {
    console.error('❌ Database query failed:', error);
    process.exit(1);
} finally {
    db.close();
}
