import { cloudinary } from './config.js';
import { getAuthenticatedClient } from '../pocketbase/index.js';

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
export async function addImageToProduct(productId: string, imageUrl: string): Promise<boolean> {
	try {
		const pb = await getAuthenticatedClient();

		// Get the current product
		const product = await pb.collection('products').getOne(productId);
		if (!product) return false;

		const currentUrls = parseImageUrls(product.image_urls);
		const updatedUrls = [...currentUrls, imageUrl];

		// Update the product with the new image URLs
		await pb.collection('products').update(productId, {
			image_urls: stringifyImageUrls(updatedUrls)
		});

		return true;
	} catch (error) {
		console.error('Error adding image to product:', error);
		return false;
	}
}

/**
 * Delete image by index from product's imageUrls array
 */
export async function deleteImageByIndex(productId: string, index: number): Promise<boolean> {
	try {
		const pb = await getAuthenticatedClient();

		// Get the current product
		const product = await pb.collection('products').getOne(productId);
		if (!product) return false;

		const currentUrls = parseImageUrls(product.image_urls);
		if (index < 0 || index >= currentUrls.length) return false;

		// Remove image at specified index
		const updatedUrls = currentUrls.filter((_, i) => i !== index);

		// Update the product with the new image URLs
		await pb.collection('products').update(productId, {
			image_urls: stringifyImageUrls(updatedUrls)
		});

		return true;
	} catch (error) {
		console.error('Error deleting image by index:', error);
		return false;
	}
}

/**
 * Delete image by URL from product's imageUrls array
 */
export async function deleteImageByUrl(productId: string, imageUrl: string): Promise<boolean> {
	try {
		const pb = await getAuthenticatedClient();

		// Get the current product
		const product = await pb.collection('products').getOne(productId);
		if (!product) return false;

		const currentUrls = parseImageUrls(product.image_urls);
		const updatedUrls = currentUrls.filter((url) => url !== imageUrl);

		if (updatedUrls.length === currentUrls.length) return false; // URL not found

		// Update the product with the new image URLs
		await pb.collection('products').update(productId, {
			image_urls: stringifyImageUrls(updatedUrls)
		});

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
