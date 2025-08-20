-- Migration script to update products table structure
-- Create new categories table and many-to-many relationship

-- Create categories table
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
);

-- Create product_categories junction table
CREATE TABLE IF NOT EXISTS product_categories (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    category_id TEXT NOT NULL,
    created_at INTEGER,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Insert initial categories
INSERT INTO categories (id, name, name_en, description, description_en, slug, color, created_at, updated_at) VALUES
('cat-1', 'Пасти', 'Pastes', 'Золоті пасти з куркумою та CBD', 'Golden pastes with turmeric and CBD', 'pasty', '#FFD700', strftime('%s', 'now'), strftime('%s', 'now')),
('cat-2', 'Олія', 'Oils', 'CBD олії для домашніх тварин', 'CBD oils for pets', 'oliya', '#4b766e', strftime('%s', 'now'), strftime('%s', 'now')),
('cat-3', 'Смаколики', 'Treats', 'Смачні ласощі з CBD', 'Delicious CBD treats', 'smakolyky', '#FF6B6B', strftime('%s', 'now'), strftime('%s', 'now'));

-- Add new columns to existing products table
ALTER TABLE products ADD COLUMN size TEXT;
ALTER TABLE products ADD COLUMN size_en TEXT;
ALTER TABLE products ADD COLUMN flavor TEXT;
ALTER TABLE products ADD COLUMN flavor_en TEXT;
ALTER TABLE products ADD COLUMN label_color TEXT;

-- Update existing products with default values and link to categories
UPDATE products SET 
    size = '30мл',
    size_en = '30ml',
    flavor = 'натуральний',
    flavor_en = 'natural',
    label_color = '#4b766e'
WHERE name LIKE '%Oil%';

UPDATE products SET 
    size = '30г',
    size_en = '30g',
    flavor = 'натуральний',
    flavor_en = 'natural',
    label_color = '#4b766e'
WHERE name LIKE '%Cream%';

-- Link existing products to categories
INSERT INTO product_categories (id, product_id, category_id, created_at) 
SELECT 
    'pc-' || hex(randomblob(4)), 
    p.id, 
    CASE 
        WHEN p.name LIKE '%Oil%' THEN 'cat-2'
        WHEN p.name LIKE '%Cream%' THEN 'cat-1'
        ELSE 'cat-1'
    END,
    strftime('%s', 'now')
FROM products p;

-- Set English names and descriptions for existing products
UPDATE products SET 
    name_en = 'CBD Oil for Dogs - Anxiety Relief',
    description_en = 'Premium CBD oil specially formulated for dogs to help with anxiety, stress, and behavioral issues. Made with organic hemp extract and natural ingredients.'
WHERE name = 'CBD Oil for Dogs - Anxiety Relief';

UPDATE products SET 
    name_en = 'CBD Topical Cream for Joint Pain',
    description_en = 'Advanced CBD topical cream designed to provide targeted relief for joint pain and inflammation in pets. Fast-acting formula with natural ingredients.'
WHERE name = 'CBD Topical Cream for Joint Pain';

-- Remove old category columns (will be handled by application code)
-- ALTER TABLE products DROP COLUMN category;
-- ALTER TABLE products DROP COLUMN category_en;
