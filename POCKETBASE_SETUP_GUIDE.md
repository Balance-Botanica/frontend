# PocketBase Setup Guide for Balance Botanica

This guide explains how to set up PocketBase for the Balance Botanica e-commerce platform.

## Prerequisites

1. PocketBase server running on `http://127.0.0.1:8090`
2. Admin access to the PocketBase admin panel

## Setup Steps

### 1. Access Admin Panel

1. Open your browser and navigate to: http://127.0.0.1:8090/_/
2. Create an admin account with:
   - Email: `balancebotanicaukraine@gmail.com`
   - Password: `diaochan1994qQq`

### 2. Create Collections

Create the following collections in this order:

#### Collection 1: users
- Type: Base collection
- Fields:
  - `email` (Email, required, unique)
  - `first_name` (Text, optional)
  - `last_name` (Text, optional)
  - `phone_number` (Text, optional)
  - `created` (Date, required)

#### Collection 2: products
- Type: Base collection
- Fields:
  - `name` (Text, required)
  - `description` (Text, optional)
  - `size` (Text, required)
  - `flavor` (Text, required)
  - `price` (Number, required, min: 0)
  - `stock` (Number, required, min: 0)
  - `categories` (JSON, required)
  - `image_urls` (JSON, required)
  - `created` (Date, required)
  - `updated` (Date, required)

#### Collection 3: promo_codes
- Type: Base collection
- Fields:
  - `code` (Text, required, unique)
  - `description` (Text, optional)
  - `discount_type` (Select, required, values: percentage, fixed, free_shipping)
  - `discount_value` (Number, required, min: 0)
  - `minimum_amount` (Number, optional, min: 0, default: 0)
  - `maximum_discount` (Number, optional, min: 0)
  - `is_active` (Boolean, required, default: true)
  - `expires_at` (Date, optional)
  - `usage_limit` (Number, optional, min: 0)
  - `usage_count` (Number, optional, min: 0, default: 0)
  - `created` (Date, required)
  - `updated` (Date, required)

#### Collection 4: delivery_addresses
- Type: Base collection
- Fields:
  - `user_id` (Relation to users, required)
  - `name` (Text, optional)
  - `is_default` (Boolean, optional, default: false)
  - `country` (Text, required, default: Ukraine)
  - `np_city_name` (Text, optional)
  - `np_city_full_name` (Text, optional)
  - `np_warehouse` (Text, optional)
  - `use_nova_post` (Boolean, optional, default: false)
  - `created` (Date, required)
  - `updated` (Date, required)

#### Collection 5: orders
- Type: Base collection
- Fields:
  - `user_id` (Relation to users, required)
  - `items` (JSON, required)
  - `total` (Number, required, min: 0)
  - `status` (Select, required, values: pending, confirmed, shipped, delivered, cancelled, default: pending)
  - `delivery_address` (JSON, optional)
  - `notes` (Text, optional)
  - `customer_name` (Text, optional)
  - `customer_phone` (Text, optional)
  - `user_email` (Email, optional)
  - `created` (Date, required)
  - `updated` (Date, required)

#### Collection 6: promo_code_usages
- Type: Base collection
- Fields:
  - `promo_code_id` (Relation to promo_codes, required)
  - `user_id` (Relation to users, required)
  - `order_id` (Text, optional)
  - `used_at` (Date, required)

### 3. Configure Relations

After creating all collections, update the relation fields with the correct collection IDs:

1. In `delivery_addresses`:
   - Set `user_id` relation to point to `users` collection

2. In `orders`:
   - Set `user_id` relation to point to `users` collection

3. In `promo_code_usages`:
   - Set `promo_code_id` relation to point to `promo_codes` collection
   - Set `user_id` relation to point to `users` collection

### 4. Create Indexes (Optional but Recommended)

For better performance, create the following indexes:

1. `users`:
   - Unique index on `email`

2. `products`:
   - Index on `name`
   - Index on `categories`

3. `delivery_addresses`:
   - Index on `user_id`
   - Index on `is_default`

4. `orders`:
   - Index on `user_id`
   - Index on `status`
   - Index on `created`

5. `promo_codes`:
   - Unique index on `code`
   - Index on `is_active`

6. `promo_code_usages`:
   - Index on `promo_code_id`
   - Index on `user_id`

## Testing the Setup

After creating all collections, you can test the setup by:

1. Creating a test product through the admin UI
2. Using the API to fetch products:
   ```bash
   curl http://127.0.0.1:8090/api/collections/products/records
   ```

## Environment Configuration

Update your `.env` file with:

```env
POCKETBASE_URL=http://127.0.0.1:8090
POCKETBASE_ENABLED=true
```

## Next Steps

1. Test the existing PocketBaseProductRepository
2. Create repositories for other entities
3. Update the factory pattern to support PocketBase
4. Implement data migration from Drizzle to PocketBase