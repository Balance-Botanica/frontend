# Balance Botanica - CBD Products E-commerce

A modern e-commerce website for CBD products, built with SvelteKit using Drizzle ORM and SQLite.

## 🚀 Technologies

- **Frontend**: SvelteKit + TypeScript + Tailwind CSS
- **Backend**: SvelteKit Server-Side Rendering
- **Database**: SQLite + Drizzle ORM
- **Image Hosting**: Cloudinary
- **Internationalization**: i18next

## 📁 Project Structure

```
src/
├── lib/
│   ├── components/           # Svelte components
│   │   ├── ProductCard.svelte      # Product card with slider
│   │   ├── ProductsSection.svelte  # Product section with navigation
│   │   └── ...
│   ├── server/              # Server-side code
│   │   ├── db/              # Database
│   │   │   ├── schema.ts    # Drizzle schema
│   │   │   └── index.ts     # DB connection
│   │   ├── data/            # Data layer
│   │   │   ├── repositories/ # Repositories
│   │   │   └── mappers/     # Mappers
│   │   ├── domain/          # Domain layer
│   │   │   └── interfaces/  # Interfaces
│   │   └── products/        # Product service
│   └── i18n/                # Internationalization
├── routes/                   # SvelteKit routes
│   ├── +page.svelte         # Home page
│   ├── +page.server.ts      # Server-side home loading
│   ├── products/            # Products page
│   └── ...
└── drizzle/                  # Drizzle migrations and database
    ├── database.sqlite      # SQLite database
    └── migrations/          # Migrations
```

## 🚀 Quick Start

### Install Dependencies
```sh
npm install
```

### Development Mode
```sh
npm run dev

# or with automatic browser opening
npm run dev -- --open
```

### Production Build
```sh
npm run build
npm run preview
```

## 🐛 Debugging and Logging

### Product Logging
All components have detailed logging for debugging:

- **`+page.server.ts`** - Product loading logs from server
- **`ProductsSection.svelte`** - Product slider and navigation logs
- **`ProductCard.svelte`** - Image parsing and slider logs

### Database Inspection
```sh
# Check database content
sqlite3 drizzle/database.sqlite "SELECT COUNT(*) as count FROM products;"
sqlite3 drizzle/database.sqlite "SELECT name, size, flavor FROM products LIMIT 3;"
```

### Common Issues and Solutions

#### Products Not Loading
1. Check database connection in `src/lib/server/db/index.ts`
2. Ensure schema matches the actual database
3. Check server logs in terminal

#### Slider Not Working
1. Ensure `imageUrls` contains JSON array with multiple URLs
2. Check that `imageUrls.length > 1` in `ProductCard.svelte`
3. Check browser console for JSON parsing errors



## 🗄️ Database and Product Fetching

### Database Structure
```sql
CREATE TABLE products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    size TEXT NOT NULL,           -- Product size (30ml, 50ml, 100ml)
    flavor TEXT NOT NULL,         -- Product flavor (natural, lavender, berry)
    price INTEGER NOT NULL,       -- Price in kopecks (2500 = 25.00 UAH)
    stock INTEGER NOT NULL,       -- Stock quantity
    categories TEXT NOT NULL,     -- JSON array of categories ["CBD", "Oil", "Premium"]
    image_urls TEXT NOT NULL,     -- JSON array of Cloudinary image URLs
    created_at INTEGER NOT NULL,  -- Unix timestamp of creation
    updated_at INTEGER NOT NULL   -- Unix timestamp of update
);
```

### Product Fetching Architecture

#### 1. **Data Layer**
- **`src/lib/server/pocketbase/index.ts`** - PocketBase client configuration
- **`src/lib/server/data/repositories/pocketbase-product.repository.ts`** - Repository implementation
- **`src/lib/server/data/mappers/product.mapper.ts`** - Mapping between DTO and domain model

#### 2. **Domain Layer**
- **`src/lib/server/domain/interfaces/product.interface.ts`** - Product and repository interfaces

#### 3. **Service Layer**
- **`src/lib/server/products/index.ts`** - Repository factory and ProductService

#### 4. **Presentation Layer**
- **`src/routes/+page.server.ts`** - Server-side data loading for home page
- **`src/routes/products/+page.server.ts`** - Server-side data loading for products page
- **`src/lib/components/ProductsSection.svelte`** - Product section display component
- **`src/lib/components/ProductCard.svelte`** - Product card component with slider

### Data Flow
```
PocketBase Database → PocketBase Client → Repository → Service → Page Server → Component → UI
```

### Implementation Features

#### **Image Slider**
- Automatically shown for products with `imageUrls.length > 1`
- Supports arrow navigation, touch swipe, keyboard navigation
- Automatic switching every 5 seconds
- Current image indicators

#### **Responsive Grid**
- Adaptive grid: 1-3 products per row depending on screen size
- Arrow navigation for product scrolling
- Touch support for mobile devices

#### **Data Parsing**
- `imageUrls` parsed as JSON array
- `categories` parsed as JSON array
- Fallback to `/images/animal1.jpg` if images fail to load

### Current Database State

The PocketBase database contains **7 products**:

- **4 products** with 1 image (no slider)
- **3 products** with multiple images (with slider):
  - Premium CBD Oil: 3 images
  - CBD Gummies: 2 images  
  - CBD Cream: 3 images

All products have correct Cloudinary URLs and properly structured data.

### Usage Examples

#### Loading products on home page
```typescript
// src/routes/+page.server.ts
export const load: PageServerLoad = async () => {
    const productService = new ProductService(ProductRepositoryFactory.create('pocketbase'));
    const products = await productService.getAllProducts();
    return { products };
};
```

#### Component display
```svelte
<!-- src/lib/components/ProductsSection.svelte -->
<script>
    export let products: UiProduct[] = [];
    export let limit: number | null | undefined = null;
</script>

{#each displayProducts as product (product.id)}
    <ProductCard {product} />
{/each}
```

## 🚚 Nova Poshta API Configuration

The application uses the Nova Poshta API for delivery address selection. Nova Poshta is the only available delivery option for this e-commerce platform.

To configure:

1. Set the `NOVA_POSHTA_API_URL` environment variable (defaults to `https://api.novaposhta.ua/v2.0/json/`)
2. Set the `NOVA_POSHTA_API_KEY` environment variable with your Nova Poshta API key

Example `.env` configuration:
``env
NOVA_POSHTA_API_URL=https://api.novaposhta.ua/v2.0/json/
NOVA_POSHTA_API_KEY=your_api_key_here
```

## 🏗️ Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
