#!/usr/bin/env node

// Загружаем переменные окружения
import { config } from 'dotenv';
config();

import { TelegramBotService } from '../src/lib/server/services/telegram-bot.service';
import { OrderService } from '../src/lib/server/application/services/order.service';
import { GoogleSheetsService } from '../src/lib/server/services/google-sheets.service';

	console.log('🤖 Starting Balance Botanica Telegram Order Management Bot...');
	console.log('💡 Available commands:');
	console.log('   /start  - Setup bot');
	console.log('   /status - Check bot status');
	console.log('   /test   - Test notifications');
	console.log('');

	try {
		const botService = new TelegramBotService(false); // Не запускаем polling автоматически
		const orderService = new OrderService();
		const sheetsService = new GoogleSheetsService();

		// Запускаем polling для бота вручную
		botService.startPolling();

	console.log('✅ Services initialized successfully');
	console.log('📱 Bot is running and listening for commands...');
	console.log('💡 Send /start to your bot to begin');

	// Выводим статус бота
	setTimeout(() => {
		const status = botService.getBotStatus();
		console.log('\n📊 Bot Status:');
		console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
		console.log('Admin Chat ID:', status.adminChatId || '❌ Not set');
		console.log('Bot Token:', status.botToken);
		console.log('File exists:', status.fileExists ? '✅ Yes' : '❌ No');
		console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

		if (!status.adminChatId) {
			console.log('⚠️  WARNING: Admin Chat ID not found!');
			console.log('💡 Send /start command to your bot to set it up.');
		} else {
			console.log('✅ Bot is ready to receive notifications!');
		}
	}, 2000);

	// Обработка команд
	botService.bot.on('message', async (msg) => {
		const username = msg.from?.username;
		const text = msg.text;

		// Проверяем что это разрешенный пользователь
		if (username !== 'qq5756853') {
			console.log(`🚫 Access denied for user: @${username} (ID: ${msg.from?.id})`);
			return;
		}

		if (!botService.getAdminChatId()) {
			console.log('👑 Setting admin chat ID:', msg.chat.id, 'for user @qq5756853');
			botService.setAdminChatId(msg.chat.id.toString());
			console.log('✅ Admin chat ID configured. You can now receive order notifications!');

			// Отправляем приветственное сообщение
			await botService.bot.sendMessage(msg.chat.id, '✅ Бот настроен! Теперь вы будете получать уведомления о новых заказах.');
		}

		// Обработка команды /test
		if (text === '/test') {
			console.log('🧪 Testing bot notification...');
			const success = await botService.testNotification();
			if (success) {
				await botService.bot.sendMessage(msg.chat.id, '✅ Тестовое уведомление отправлено успешно!');
			} else {
				await botService.bot.sendMessage(msg.chat.id, '❌ Не удалось отправить тестовое уведомление. Проверьте настройки бота.');
			}
		}

		// Обработка команды /status
		if (text === '/status') {
			const status = botService.getBotStatus();
			const statusMessage = `
📊 *СТАТУС БОТА*

👤 Admin Chat ID: ${status.adminChatId || '❌ Не установлен'}
🤖 Bot Token: ${status.botToken}
📁 Файл конфигурации: ${status.fileExists ? '✅ Существует' : '❌ Отсутствует'}

💡 Отправьте /start для настройки
🧪 Отправьте /test для проверки уведомлений
			`.trim();

			await botService.bot.sendMessage(msg.chat.id, statusMessage, { parse_mode: 'Markdown' });
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
