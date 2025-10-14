import { dev } from '$app/environment';

export const load = async () => {
	console.log('=== Environment Variables Debug ===');
	console.log('process.env.NODE_ENV:', process.env.NODE_ENV);
	console.log('process.env.POCKETBASE_ENABLED:', process.env.POCKETBASE_ENABLED);
	console.log('process.env.POCKETBASE_URL:', process.env.POCKETBASE_URL);
	console.log('process.env.DATABASE_URL:', process.env.DATABASE_URL);
	console.log('dev:', dev);
	console.log('===================================');

	// Also try to load dotenv manually
	try {
		const dotenv = await import('dotenv');
		console.log('Dotenv imported successfully');
	} catch (error) {
		console.log('Dotenv import error:', error.message);
	}

	return {
		nodeEnv: process.env.NODE_ENV,
		pocketbaseEnabled: process.env.POCKETBASE_ENABLED,
		pocketbaseUrl: process.env.POCKETBASE_URL,
		databaseUrl: process.env.DATABASE_URL,
		dev
	};
};
