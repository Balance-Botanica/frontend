#!/bin/bash

# Migration script from Drizzle ORM to PocketBase
# This script helps migrate your Balance Botanica project from Drizzle to PocketBase
# NOTE: Currently using Drizzle by default. PocketBase is disabled for initial development.

set -e  # Exit on any error

echo "🚀 Balance Botanica - Migration to PocketBase"
echo "=============================================="
echo "📝 Current Status: Using Drizzle by default"
echo "🔒 PocketBase: Currently disabled for initial development"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "drizzle.config.ts" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_status "Starting migration process..."
print_warning "This will enable PocketBase which is currently disabled"

# Step 1: Backup current database
print_status "Step 1: Creating database backup..."
if [ -f "local.db" ]; then
    cp local.db "local.db.backup.$(date +%Y%m%d_%H%M%S)"
    print_success "Database backed up successfully"
else
    print_warning "No local.db found, skipping backup"
fi

# Step 2: Install PocketBase
print_status "Step 2: Installing PocketBase..."
if ! command -v pocketbase &> /dev/null; then
    print_status "Downloading PocketBase..."
    
    # Detect OS and architecture
    OS=$(uname -s | tr '[:upper:]' '[:lower:]')
    ARCH=$(uname -m)
    
    if [ "$ARCH" = "x86_64" ]; then
        ARCH="amd64"
    elif [ "$ARCH" = "aarch64" ]; then
        ARCH="arm64"
    fi
    
    # Download PocketBase
    POCKETBASE_VERSION="0.22.18"
    DOWNLOAD_URL="https://github.com/pocketbase/pocketbase/releases/download/v${POCKETBASE_VERSION}/pocketbase_${POCKETBASE_VERSION}_${OS}_${ARCH}.zip"
    
    print_status "Downloading from: $DOWNLOAD_URL"
    curl -L "$DOWNLOAD_URL" -o pocketbase.zip
    
    # Extract and make executable
    unzip -o pocketbase.zip
    chmod +x pocketbase
    rm pocketbase.zip
    
    print_success "PocketBase installed successfully"
else
    print_success "PocketBase already installed"
fi

# Step 3: Create PocketBase configuration
print_status "Step 3: Setting up PocketBase configuration..."
mkdir -p pocketbase_data

# Create PocketBase config
cat > pocketbase_data/config.json << EOF
{
  "meta": {
    "adminEmail": "admin@balancebotanica.com",
    "adminPassword": "admin123456"
  },
  "logs": {
    "level": "info"
  },
  "server": {
    "httpAddr": "127.0.0.1:8090",
    "httpMaxBodySize": "10MB"
  }
}
EOF

print_success "PocketBase configuration created"

# Step 4: Update environment variables
print_status "Step 4: Updating environment variables..."
if [ ! -f ".env" ]; then
    print_status "Creating .env file..."
    cat > .env << EOF
# Database Configuration
DATABASE_URL=file:./local.db

# PocketBase Configuration
POCKETBASE_ENABLED=true
POCKETBASE_URL=http://127.0.0.1:8090

# Keep Drizzle for user authentication
DRIPPLE_ENABLED=true
EOF
    print_success ".env file created"
else
    print_status "Updating existing .env file..."
    if ! grep -q "POCKETBASE_ENABLED" .env; then
        echo "" >> .env
        echo "# PocketBase Configuration" >> .env
        echo "POCKETBASE_ENABLED=true" >> .env
        echo "POCKETBASE_URL=http://127.0.0.1:8090" >> .env
    fi
    print_success ".env file updated"
fi

# Step 5: Create PocketBase collections setup script
print_status "Step 5: Creating PocketBase collections setup..."
cat > scripts/setup-pocketbase-collections.js << 'EOF'
// PocketBase collections setup script
// Run this after starting PocketBase to create the required collections

const { pb } = require('../src/lib/server/pocketbase');

async function setupCollections() {
    try {
        console.log('Setting up PocketBase collections...');
        
        // Create products collection
        const productsCollection = await pb.collections.create({
            name: 'products',
            type: 'base',
            schema: [
                {
                    name: 'name',
                    type: 'text',
                    required: true,
                    options: { min: 1, max: 100 }
                },
                {
                    name: 'description',
                    type: 'text',
                    required: false,
                    options: { max: 1000 }
                },
                {
                    name: 'price',
                    type: 'number',
                    required: true,
                    options: { min: 0 }
                },
                {
                    name: 'stock',
                    type: 'number',
                    required: true,
                    options: { min: 0 }
                },
                {
                    name: 'category',
                    type: 'text',
                    required: true,
                    options: { max: 50 }
                },
                {
                    name: 'imageUrl',
                    type: 'url',
                    required: false
                }
            ]
        });
        
        console.log('✅ Products collection created');
        
        // Create categories collection
        const categoriesCollection = await pb.collections.create({
            name: 'categories',
            type: 'base',
            schema: [
                {
                    name: 'name',
                    type: 'text',
                    required: true,
                    options: { max: 50 }
                },
                {
                    name: 'description',
                    type: 'text',
                    required: false,
                    options: { max: 200 }
                }
            ]
        });
        
        console.log('✅ Categories collection created');
        
        console.log('\n🎉 PocketBase collections setup complete!');
        console.log('You can now access the admin panel at: http://127.0.0.1:8090/_/');
        console.log('Default admin credentials: admin@balancebotanica.com / admin123456');
        
    } catch (error) {
        console.error('Error setting up collections:', error);
    }
}

setupCollections();
EOF

print_success "PocketBase collections setup script created"

# Step 6: Create data migration script
print_status "Step 6: Creating data migration script..."
cat > scripts/migrate-data.js << 'EOF'
// Data migration script from Drizzle to PocketBase
// This script migrates existing product data

const { DrizzleProductRepository } = require('../src/lib/server/data/repositories/drizzle-product.repository');
const { PocketBaseProductRepository } = require('../src/lib/server/data/repositories/pocketbase-product.repository');

async function migrateData() {
    try {
        console.log('Starting data migration from Drizzle to PocketBase...');
        
        const drizzleRepo = new DrizzleProductRepository();
        const pocketbaseRepo = new PocketBaseProductRepository();
        
        // Get all products from Drizzle
        const products = await drizzleRepo.getAll();
        console.log(`Found ${products.length} products to migrate`);
        
        if (products.length === 0) {
            console.log('No products to migrate');
            return;
        }
        
        // Migrate each product
        let migrated = 0;
        let failed = 0;
        
        for (const product of products) {
            try {
                const createData = {
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    stock: product.stock,
                    category: product.category,
                    imageUrl: product.imageUrl
                };
                
                await pocketbaseRepo.create(createData);
                migrated++;
                console.log(`✅ Migrated: ${product.name}`);
                
            } catch (error) {
                failed++;
                console.error(`❌ Failed to migrate ${product.name}:`, error.message);
            }
        }
        
        console.log(`\n🎉 Migration complete!`);
        console.log(`✅ Successfully migrated: ${migrated} products`);
        if (failed > 0) {
            console.log(`❌ Failed to migrate: ${failed} products`);
        }
        
    } catch (error) {
        console.error('Migration failed:', error);
    }
}

migrateData();
EOF

print_success "Data migration script created"

# Step 7: Create startup script
print_status "Step 7: Creating PocketBase startup script..."
cat > scripts/start-pocketbase.sh << 'EOF'
#!/bin/bash

# Start PocketBase server
echo "🚀 Starting PocketBase server..."

# Check if PocketBase is running
if pgrep -f "pocketbase serve" > /dev/null; then
    echo "PocketBase is already running"
    echo "Admin panel: http://127.0.0.1:8090/_/"
    exit 0
fi

# Start PocketBase
./pocketbase serve --http="127.0.0.1:8090" --dir="./pocketbase_data" &

# Wait a moment for server to start
sleep 3

# Check if server started successfully
if curl -s http://127.0.0.1:8090/api/health > /dev/null; then
    echo "✅ PocketBase started successfully!"
    echo "🌐 Admin panel: http://127.0.0.1:8090/_/"
    echo "🔑 Default credentials: admin@balancebotanica.com / admin123456"
    echo ""
    echo "📝 Next steps:"
    echo "1. Open admin panel and change default password"
    echo "2. Run: node scripts/setup-pocketbase-collections.js"
    echo "3. Run: node scripts/migrate-data.js (if you have existing data)"
    echo ""
    echo "Press Ctrl+C to stop PocketBase"
    
    # Wait for user to stop
    wait
else
    echo "❌ Failed to start PocketBase"
    exit 1
fi
EOF

chmod +x scripts/start-pocketbase.sh
print_success "PocketBase startup script created"

# Step 8: Update package.json scripts
print_status "Step 8: Updating package.json scripts..."
if ! grep -q "pocketbase:start" package.json; then
    # Add new scripts to package.json
    sed -i.bak '/"scripts": {/a\
        "pocketbase:start": "./scripts/start-pocketbase.sh",\
        "pocketbase:setup": "node scripts/setup-pocketbase-collections.js",\
        "pocketbase:migrate": "node scripts/migrate-data.js",\
        "migrate:to-pocketbase": "bash scripts/migrate-to-pocketbase.sh",' package.json
    
    print_success "Package.json scripts updated"
else
    print_success "Package.json scripts already exist"
fi

# Step 9: Create README for migration
print_status "Step 9: Creating migration documentation..."
cat > MIGRATION_README.md << 'EOF'
# Migration to PocketBase - Balance Botanica

This document explains how to migrate from Drizzle ORM to PocketBase for product management.

## Current Status

- ✅ **Drizzle**: Currently active and working for products and users
- 🔒 **PocketBase**: Currently disabled for initial development
- 🚀 **Ready**: Migration scripts are prepared for when you're ready

## What This Migration Does

- ✅ Keeps Drizzle for user authentication (secure, working)
- ✅ Adds PocketBase for product management (easy admin interface)
- ✅ Creates clean architecture with two data sources
- ✅ Provides easy switching between data sources

## Migration Steps

### 1. Run Migration Script
```bash
bash scripts/migrate-to-pocketbase.sh
```

### 2. Start PocketBase
```bash
npm run pocketbase:start
```

### 3. Setup Collections
```bash
npm run pocketbase:setup
```

### 4. Migrate Existing Data (if any)
```bash
npm run pocketbase:migrate
```

## Architecture After Migration

```
src/lib/server/
├── domain/                    # Business logic interfaces
│   └── interfaces/
│       └── product.interface.ts
├── data/                     # Data access layer
│   ├── repositories/         # Repository implementations
│   │   ├── drizzle-product.repository.ts
│   │   └── pocketbase-product.repository.ts
│   └── factories/           # Factory for choosing data source
│       └── product-repository.factory.ts
├── application/              # Application services
│   └── services/
│       └── product.service.ts
├── db/                      # Drizzle (users, sessions)
│   ├── schema.ts
│   └── index.ts
└── pocketbase/              # PocketBase client
    ├── index.ts
    └── products.ts
```

## Environment Variables

```env
# Database Configuration
DATABASE_URL=file:./local.db

# PocketBase Configuration
POCKETBASE_ENABLED=true
POCKETBASE_URL=http://127.0.0.1:8090

# Keep Drizzle for user authentication
DRIPPLE_ENABLED=true
```

## Switching Data Sources

### In Code
```typescript
import { ProductRepositoryFactory } from '$lib/server/data/factories/product-repository.factory';
import { ProductService } from '$lib/server/application/services/product.service';

// Use Drizzle
const drizzleRepo = ProductRepositoryFactory.create('drizzle');
const drizzleService = new ProductService(drizzleRepo);

// Use PocketBase
const pocketbaseRepo = ProductRepositoryFactory.create('pocketbase');
const pocketbaseService = new ProductService(pocketbaseRepo);

// Use from config
const configRepo = ProductRepositoryFactory.createFromConfig();
const configService = new ProductService(configRepo);
```

### Via Environment Variable
Set `POCKETBASE_ENABLED=true` in `.env` to use PocketBase, or `false` to use Drizzle.

## Benefits of This Approach

1. **Easy Development**: Use Drizzle for quick development
2. **Easy Management**: Use PocketBase admin interface for products
3. **Flexible**: Switch between data sources easily
4. **Clean Architecture**: Proper separation of concerns
5. **No Lock-in**: Can use either or both approaches

## Rollback

To rollback to Drizzle-only:
1. Set `POCKETBASE_ENABLED=false` in `.env`
2. Restart your application

## Support

- PocketBase Admin: http://127.0.0.1:8090/_/
- Drizzle Studio: `npm run db:studio`
- Migration Scripts: `scripts/` directory
EOF

print_success "Migration documentation created"

# Final summary
echo ""
echo "🎉 Migration setup complete!"
echo "============================"
echo ""
echo "📁 Created files:"
echo "  - scripts/start-pocketbase.sh"
echo "  - scripts/setup-pocketbase-collections.js"
echo "  - scripts/migrate-data.js"
echo "  - MIGRATION_README.md"
echo ""
echo "🚀 Next steps:"
echo "1. Start PocketBase: npm run pocketbase:start"
echo "2. Setup collections: npm run pocketbase:setup"
echo "3. Migrate data (if any): npm run pocketbase:migrate"
echo ""
echo "📚 Read MIGRATION_README.md for detailed instructions"
echo ""
echo "💡 Your project now supports both Drizzle and PocketBase!"
echo "   Set POCKETBASE_ENABLED=true in .env to use PocketBase for products"
echo "   Keep Drizzle for user authentication (recommended)"
echo ""
echo "⚠️  IMPORTANT: PocketBase is currently DISABLED in the code"
echo "   Run this migration script when you're ready to enable it"
echo ""
print_success "Migration setup completed successfully!"
