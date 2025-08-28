-- Add Nova Poshta fields to delivery_addresses table
ALTER TABLE delivery_addresses ADD COLUMN np_city_name TEXT;
ALTER TABLE delivery_addresses ADD COLUMN np_city_full_name TEXT;
ALTER TABLE delivery_addresses ADD COLUMN np_warehouse TEXT;
ALTER TABLE delivery_addresses ADD COLUMN use_nova_post BOOLEAN DEFAULT 0;