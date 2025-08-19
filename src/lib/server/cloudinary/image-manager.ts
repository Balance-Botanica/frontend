import { cloudinary } from './config.js';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { products } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export interface ImageInfo {
	url: string;
	publicId: string;
	index: number;
}

/**
 * Parse imageUrls JSON string to array
 */
export function parseImageUrls(imageUrlsJson: string | null): string[] {
	if (!imageUrlsJson) return [];
	try {
		return JSON.parse(imageUrlsJson);
	} catch {
		return [];
	}
}

/**
 * Convert imageUrls array to JSON string
 */
export function stringifyImageUrls(imageUrls: string[]): string {
	return JSON.stringify(imageUrls);
}

/**
 * Add new image URL to product's imageUrls array
 */
export async function addImageToProduct(
	db: any,
	productId: string,
	imageUrl: string
): Promise<boolean> {
	try {
		const product = await db.select().from(products).where(eq(products.id, productId)).get();
		if (!product) return false;

		const currentUrls = parseImageUrls(product.imageUrls);
		const updatedUrls = [...currentUrls, imageUrl];

		await db
			.update(products)
			.set({ imageUrls: stringifyImageUrls(updatedUrls) })
			.where(eq(products.id, productId));

		return true;
	} catch (error) {
		console.error('Error adding image to product:', error);
		return false;
	}
}

/**
 * Delete image by index from product's imageUrls array
 */
export async function deleteImageByIndex(
	db: any,
	productId: string,
	index: number
): Promise<boolean> {
	try {
		const product = await db.select().from(products).where(eq(products.id, productId)).get();
		if (!product) return false;

		const currentUrls = parseImageUrls(product.imageUrls);
		if (index < 0 || index >= currentUrls.length) return false;

		// Remove image at specified index
		const updatedUrls = currentUrls.filter((_, i) => i !== index);

		await db
			.update(products)
			.set({ imageUrls: stringifyImageUrls(updatedUrls) })
			.where(eq(products.id, productId));

		return true;
	} catch (error) {
		console.error('Error deleting image by index:', error);
		return false;
	}
}

/**
 * Delete image by URL from product's imageUrls array
 */
export async function deleteImageByUrl(
	db: any,
	productId: string,
	imageUrl: string
): Promise<boolean> {
	try {
		const product = await db.select().from(products).where(eq(products.id, productId)).get();
		if (!product) return false;

		const currentUrls = parseImageUrls(product.imageUrls);
		const updatedUrls = currentUrls.filter((url) => url !== imageUrl);

		if (updatedUrls.length === currentUrls.length) return false; // URL not found

		await db
			.update(products)
			.set({ imageUrls: stringifyImageUrls(updatedUrls) })
			.where(eq(products.id, productId));

		return true;
	} catch (error) {
		console.error('Error deleting image by URL:', error);
		return false;
	}
}

/**
 * Get all images for a product with their indices
 */
export function getProductImages(imageUrlsJson: string | null): ImageInfo[] {
	const urls = parseImageUrls(imageUrlsJson);
	return urls.map((url, index) => ({
		url,
		publicId: extractPublicIdFromUrl(url),
		index
	}));
}

/**
 * Extract public ID from Cloudinary URL
 */
function extractPublicIdFromUrl(url: string): string {
	try {
		const urlParts = url.split('/');
		const uploadIndex = urlParts.findIndex((part) => part === 'upload');
		if (uploadIndex !== -1 && uploadIndex + 2 < urlParts.length) {
			return urlParts[uploadIndex + 2].split('.')[0];
		}
		return '';
	} catch {
		return '';
	}
}
