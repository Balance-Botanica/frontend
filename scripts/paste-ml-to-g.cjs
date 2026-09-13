// One-off: paste is weighed, not poured — rename ml sizes/names to grams (keeps IDs/URLs).
// Usage: node scripts/paste-ml-to-g.cjs   (run from balance_botanica/)
require('dotenv').config();
const PocketBase = require('pocketbase').default;

const URL = process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';
const EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;
if (!PASSWORD) throw new Error('POCKETBASE_ADMIN_PASSWORD is not set (see .env)');

(async () => {
	const pb = new PocketBase(URL);
	await pb.collection('_superusers').authWithPassword(EMAIL, PASSWORD);
	const products = await pb.collection('products').getFullList();
	for (const p of products) {
		const size = (p.size || '').replace(/ml/i, 'g');
		const name = (p.name || '').replace(/мл/i, 'г');
		if (size !== p.size || name !== p.name) {
			await pb.collection('products').update(p.id, { size, name });
			console.log(`✅ ${p.id}: "${p.size}" -> "${size}"`);
		} else {
			console.log(`-- ${p.id}: already grams`);
		}
	}
	console.log('🎉 done');
	process.exit(0);
})().catch((e) => {
	console.error('❌ failed:', e.message);
	process.exit(1);
});
