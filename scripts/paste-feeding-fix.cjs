// One-off: align product feeding text with the calculator (maintenance mg/kg).
// Usage: node scripts/paste-feeding-fix.cjs   (run from balance_botanica/)
require('dotenv').config();
const PocketBase = require('pocketbase').default;

const URL = process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';
const EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;
if (!PASSWORD) throw new Error('POCKETBASE_ADMIN_PASSWORD is not set (see .env)');

const BASE_DESC =
	'Золота паста для собак: куркума + стандартизований екстракт куркуміну 95% (~60 мг на 5 г пасти), кокосова олія, імбир, чорний перець, соняшниковий лецитин. ';
const FEEDING =
	'Добова порція — частка банки: до 10 кг — 1/6–1/3 банки 30 г · 10–25 кг — 1/2 банки 30 г (або 1/6 банки 100 г) · 25+ кг — 1/3 банки 100 г (або 1/8 банки 250 г). Давати з їжею, почати з половини порції на 7–10 днів, ефект оцінювати через 4–8 тижнів. Зберігати в холодильнику за етикеткою. ';
const DISCLAIMER =
	'Доповнюючий корм. Не є ветеринарним лікарським засобом і не замінює призначені НПЗЗ. Без ксилітолу, цибулі, винограду, шоколаду.';

(async () => {
	const pb = new PocketBase(URL);
	await pb.collection('_superusers').authWithPassword(EMAIL, PASSWORD);
	const products = await pb.collection('products').getFullList();
	for (const p of products) {
		await pb.collection('products').update(p.id, {
			description: BASE_DESC + FEEDING + DISCLAIMER
		});
		console.log(`✅ ${p.name}`);
	}
	console.log('🎉 feeding text aligned');
	process.exit(0);
})().catch((e) => {
	console.error('❌ failed:', e.message);
	process.exit(1);
});
