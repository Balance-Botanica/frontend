-- Migration: Add imageUrls array column to products table
-- This allows products to have multiple images instead of just one imageUrl

-- Add the new imageUrls array column
ALTER TABLE products ADD COLUMN imageUrls TEXT[] DEFAULT '{}';

-- Create an index on the array column for better performance
CREATE INDEX idx_products_image_urls ON products USING GIN (imageUrls);

-- Update existing products to migrate single imageUrl to imageUrls array
-- Only if imageUrl is not null and not empty
UPDATE products 
SET imageUrls = ARRAY[imageUrl] 
WHERE imageUrl IS NOT NULL AND imageUrl != '';

-- Add a comment to document the new column
COMMENT ON COLUMN products.imageUrls IS 'Array of image URLs for the product. Replaces single imageUrl field.';
