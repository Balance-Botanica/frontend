-- Migration script to update delivery_addresses table
-- Add new columns for multiple addresses

-- First, check if columns already exist to avoid errors
SELECT
  CASE
    WHEN count(*) = 0 THEN 'ALTER TABLE delivery_addresses ADD COLUMN name TEXT;'
    ELSE 'SELECT 1;'
  END AS sql_statement
FROM pragma_table_info('delivery_addresses')
WHERE name = 'name';

-- Add is_default column if it doesn't exist
SELECT
  CASE
    WHEN count(*) = 0 THEN 'ALTER TABLE delivery_addresses ADD COLUMN is_default INTEGER DEFAULT 0;'
    ELSE 'SELECT 1;'
  END AS sql_statement
FROM pragma_table_info('delivery_addresses')
WHERE name = 'is_default';

-- Update existing records to have at least one default address per user
WITH user_first_addresses AS (
  SELECT id, user_id, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at) as rn
  FROM delivery_addresses
)
UPDATE delivery_addresses
SET is_default = 1
WHERE id IN (
  SELECT id FROM user_first_addresses WHERE rn = 1
);

-- Add index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_delivery_addresses_user_id ON delivery_addresses(user_id);