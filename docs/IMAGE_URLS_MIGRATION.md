# Image URLs Migration Guide

This guide explains how to migrate from single `imageUrl` to multiple `imageUrls` array for products.

## Overview

- **Before**: Products had one `imageUrl` field
- **After**: Products have `imageUrls` array field + legacy `imageUrl` for backward compatibility
- **Storage**: `imageUrls` stored as JSON string in SQLite (array in PostgreSQL)

## Migration Steps

### 1. Run the Migration Script

```bash
npm run db:migrate-images
```

This script will:
- Add `image_urls` column to products table
- Migrate existing `imageUrl` data to `imageUrls` array
- Create index for performance
- Preserve backward compatibility

### 2. Update Your Code

#### Product Creation
```typescript
// Old way
imageUrl: 'https://example.com/image.jpg'

// New way
imageUrls: stringifyImageUrls(['https://example.com/image1.jpg', 'https://example.com/image2.jpg'])
```

#### Product Display
```typescript
// Old way
<img src={product.imageUrl} alt={product.name} />

// New way
{parseImageUrls(product.imageUrls).map((url, index) => (
  <img key={index} src={url} alt={`${product.name} - Image ${index + 1}`} />
))}
```

#### Image Management
```typescript
import { 
  addImageToProduct, 
  deleteImageByIndex, 
  deleteImageByUrl,
  getProductImages 
} from '$lib/server/cloudinary/image-manager.js';

// Add new image
await addImageToProduct(db, productId, newImageUrl);

// Delete by index (recommended)
await deleteImageByIndex(db, productId, 2);

// Delete by URL
await deleteImageByUrl(db, productId, imageUrl);

// Get all images with metadata
const images = getProductImages(product.imageUrls);
```

## Database Schema

### SQLite (Current)
```sql
ALTER TABLE products ADD COLUMN image_urls TEXT DEFAULT '[]';
CREATE INDEX idx_products_image_urls ON products(image_urls);
```

### PostgreSQL (Future)
```sql
ALTER TABLE products ADD COLUMN imageUrls TEXT[] DEFAULT '{}';
CREATE INDEX idx_products_image_urls ON products USING GIN (imageUrls);
```

## Utility Functions

### `parseImageUrls(imageUrlsJson: string | null): string[]`
Converts JSON string to array, handles null/empty cases.

### `stringifyImageUrls(imageUrls: string[]): string`
Converts array to JSON string for storage.

### `addImageToProduct(db, productId, imageUrl)`
Adds new image URL to product's imageUrls array.

### `deleteImageByIndex(db, productId, index)`
Deletes image at specific index (recommended method).

### `deleteImageByUrl(db, productId, imageUrl)`
Deletes image by URL matching.

### `getProductImages(imageUrlsJson)`
Returns array of `ImageInfo` objects with URL, publicId, and index.

## Best Practices

1. **Use Index-Based Deletion**: More reliable than URL matching
2. **Validate URLs**: Ensure Cloudinary URLs are valid before storing
3. **Handle Empty Arrays**: Always check if `imageUrls` is empty before processing
4. **Backward Compatibility**: Keep `imageUrl` field for existing integrations
5. **Error Handling**: Wrap image operations in try-catch blocks

## Example Usage

```typescript
// Product with multiple images
const product = {
  id: '123',
  name: 'CBD Oil',
  imageUrls: '["https://res.cloudinary.com/.../image1.jpg", "https://res.cloudinary.com/.../image2.jpg"]'
};

// Parse and display
const images = parseImageUrls(product.imageUrls);
images.forEach((url, index) => {
  console.log(`Image ${index}: ${url}`);
});

// Add new image
await addImageToProduct(db, product.id, newImageUrl);

// Delete first image
await deleteImageByIndex(db, product.id, 0);
```

## Troubleshooting

### Migration Fails
- Check database permissions
- Ensure products table exists
- Verify SQLite version supports ALTER TABLE

### Images Not Displaying
- Check JSON parsing in `parseImageUrls`
- Verify `imageUrls` field is not null
- Ensure URLs are valid Cloudinary URLs

### Performance Issues
- Ensure index is created: `CREATE INDEX idx_products_image_urls ON products(image_urls)`
- Consider pagination for products with many images
- Use lazy loading for image galleries
