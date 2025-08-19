import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { db } from '$lib/server/db/index.js';
import { products } from '$lib/server/db/schema.js';
import { uploadImage } from '$lib/server/cloudinary/config.js';
import { stringifyImageUrls } from '$lib/server/cloudinary/image-manager.js';

export const actions: Actions = {
	addProduct: async ({ request, locals }) => {
		try {
			const formData = await request.formData();
			const name = formData.get('name') as string;
			const description = formData.get('description') as string;
			const price = parseFloat(formData.get('price') as string);
			const stock = parseInt(formData.get('stock') as string);
			const category = formData.get('category') as string;
			const imageFile = formData.get('image') as File;

			// Validate required fields
			if (!name || !price || !stock || !category) {
				return fail(400, {
					message: 'Please fill in all required fields'
				});
			}

			// Handle image upload if provided
			let imageUrls = [];
			if (imageFile && imageFile.size > 0) {
				try {
					// Convert File to Buffer
					const arrayBuffer = await imageFile.arrayBuffer();
					const buffer = Buffer.from(arrayBuffer);

					// Upload to Cloudinary
					const uploadResult = await uploadImage(buffer, {
						folder: 'balance-botanica/products',
						public_id: `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
					});

					if (uploadResult.success) {
						imageUrls = [uploadResult.url];
					} else {
						return fail(400, {
							message: `Image upload failed: ${uploadResult.error}`
						});
					}
				} catch (error) {
					console.error('Image upload error:', error);
					return fail(400, {
						message: 'Failed to upload image. Please try again.'
					});
				}
			}

			// Create product in database
			const newProduct = await db
				.insert(products)
				.values({
					id: crypto.randomUUID(),
					name,
					description: description || null,
					price: Math.round(price * 100), // Convert UAH to kopiyky (1 UAH = 100 kopiyky)
					stock,
					category,
					imageUrl: imageUrls.length > 0 ? imageUrls[0] : null, // Legacy field
					imageUrls: stringifyImageUrls(imageUrls) // New array field
				})
				.returning();

			console.log('Product created:', newProduct[0]);

			// Redirect to products page
			throw redirect(303, '/demo/products');
		} catch (error) {
			console.error('Error adding product:', error);

			if (error instanceof Response) {
				throw error; // Re-throw redirects
			}

			return fail(500, {
				message: 'Failed to add product. Please try again.'
			});
		}
	}
};
