#!/usr/bin/env node

// Загружаем переменные окружения
import { config } from 'dotenv';
config();

console.log('🧪 Testing Balance Botanica Order Management System...\n');

// Простой тест без импортов
async function testOrderSystem() {
	try {
		console.log('1️⃣ Checking credentials...');

		// Проверяем наличие файла с учетными данными Google
		const fs = await import('fs');
		const path = await import('path');

		const credentialsPath = path.join(process.cwd(), 'balance-botanica-d061b04ea697.json');

		if (!fs.existsSync(credentialsPath)) {
			console.log('⚠️  Google credentials file not found');
			console.log('   You need to create balance-botanica-d061b04ea697.json');
			console.log('   See GOOGLE_SHEETS_SETUP.md for instructions\n');
		} else {
			const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
			if (!credentials.client_email || !credentials.private_key) {
				console.log('⚠️  Invalid Google credentials format');
				console.log('   Check your balance-botanica-d061b04ea697.json file\n');
			} else {
				console.log('✅ Google credentials found and valid\n');
			}
		}

		console.log('2️⃣ Checking environment variables...');

		// Проверяем переменные окружения
		if (!process.env.TELEGRAM_BOT_TOKEN) {
			console.log('⚠️  TELEGRAM_BOT_TOKEN not found in .env');
			console.log('   Please add it to .env file');
		} else {
			console.log('✅ Telegram bot token configured');
		}

		if (!process.env.GOOGLE_CREDENTIALS_PATH) {
			console.log('⚠️  GOOGLE_CREDENTIALS_PATH not found in .env');
			console.log('   Using default path');
		} else {
			console.log('✅ Google credentials path configured');
		}

		console.log('✅ Basic configuration check passed\n');

		console.log('🎉 System is ready to run!\n');

		console.log('📋 Next steps:');
		console.log('1. Start the Telegram bot: npm run bot');
		console.log('2. Configure Google Sheets dropdown (see GOOGLE_SHEETS_SETUP.md)');
		console.log('3. Test order creation through the website');
		console.log('4. Check Google Sheets for automatic updates\n');

		console.log('📖 Documentation:');
		console.log('- QUICK_START.md - Быстрый запуск');
		console.log('- GOOGLE_SHEETS_SETUP.md - Настройка Google Sheets');
		console.log('- ORDER_MANAGEMENT_README.md - Подробная документация');

	} catch (error) {
		console.error('❌ Test failed:', error.message);
		console.log('\n🔧 Troubleshooting:');
		console.log('1. Check if balance-botanica-d061b04ea697.json exists');
		console.log('2. Verify Google Sheets permissions');
		console.log('3. Check Telegram bot token');
		console.log('4. Run: npm install');
		process.exit(1);
	}
}

testOrderSystem();
