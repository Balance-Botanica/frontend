// Point all paste SKUs at the branded jar placeholder until the real photoshoot.
// Usage: node scripts/paste-jar-images.cjs   (run from balance_botanica/)
require('dotenv').config();
const PocketBase = require('pocketbase').default;

const URL = process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';
const EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;
if (!PASSWORD) throw new Error('POCKETBASE_ADMIN_PASSWORD is not set (see .env)');

const IMG = '/images/paste-jar-placeholder.svg';

(async () => {
	const pb = new PocketBase(URL);
	await pb.collection('_superusers').authWithPassword(EMAIL, PASSWORD);
	const products = await pb.collection('products').getFullList();
	for (const p of products) {
		await pb.collection('products').update(p.id, { image_urls: [IMG] });
		console.log(`✅ ${p.name}`);
	}
	console.log('🎉 images updated');
	process.exit(0);
})().catch((e) => {
	console.error('❌ failed:', e.message);
	process.exit(1);
});
