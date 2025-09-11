-- Remove unused address fields (street, city, postal_code) from delivery_addresses table
-- These fields are not used since we're focused on Nova Poshta delivery

ALTER TABLE delivery_addresses DROP COLUMN street;
ALTER TABLE delivery_addresses DROP COLUMN city;
ALTER TABLE delivery_addresses DROP COLUMN postal_code;
