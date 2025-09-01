#!/usr/bin/env node

// Загружаем переменные окружения
import { config } from 'dotenv';
config();

import { TelegramBotService } from '../src/lib/server/services/telegram-bot.service';

console.log('🧪 Testing Telegram Bot Notifications...');

async function testBot() {
	try {
		// Создаем экземпляр бота
		const botService = new TelegramBotService(false);

		// Проверяем статус
		const status = botService.getBotStatus();
		console.log('\n📊 Current Bot Status:');
		console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
		console.log('Admin Chat ID:', status.adminChatId || '❌ Not set');
		console.log('Bot Token:', status.botToken);
		console.log('File exists:', status.fileExists ? '✅ Yes' : '❌ No');
		console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

		if (!status.adminChatId) {
			console.log('❌ Cannot test notifications: adminChatId not set!');
			console.log('💡 Solution:');
			console.log('   1. Start the bot: npm run bot');
			console.log('   2. Send /start to your bot');
			console.log('   3. Then run this test again');
			process.exit(1);
		}

		console.log('🧪 Sending test notification...');
		const success = await botService.testNotification();

		if (success) {
			console.log('\n✅ SUCCESS: Test notification sent!');
			console.log('📱 Check your Telegram bot for the test message');
		} else {
			console.log('\n❌ FAILED: Could not send test notification');
			console.log('🔍 Check the console logs above for error details');
		}

	} catch (error) {
		console.error('❌ Test failed with error:', error);
		process.exit(1);
	}
}

testBot();
