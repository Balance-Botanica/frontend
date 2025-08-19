import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { uploadImage } from '$lib/server/cloudinary/config.js';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const formData = await request.formData();
		const imageFile = formData.get('image') as File;

		if (!imageFile) {
			return json(
				{
					success: false,
					error: 'No image file provided'
				},
				{ status: 400 }
			);
		}

		// Convert File to Buffer
		const arrayBuffer = await imageFile.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		// Upload to Cloudinary
		const result = await uploadImage(buffer, {
			folder: 'balance-botanica/test',
			public_id: `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
		});

		return json(result);
	} catch (error) {
		console.error('Cloudinary upload endpoint error:', error);
		return json(
			{
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error'
			},
			{ status: 500 }
		);
	}
};
