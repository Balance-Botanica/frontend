import Database from 'better-sqlite3';

try {
	const db = new Database('./drizzle.db');

	console.log('=== Initializing Database Schema ===');

	// Create categories table
	db.prepare(
		`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      name_en TEXT,
      description TEXT,
      description_en TEXT,
      slug TEXT NOT NULL UNIQUE,
      color TEXT,
      created_at INTEGER,
      updated_at INTEGER
    )
  `
	).run();
	console.log('✅ Created categories table');

	// Create products table
	db.prepare(
		`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      name_en TEXT,
      description TEXT,
      description_en TEXT,
      price INTEGER NOT NULL,
      stock INTEGER NOT NULL,
      size TEXT NOT NULL,
      size_en TEXT,
      flavor TEXT NOT NULL,
      flavor_en TEXT,
      label_color TEXT NOT NULL,
      image_urls TEXT NOT NULL,
      created_at INTEGER,
      updated_at INTEGER
    )
  `
	).run();
	console.log('✅ Created products table');

	// Create product_categories junction table
	db.prepare(
		`
    CREATE TABLE IF NOT EXISTS product_categories (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      category_id TEXT NOT NULL,
      created_at INTEGER,
      FOREIGN KEY (product_id) REFERENCES products(id),
      FOREIGN KEY (category_id) REFERENCES categories(id)
    )
  `
	).run();
	console.log('✅ Created product_categories table');

	// Create users table
	db.prepare(
		`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      created_at INTEGER
    )
  `
	).run();
	console.log('✅ Created users table');

	// Add missing columns to users table
	try {
		// Check and add first_name column
		const firstNameExists = db.prepare(`
			SELECT COUNT(*) as count
			FROM pragma_table_info('users')
			WHERE name = 'first_name'
		`).get();

		if (firstNameExists.count === 0) {
			db.prepare('ALTER TABLE users ADD COLUMN first_name TEXT').run();
			console.log('✅ Added first_name column to users table');
		}

		// Check and add last_name column
		const lastNameExists = db.prepare(`
			SELECT COUNT(*) as count
			FROM pragma_table_info('users')
			WHERE name = 'last_name'
		`).get();

		if (lastNameExists.count === 0) {
			db.prepare('ALTER TABLE users ADD COLUMN last_name TEXT').run();
			console.log('✅ Added last_name column to users table');
		}

		// Check and add phone_number column
		const phoneExists = db.prepare(`
			SELECT COUNT(*) as count
			FROM pragma_table_info('users')
			WHERE name = 'phone_number'
		`).get();

		if (phoneExists.count === 0) {
			db.prepare('ALTER TABLE users ADD COLUMN phone_number TEXT').run();
			console.log('✅ Added phone_number column to users table');
		}
	} catch (error) {
		console.error('❌ Error adding columns to users table:', error);
	}

	// Create sessions table
	db.prepare(
		`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `
	).run();
	console.log('✅ Created sessions table');

	console.log('🎉 Database schema initialized successfully!');

	db.close();
} catch (error) {
	console.error('❌ Error initializing database:', error);
}
