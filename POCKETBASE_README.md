# PocketBase Integration for Balance Botanica

This directory contains all the necessary files and scripts to integrate PocketBase with the Balance Botanica e-commerce platform.

## 🚀 Quick Start

1. **Start PocketBase Server**
   ```bash
   npm run pb:start
   ```

2. **Test Integration**
   ```bash
   npm run pb:test
   ```

3. **Access Admin Panel**
   Open http://127.0.0.1:8090/_/ in your browser

## 📁 Directory Structure

```
pocketbase/
├── pocketbase.exe          # PocketBase executable
├── pb_data/               # Database files
└── pb_migrations/         # Migration files (when created)

scripts/
├── start-pocketbase.cjs   # Start PocketBase server
├── final-pocketbase-test.cjs  # Integration test
└── ...                    # Other setup scripts

src/lib/server/pocketbase/
├── index.ts               # PocketBase client configuration
└── products.ts            # Product-related utilities
```

## 🛠️ Available Commands

```bash
# Start PocketBase server
npm run pb:start

# Test PocketBase integration
npm run pb:test

# Setup collections (after admin authentication)
npm run pb:setup-collections

# Test PocketBase repositories
npm run pb:test-repositories
```

## 📚 Documentation

- `POCKETBASE_MIGRATION_PLAN.md` - Complete migration strategy
- `POCKETBASE_SETUP_GUIDE.md` - Step-by-step setup instructions
- `POCKETBASE_INTEGRATION_SUMMARY.md` - Current status overview
- `POCKETBASE_INTEGRATION_COMPLETED.md` - Phase 1 completion report

## 🔧 Configuration

The PocketBase client is configured in `src/lib/server/pocketbase/index.ts` and uses the following environment variables:

- `POCKETBASE_URL` - PocketBase server URL (defaults to http://127.0.0.1:8090)

## 🏗️ Next Steps

1. Create admin user in the PocketBase admin panel
2. Create collections using the setup guide
3. Implement remaining PocketBase repositories
4. Update factory pattern to support switching
5. Create data migration scripts

## 📞 Support

For issues with PocketBase integration, refer to the documentation files or check the PocketBase documentation at https://pocketbase.io/docs/