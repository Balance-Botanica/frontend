# PocketBase Migration Plan - Balance Botanica

## Overview

This document outlines the comprehensive plan for migrating the Balance Botanica e-commerce platform from Drizzle ORM with SQLite to PocketBase for enhanced data management and administration capabilities.

## Current Drizzle Implementation Analysis

### Database Collections (Tables)

1. **Products** - CBD product information
2. **Users** - User account information
3. **Delivery Addresses** - User delivery addresses with Nova Poshta integration
4. **Sessions** - User authentication sessions
5. **Orders** - Customer orders with items and status tracking
6. **Promo Codes** - Discount codes with usage tracking
7. **Promo Code Usages** - Tracking of promo code usage per user/order

### Current Architecture

#### Database Connection
- File: `src/lib/server/db/index.ts`
- Uses `better-sqlite3` with Drizzle ORM
- Connects to `./drizzle.db` by default

#### Schema Definition
- File: `src/lib/server/db/schema.ts`
- Defines all 7 tables with proper relationships and constraints

#### Repository Pattern Implementation
- Each entity has a Drizzle repository implementation:
  - DrizzleProductRepository - Product operations
  - DrizzleOrderRepository - Order operations
  - User/Session/Address operations (in user repository)
  - Promo code operations

#### Domain Layer
- Interfaces define contracts for all entities and repositories
- Clean separation between domain models and database schema

#### Factory Pattern
- ProductRepositoryFactory allows switching between data sources
- Currently hardcoded to use Drizzle but designed for extensibility

#### Existing PocketBase Integration
- PocketBase client configuration in `src/lib/server/pocketbase/index.ts`
- Partial PocketBaseProductRepository implementation
- Environment variable support for PocketBase URL

## Migration Plan

### Phase 1: PocketBase Collection Setup

#### 1. Define PocketBase Collections Schema

Create equivalent collections in PocketBase for all Drizzle tables:

1. **Products Collection**
   - Fields: id, name, description, size, flavor, price, stock, categories (JSON), image_urls (JSON), created, updated
   - Indexes: name, categories

2. **Users Collection**
   - Fields: id, email, first_name, last_name, phone_number, created
   - Indexes: email (unique)

3. **Delivery Addresses Collection**
   - Fields: id, user_id (relation), name, is_default, country, np_city_name, np_city_full_name, np_warehouse, use_nova_post, created, updated
   - Indexes: user_id, is_default

4. **Orders Collection**
   - Fields: id, user_id (relation), items (JSON), total, status, delivery_address (JSON), notes, customer_name, customer_phone, user_email, created, updated
   - Indexes: user_id, status, created

5. **Promo Codes Collection**
   - Fields: id, code, description, discount_type, discount_value, minimum_amount, maximum_discount, is_active, expires_at, usage_limit, usage_count, created, updated
   - Indexes: code (unique), is_active

6. **Promo Code Usages Collection**
   - Fields: id, promo_code_id (relation), user_id (relation), order_id, used_at
   - Indexes: promo_code_id, user_id

#### 2. Create Collection Migration Scripts

Create scripts to define these collections in PocketBase programmatically.

### Phase 2: Repository Implementation

#### 1. Complete PocketBase Repository Implementations

For each entity, create a complete PocketBase repository:

1. **PocketBaseProductRepository** (partially implemented)
2. **PocketBaseUserRepository** (needs implementation)
3. **PocketBaseOrderRepository** (needs implementation)
4. **PocketBasePromoCodeRepository** (needs implementation)

#### 2. Update Repository Factory

Modify ProductRepositoryFactory to enable PocketBase support:
- Uncomment PocketBase imports
- Enable PocketBase creation in factory methods
- Add environment variable support for data source selection

### Phase 3: Data Migration

#### 1. Create Data Migration Scripts

Develop scripts to migrate existing data from Drizzle to PocketBase:
- Export data from Drizzle tables
- Transform to PocketBase format
- Import into PocketBase collections

#### 2. Handle Data Type Conversions

Ensure proper conversion between:
- Unix timestamps (Drizzle) ↔ Date objects (PocketBase)
- JSON strings (Drizzle) ↔ JSON objects (PocketBase)
- Integer booleans (Drizzle) ↔ Boolean values (PocketBase)

### Phase 4: Service Layer Updates

#### 1. Update Product Service

Modify ProductService to work with either repository seamlessly.

#### 2. Update Order Service

Ensure order management works with PocketBase repositories.

#### 3. Update User Service

Update authentication and user management to use PocketBase where appropriate.

### Phase 5: Environment Configuration

#### 1. Update Environment Variables

Add configuration options:
- `POCKETBASE_ENABLED` - Enable/disable PocketBase
- `POCKETBASE_URL` - PocketBase server URL
- `POCKETBASE_ADMIN_EMAIL` - Admin credentials for setup
- `POCKETBASE_ADMIN_PASSWORD` - Admin credentials for setup

#### 2. Create Configuration Management

Implement proper configuration loading and validation.

### Phase 6: Testing and Validation

#### 1. Create Integration Tests

Develop tests to verify:
- Data consistency between Drizzle and PocketBase
- Repository operations work correctly
- Service layer functions properly
- API endpoints return correct data

#### 2. Performance Testing

Ensure PocketBase performance meets requirements:
- Query response times
- Concurrent user handling
- Data synchronization

### Phase 7: Deployment and Monitoring

#### 1. Create Deployment Scripts

Develop scripts for:
- PocketBase server setup
- Collection initialization
- Data migration
- Service configuration

#### 2. Implement Monitoring

Add logging and monitoring for:
- Database operations
- Error tracking
- Performance metrics

## Technical Considerations

### 1. Hybrid Approach

Consider maintaining Drizzle for some operations while using PocketBase for others:
- Keep Drizzle for user authentication (more secure)
- Use PocketBase for product management (better admin interface)

### 2. Data Synchronization

Implement mechanisms to keep data consistent between systems during transition.

### 3. Error Handling

Ensure robust error handling for:
- Network failures
- Data conversion issues
- Schema mismatches

### 4. Security

- Proper authentication for PocketBase API calls
- Secure storage of credentials
- Input validation and sanitization

## Rollback Plan

Prepare for potential issues:
- Maintain ability to switch back to Drizzle-only
- Keep backup of original Drizzle database
- Document rollback procedures

## Next Steps

1. Create PocketBase collection definitions
2. Implement complete PocketBase repositories
3. Update factory patterns to support PocketBase
4. Create data migration scripts
5. Test with sample data
6. Implement hybrid approach for gradual migration