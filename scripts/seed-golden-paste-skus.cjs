// Seed Balance Botanica golden paste jars: 1 recipe (~60mg 95% extract/tsp) x 4 volumes.
// Replaces the cubes catalog (0 orders reference it).
// Usage: node -r dotenv/config scripts/seed-golden-paste-skus.cjs   (run from balance_botanica/)
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
	'Золота паста для собак: куркума + стандартизований екстракт куркуміну 95% (~60 мг на чайну ложку), кокосова олія, імбир, чорний перець, соняшниковий лецитин. ';
const FEEDING =
	'Як давати з їжею: до 10 кг — 1/4–1/2 ч.л./день, 10–25 кг — 1/2–1 ч.л./день, 25+ кг — 1–2 ч.л./день. Почати з половини дози 7–10 днів, ефект оцінювати через 4–8 тижнів. Зберігати в холодильнику за етикеткою. ';
const DISCLAIMER =
	'Доповнюючий корм. Не є ветеринарним лікарським засобом і не замінює призначені НПЗЗ. Без ксилітолу, цибулі, винограду, шоколаду.';

const SKUS = [
	{
		name: 'Balance Botanica Золота паста TRIAL · 30 г',
		size: '30 g',
		price: 12900,
		stock: 100,
		flavor: 'turmeric-ginger',
		categories: ['curcumin', 'paste', 'trial', 'dogs'],
		description: BASE_DESC + 'Пробна банка (~6 ч.л.): перевірити смак і шлунок. ' + FEEDING + DISCLAIMER
	},
	{
		name: 'Balance Botanica Золота паста WEEK · 100 г',
		size: '100 g',
		price: 24900,
		stock: 100,
		flavor: 'turmeric-ginger',
		categories: ['curcumin', 'paste', 'week', 'dogs'],
		description: BASE_DESC + 'Банка на перші тижні (~20 ч.л.). ' + FEEDING + DISCLAIMER
	},
	{
		name: 'Balance Botanica Золота паста HALF · 250 г',
		size: '250 g',
		price: 45900,
		stock: 100,
		flavor: 'turmeric-ginger',
		categories: ['curcumin', 'paste', 'halfmonth', 'dogs'],
		description:
			BASE_DESC + 'Банка на половину курсу оцінки (~50 ч.л.). Оптимально для першого ефекту. ' + FEEDING + DISCLAIMER
	},
	{
		name: 'Balance Botanica Золота паста MONTH · 500 г',
		size: '500 g',
		price: 84900,
		stock: 100,
		flavor: 'turmeric-ginger',
		categories: ['curcumin', 'paste', 'month', 'dogs', 'subscription'],
		description:
			BASE_DESC + 'Велика банка на місяць (~100 ч.л.) + підписка на refill. ' + FEEDING + DISCLAIMER
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
