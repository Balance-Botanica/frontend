export const load = async () => {
	console.log('=== Environment Variables Debug ===');
	console.log('POCKETBASE_ENABLED:', process.env.POCKETBASE_ENABLED);
	console.log('POCKETBASE_URL:', process.env.POCKETBASE_URL);
	console.log('DATABASE_URL:', process.env.DATABASE_URL);
	console.log('===================================');

	return {
		pocketbaseEnabled: process.env.POCKETBASE_ENABLED,
		pocketbaseUrl: process.env.POCKETBASE_URL,
		databaseUrl: process.env.DATABASE_URL
	};
};
