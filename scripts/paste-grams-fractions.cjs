// One-off: grams-only naming (no TRIAL/WEEK/HALF/MONTH) + jar-fraction dosing.
// Usage: node scripts/paste-grams-fractions.cjs   (run from balance_botanica/)
require('dotenv').config();
const PocketBase = require('pocketbase').default;

const URL = process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';
const EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;
if (!PASSWORD) throw new Error('POCKETBASE_ADMIN_PASSWORD is not set (see .env)');

const BASE_DESC =
	'Золота паста для собак: куркума + стандартизований екстракт куркуміну 95% (~60 мг на 5 г пасти), кокосова олія, імбир, чорний перець, соняшниковий лецитин. ';
const FEEDING =
	'Добова порція — частка банки: до 10 кг — 1/12 банки 30 г · 10–25 кг — 1/6 банки 30 г (або 1/20 банки 100 г) · 25+ кг — 1/3 банки 30 г (або 1/10 банки 100 г). Давати з їжею, почати з половини порції на 7–10 днів, ефект оцінювати через 4–8 тижнів. Зберігати в холодильнику за етикеткою. ';
const DISCLAIMER =
	'Доповнюючий корм. Не є ветеринарним лікарським засобом і не замінює призначені НПЗЗ. Без ксилітолу, цибулі, винограду, шоколаду.';

const RENAMES = [
	{ match: /TRIAL/i, name: 'Balance Botanica Золота паста 30 г', size: '30 g', price: 12900, stock: 100 },
	{ match: /WEEK/i, name: 'Balance Botanica Золота паста 100 г', size: '100 g', price: 24900, stock: 100 },
	{ match: /HALF/i, name: 'Balance Botanica Золота паста 250 г', size: '250 g', price: 45900, stock: 100 },
	{ match: /MONTH/i, name: 'Balance Botanica Золота паста 500 г', size: '500 g', price: 84900, stock: 100 }
];

(async () => {
	const pb = new PocketBase(URL);
	await pb.collection('_superusers').authWithPassword(EMAIL, PASSWORD);
	const products = await pb.collection('products').getFullList();
	for (const p of products) {
		const rule = RENAMES.find((r) => r.match.test(p.name || ''));
		if (!rule) {
			console.log(`-- skip (unknown): ${p.name}`);
			continue;
		}
		const cats = (p.categories || []).filter((c) => !/^(trial|week|halfmonth|month)$/i.test(c));
		if (!cats.includes('paste')) cats.push('paste');
		if (!cats.includes('dogs')) cats.push('dogs');
		if (/500/.test(rule.size) && !cats.includes('subscription')) cats.push('subscription');
		await pb.collection('products').update(p.id, {
			name: rule.name,
			size: rule.size,
			price: rule.price,
			stock: rule.stock,
			flavor: 'turmeric-ginger',
			categories: cats,
			description: BASE_DESC + FEEDING + DISCLAIMER
		});
		console.log(`✅ ${rule.name}`);
	}
	console.log('🎉 grams-only catalog done');
	process.exit(0);
})().catch((e) => {
	console.error('❌ failed:', e.message);
	process.exit(1);
});
