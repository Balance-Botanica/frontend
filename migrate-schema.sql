-- Migration script to update products table structure
-- Remove unnecessary columns and simplify the schema

-- Drop old columns
ALTER TABLE products DROP COLUMN name_en;
ALTER TABLE products DROP COLUMN description_en;
ALTER TABLE products DROP COLUMN size_en;
ALTER TABLE products DROP COLUMN flavor_en;
ALTER TABLE products DROP COLUMN label_color;

-- Rename timestamp columns to match schema
ALTER TABLE products RENAME COLUMN created_at TO created_at_new;
ALTER TABLE products RENAME COLUMN updated_at TO updated_at_new;

-- Add new timestamp columns with correct names
ALTER TABLE products ADD COLUMN created_at INTEGER;
ALTER TABLE products ADD COLUMN updated_at INTEGER;

-- Copy data from old columns to new ones
UPDATE products SET created_at = created_at_new, updated_at = updated_at_new;

-- Drop old timestamp columns
ALTER TABLE products DROP COLUMN created_at_new;
ALTER TABLE products DROP COLUMN updated_at_new;

-- Update product names to English format
UPDATE products SET name = 'Balance Botanica Golden Paste CBD' WHERE categories LIKE '%Пасти%';
UPDATE products SET name = 'Balance Botanica CBD Oil' WHERE categories LIKE '%Олія%';

-- Update descriptions to be more generic
UPDATE products SET description = 'Premium CBD product for pets with natural ingredients and health benefits.';
