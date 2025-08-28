// Run migration script for delivery addresses
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to migration script
const migrationPath = path.join(__dirname, '../drizzle/migrations/0003_delivery_addresses_update.sql');
// Path to database
const dbPath = path.join(__dirname, '../drizzle.db');

// Read migration script
const migrationScript = fs.readFileSync(migrationPath, 'utf-8');

// Split script into individual statements
const statements = migrationScript
  .split(';')
  .map(stmt => stmt.trim())
  .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

console.log('Running delivery address migration...');

try {
  // Connect to database
  const db = new Database(dbPath);
  
  // Run each statement
  for (const stmt of statements) {
    if (stmt.includes('SELECT CASE WHEN')) {
      // Handle dynamic SQL generation
      const result = db.prepare(stmt).all();
      if (result && result[0] && result[0].sql_statement !== 'SELECT 1;') {
        console.log('Executing:', result[0].sql_statement);
        db.prepare(result[0].sql_statement).run();
      }
    } else {
      // Run normal statement
      console.log('Executing:', stmt);
      db.prepare(stmt).run();
    }
  }
  
  console.log('Migration complete!');
  
  // Count updated addresses
  const defaultAddresses = db.prepare('SELECT COUNT(*) as count FROM delivery_addresses WHERE is_default = 1').get();
  console.log(`Number of default addresses: ${defaultAddresses.count}`);
  
  // Close database connection
  db.close();
} catch (error) {
  console.error('Error running migration:', error);
  process.exit(1);
}