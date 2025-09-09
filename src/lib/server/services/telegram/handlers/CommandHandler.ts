import TelegramBot from 'node-telegram-bot-api';
import { IBotHandler } from '../interfaces/IBotHandler';
import { OrderService } from '../../application/services/order.service';

/**
 * Handles bot commands (/start, /help, /orders, etc.)
 */
export class CommandHandler implements IBotHandler {
	constructor(
		private bot: TelegramBot,
		private orderService: OrderService
	) {}

	async handle(chatId: number, command: string): Promise<void> {
		try {
			switch (command) {
				case '/start':
					await this.handleStart(chatId);
					break;
				case '/help':
					await this.handleHelp(chatId);
					break;
				case '/orders':
					await this.handleOrders(chatId);
					break;
				case '/menu':
					await this.handleMenu(chatId);
					break;
				default:
					await this.handleUnknownCommand(chatId, command);
			}
		} catch (error) {
			console.error(`[CommandHandler] Error handling command ${command}:`, error);
			await this.bot.sendMessage(chatId, '❌ Помилка виконання команди');
		}
	}

	canHandle(data: any): boolean {
		return typeof data === 'string' && data.startsWith('/');
	}

	getPriority(): number {
		return 10; // High priority for commands
	}

	private async handleStart(chatId: number): Promise<void> {
		const message = `
🤖 *Balance Botanica Bot*

Привіт! Я допоможу тобі керувати замовленнями та обробляти їх зручним способом.

📋 *Замовлення по статусах:*
		`;

		const keyboard = {
			inline_keyboard: [
				// Статусы заказов
				[
					{ text: '⏳ Очікують', callback_data: 'status_pending' },
					{ text: '✅ Підтверджені', callback_data: 'status_confirmed' }
				],
				[
					{ text: '📦 Відправлені', callback_data: 'status_shipped' },
					{ text: '🚚 Доставлені', callback_data: 'status_delivered' }
				],
				[
					{ text: '❌ Скасовані', callback_data: 'status_cancelled' },
					{ text: '📋 Всі замовлення', callback_data: 'show_orders' }
				],
				// Разделитель
				[{ text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', callback_data: 'ignore' }],
				// Действия с заказами
				[
					{ text: '✅ Підтвердити замовлення', callback_data: 'action_confirm' },
					{ text: '📦 Відправити замовлення', callback_data: 'action_ship' }
				],
				[
					{ text: '🚚 Позначити доставленим', callback_data: 'action_deliver' },
					{ text: '❌ Скасувати замовлення', callback_data: 'action_cancel' }
				],
				// Разделитель
				[{ text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', callback_data: 'ignore' }],
				// Промокоды и настройки
				[
					{ text: '🎫 Управління промокодами', callback_data: 'promo_menu' },
					{ text: '📖 Допомога', callback_data: 'show_help' }
				]
			]
		};

		await this.bot.sendMessage(chatId, message, {
			parse_mode: 'Markdown',
			reply_markup: keyboard
		});
	}

	private async handleHelp(chatId: number): Promise<void> {
		const message = `
📖 *Довідка по командам:*

🔹 /start - Початок роботи
🔹 /orders - Показати всі замовлення
🔹 /help - Ця довідка
🔹 /menu - Оновити головне меню

💡 Використовуйте inline кнопки для швидкого керування замовленнями.
		`;

		await this.bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
	}

	private async handleOrders(chatId: number): Promise<void> {
		try {
			const orders = await this.orderService.getAllOrders();
			let message = `📋 *Замовлення (${orders.length}):*\n\n`;

			if (orders.length === 0) {
				message = '📭 Немає активних замовлень';
			} else {
				orders.slice(0, 5).forEach((order) => {
					message += `• ${order.id} - ${this.getStatusText(order.status)}\n`;
				});

				if (orders.length > 5) {
					message += `\n... та ще ${orders.length - 5} замовлень`;
				}
			}

			await this.bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
		} catch (error) {
			console.error('[CommandHandler] Error getting orders:', error);
			await this.bot.sendMessage(chatId, '❌ Помилка завантаження замовлень');
		}
	}

	private async handleMenu(chatId: number): Promise<void> {
		await this.handleStart(chatId); // Reuse start handler
	}

	private async handleUnknownCommand(chatId: number, command: string): Promise<void> {
		await this.bot.sendMessage(
			chatId,
			`❓ Невідома команда: ${command}\n\nВикористайте /help для перегляду доступних команд.`
		);
	}

	private getStatusText(status: string): string {
		const statusMap: Record<string, string> = {
			pending: 'Очікує',
			confirmed: 'Підтверджено',
			shipped: 'Відправлено',
			delivered: 'Доставлено',
			cancelled: 'Скасовано'
		};
		return statusMap[status] || status;
	}
}
