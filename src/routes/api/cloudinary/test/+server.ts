import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { testCloudinaryConnection } from '$lib/server/cloudinary/config.js';

export const GET: RequestHandler = async () => {
	try {
		const result = await testCloudinaryConnection();
		return json(result);
	} catch (error) {
		console.error('Cloudinary test endpoint error:', error);
		return json(
			{
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error'
			},
			{ status: 500 }
		);
	}
};
