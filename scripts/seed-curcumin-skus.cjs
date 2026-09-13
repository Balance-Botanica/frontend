// Seed Balance Botanica curcumin cubes: 1 formula (60mg 95% extract/cube) x 4 pack sizes.
// Replaces the old duplicated CBD catalog (0 orders reference it).
// Usage: node -r dotenv/config scripts/seed-curcumin-skus.cjs   (run from balance_botanica/)
require('dotenv').config();
const PocketBase = require('pocketbase').default;

const URL = process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';
const EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;
if (!PASSWORD) throw new Error('POCKETBASE_ADMIN_PASSWORD is not set (see .env)');

// Temporary packshot until real S/M/L photoshoot (existing Cloudinary image)
const PLACEHOLDER_IMG =
	'https://res.cloudinary.com/dtp21hkrc/image/upload/v1755626661/balance-botanica/products/product-1755626659715-hqv5rg1g4.jpg';

const BASE_DESC =
	'Доповнюючий корм для собак: кубики з екстрактом куркуміну 95% (~60 мг на кубик), кокосовою олією, соняшниковим лецитином і щіпкою піперину. ';
const FEEDING =
	'Як давати: до 10 кг — 1 кубик/день, 10–25 кг — 1–2 кубики/день, 25+ кг — 2 кубики/день з їжею. Почати з половини дози 7–10 днів, ефект оцінювати через 4–8 тижнів. ';
const DISCLAIMER =
	'Не є ветеринарним лікарським засобом і не замінює призначені НПЗЗ. Без ксилітолу, цибулі, винограду, шоколаду.';

const SKUS = [
	{
		name: 'Balance Botanica Куркумінові кубики TRIAL · 3 шт',
		size: '3 cubes',
		price: 12900,
		stock: 100,
		flavor: 'pumpkin-coconut',
		categories: ['curcumin', 'treats', 'trial', 'dogs'],
		description: BASE_DESC + 'Пробник на 1–3 дні: перевірити смак і стілець. ' + FEEDING + DISCLAIMER
	},
	{
		name: 'Balance Botanica Куркумінові кубики WEEK · 7 шт',
		size: '7 cubes',
		price: 24900,
		stock: 100,
		flavor: 'pumpkin-coconut',
		categories: ['curcumin', 'treats', 'week', 'dogs'],
		description: BASE_DESC + 'Тижневий запас для малої собаки (1 кубик/день). ' + FEEDING + DISCLAIMER
	},
	{
		name: 'Balance Botanica Куркумінові кубики HALF · 15 шт',
		size: '15 cubes',
		price: 45900,
		stock: 100,
		flavor: 'pumpkin-coconut',
		categories: ['curcumin', 'treats', 'halfmonth', 'dogs'],
		description:
			BASE_DESC + 'Запас на ~7–15 днів залежно від ваги. Оптимально для оцінки першого ефекту. ' + FEEDING + DISCLAIMER
	},
	{
		name: 'Balance Botanica Куркумінові кубики MONTH · 30 шт (bottle)',
		size: '30 cubes',
		price: 84900,
		stock: 100,
		flavor: 'pumpkin-coconut',
		categories: ['curcumin', 'treats', 'month', 'dogs', 'subscription'],
		description:
			BASE_DESC + 'Місячний запас для малої собаки в банці XXL + refill-пак. Для підписки. ' + FEEDING + DISCLAIMER
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
	console.log('🎉 4 SKUs seeded');
	process.exit(0);
})().catch((e) => {
	console.error('❌ seed failed:', e.message);
	process.exit(1);
});
