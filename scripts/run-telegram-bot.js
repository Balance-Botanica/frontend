#!/usr/bin/env node

// Загружаем переменные окружения
import { config } from 'dotenv';
config();

import { TelegramBotService } from '../src/lib/server/services/telegram-bot.service';
import { OrderService } from '../src/lib/server/application/services/order.service';
import { GoogleSheetsService } from '../src/lib/server/services/google-sheets.service';

console.log('🤖 Starting Balance Botanica Telegram Order Management Bot...');

try {
	const botService = new TelegramBotService(false); // Не запускаем polling автоматически
	const orderService = new OrderService();
	const sheetsService = new GoogleSheetsService();

	// Запускаем polling для бота вручную
	botService.startPolling();

	console.log('✅ Services initialized successfully');
	console.log('📱 Bot is running and listening for commands...');
	console.log('💡 Send /start to your bot to begin');

	// Обработка первого сообщения для установки admin chat ID
	botService.bot.on('message', (msg) => {
		const username = msg.from?.username;

		// Проверяем что это разрешенный пользователь
		if (username !== 'qq5756853') {
			console.log(`🚫 Access denied for user: @${username} (ID: ${msg.from?.id})`);
			return;
		}

		if (!botService.getAdminChatId()) {
			console.log('👑 Setting admin chat ID:', msg.chat.id, 'for user @qq5756853');
			botService.setAdminChatId(msg.chat.id.toString());
			console.log('✅ Admin chat ID configured. You can now receive order notifications!');
		}
	});

	// Graceful shutdown
	process.on('SIGINT', () => {
		console.log('\n🛑 Shutting down bot gracefully...');
		process.exit(0);
	});

	process.on('SIGTERM', () => {
		console.log('\n🛑 Shutting down bot gracefully...');
		process.exit(0);
	});

} catch (error) {
	console.error('❌ Failed to start bot:', error);
	process.exit(1);
}
