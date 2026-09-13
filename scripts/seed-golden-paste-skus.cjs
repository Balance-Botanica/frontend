// Seed Balance Botanica golden paste jars: 1 recipe (~60mg 95% extract per 5g) x 4 gram sizes.
// Grams-only naming (no TRIAL/WEEK/HALF/MONTH), dosing in jar shares (no spoons).
// Usage: node scripts/seed-golden-paste-skus.cjs   (run from balance_botanica/)
require('dotenv').config();
const PocketBase = require('pocketbase').default;

const URL = process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';
const EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;
if (!PASSWORD) throw new Error('POCKETBASE_ADMIN_PASSWORD is not set (see .env)');

// Temporary packshot until real jar photoshoot (existing Cloudinary image)
const PLACEHOLDER_IMG =
	'https://res.cloudinary.com/dtp21hkrc/image/upload/v1755626661/balance-botanica/products/product-1755626659715-hqv5rg1g4.jpg';

const BASE_DESC =
	'Золота паста для собак: куркума + стандартизований екстракт куркуміну 95% (~60 мг на 5 г пасти), кокосова олія, імбир, чорний перець, соняшниковий лецитин. ';
const FEEDING =
	'Добова порція — частка банки: до 10 кг — 1/6–1/3 банки 30 г · 10–25 кг — 1/2 банки 30 г (або 1/6 банки 100 г) · 25+ кг — 1/3 банки 100 г (або 1/8 банки 250 г). Давати з їжею, почати з половини порції на 7–10 днів, ефект оцінювати через 4–8 тижнів. Зберігати в холодильнику за етикеткою. ';
const DISCLAIMER =
	'Доповнюючий корм. Не є ветеринарним лікарським засобом і не замінює призначені НПЗЗ. Без ксилітолу, цибулі, винограду, шоколаду.';

const SKUS = [
	{
		name: 'Balance Botanica Золота паста 30 г',
		size: '30 g',
		price: 12900,
		stock: 100,
		flavor: 'turmeric-ginger',
		categories: ['curcumin', 'paste', 'dogs'],
		description: BASE_DESC + 'Пробна банка: перевірити смак і шлунок. ' + FEEDING + DISCLAIMER
	},
	{
		name: 'Balance Botanica Золота паста 100 г',
		size: '100 g',
		price: 24900,
		stock: 100,
		flavor: 'turmeric-ginger',
		categories: ['curcumin', 'paste', 'dogs'],
		description: BASE_DESC + 'Банка на перші тижні. ' + FEEDING + DISCLAIMER
	},
	{
		name: 'Balance Botanica Золота паста 250 г',
		size: '250 g',
		price: 45900,
		stock: 100,
		flavor: 'turmeric-ginger',
		categories: ['curcumin', 'paste', 'dogs'],
		description:
			BASE_DESC + 'Банка на половину курсу оцінки. Оптимально для першого ефекту. ' + FEEDING + DISCLAIMER
	},
	{
		name: 'Balance Botanica Золота паста 500 г',
		size: '500 g',
		price: 84900,
		stock: 100,
		flavor: 'turmeric-ginger',
		categories: ['curcumin', 'paste', 'dogs', 'subscription'],
		description:
			BASE_DESC + 'Велика банка на курс + підписка на refill. ' + FEEDING + DISCLAIMER
	}
];

(async () => {
	const pb = new PocketBase(URL);
	await pb.collection('_superusers').authWithPassword(EMAIL, PASSWORD);
	console.log('✅ superuser auth OK');

	const existing = await pb.collection('products').getFullList();
	console.log(`Found ${existing.length} old products, deleting...`);
	for (const p of existing) {
		await pb.collection('products').delete(p.id);
	}
	console.log('🗑️  old catalog cleared');

	for (const sku of SKUS) {
		try {
			const now = new Date().toISOString().replace('T', ' ').substring(0, 19) + '.000Z';
			const rec = await pb.collection('products').create({
				name: sku.name,
				description: sku.description,
				price: sku.price,
				stock: sku.stock,
				size: sku.size,
				flavor: sku.flavor,
				categories: sku.categories,
				image_urls: [PLACEHOLDER_IMG],
				created: now,
				updated: now
			});
			console.log(`✅ ${rec.name} (${rec.size}, ${rec.price / 100} UAH)`);
		} catch (e) {
			console.log(`❌ ${sku.name}:`, JSON.stringify(e?.response ?? e?.message ?? e, null, 1).slice(0, 800));
			throw e;
		}
	}
	console.log('🎉 4 paste SKUs seeded');
	process.exit(0);
})().catch((e) => {
	console.error('❌ seed failed:', e.message);
	process.exit(1);
});
