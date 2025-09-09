// Improved modular Telegram bot service
import TelegramBot from 'node-telegram-bot-api';
import { OrderService } from '../application/services/order.service';
import { GoogleSheetsService } from './google-sheets.service';
import { PromoCodeService } from '../application/services/promo-code.service';
import { CommandHandler } from './handlers/CommandHandler';
import { CallbackHandler } from './handlers/CallbackHandler';
import { OrderFormatter } from './formatters/OrderFormatter';
import { UserStateManager } from './state/UserStateManager';
import { OrderValidator } from './validators/OrderValidator';
import type { Order } from '../domain/interfaces/order.interface';

/**
 * IMPROVED TELEGRAM BOT SERVICE
 *
 * This version uses modular architecture with:
 * - Separation of concerns
 * - Dependency injection
 * - Strategy pattern for handlers
 * - Proper error handling
 * - Better testability
 */
export class TelegramBotServiceV2 {
	private bot: TelegramBot;
	private handlers: any[] = [];
	private adminChatId: string | null = null;

	constructor(
		private orderService: OrderService,
		private sheetsService: GoogleSheetsService,
		private promoService: PromoCodeService,
		private stateManager: UserStateManager,
		private formatter: OrderFormatter,
		private validator: OrderValidator
	) {
		this.initializeBot();
		this.initializeHandlers();
		this.setupEventListeners();
		this.loadAdminChatId();
	}

	private initializeBot(): void {
		const botToken =
			process.env.TELEGRAM_BOT_TOKEN || '8343800455:AAGk9NjKvopbJoGsRfl-Tkv3Rg9kh4qqDfI';

		if (!botToken) {
			throw new Error('TELEGRAM_BOT_TOKEN is required');
		}

		this.bot = new TelegramBot(botToken, { polling: false });
	}

	private initializeHandlers(): void {
		// Initialize handlers with dependencies
		this.handlers.push(
			new CommandHandler(this.bot, this.orderService),
			new CallbackHandler(this.bot, this.orderService, this.promoService)
		);

		// Sort by priority (higher = first)
		this.handlers.sort((a, b) => b.getPriority() - a.getPriority());
	}

	private setupEventListeners(): void {
		// Handle commands and messages
		this.bot.on('message', (msg) => this.handleMessage(msg));

		// Handle callback queries
		this.bot.on('callback_query', (query) => this.handleCallback(query));

		console.log('[TelegramBotV2] Event listeners setup complete');
	}

	private async handleMessage(msg: TelegramBot.Message): Promise<void> {
		try {
			const chatId = msg.chat.id;
			const text = msg.text;
			const username = msg.from?.username;

			if (!text || !this.isAuthorizedUser(username)) {
				return;
			}

			// Check if user is awaiting input
			if (this.stateManager.isAwaitingInput(chatId)) {
				await this.handleUserInput(chatId, text);
				return;
			}

			// Find appropriate handler
			const handler = this.handlers.find((h) => h.canHandle(text));
			if (handler) {
				await handler.handle(chatId, text);
			} else {
				await this.handleUnknownInput(chatId, text);
			}
		} catch (error) {
			console.error('[TelegramBotV2] Message handling error:', error);
		}
	}

	private async handleCallback(query: TelegramBot.CallbackQuery): Promise<void> {
		try {
			const chatId = query.message?.chat.id;
			const data = query.data;
			const username = query.from?.username;

			if (!chatId || !data || !this.isAuthorizedUser(username)) {
				this.bot.answerCallbackQuery(query.id, { text: '❌ Доступ заборонено' });
				return;
			}

			// Handle special cases first
			switch (data) {
				case 'ignore':
					// Ignore separator line clicks
					this.bot.answerCallbackQuery(query.id);
					return;
				case 'show_help':
					await this.showHelp(chatId);
					this.bot.answerCallbackQuery(query.id);
					return;
				case 'show_orders':
					await this.showOrdersList(chatId);
					this.bot.answerCallbackQuery(query.id);
					return;
				case 'cancel_operation':
					console.log('[TelegramBotV2] ❌ Cancel operation button clicked');
					this.stateManager.clearState(chatId);
					await this.bot.sendMessage(chatId, '❌ Операція скасована.');
					await this.showMainMenu(chatId);
					this.bot.answerCallbackQuery(query.id);
					return;
			}

			// Find appropriate handler
			const handler = this.handlers.find((h) => h.canHandle(data));
			if (handler) {
				await handler.handle(chatId, data);
			}

			this.bot.answerCallbackQuery(query.id);
		} catch (error) {
			console.error('[TelegramBotV2] Callback handling error:', error);
			this.bot.answerCallbackQuery(query.id, { text: '❌ Помилка виконання дії' });
		}
	}

	private async handleUserInput(chatId: number, input: string): Promise<void> {
		try {
			const result = this.stateManager.processInput(chatId, input);

			if (!result.processed) {
				await this.bot.sendMessage(chatId, '❌ Не вдалося обробити введені дані');
				return;
			}

			switch (result.action) {
				case 'confirm':
				case 'cancel':
				case 'deliver':
					await this.handleOrderAction(chatId, result.action!, result.orderId!);
					break;
				case 'ship':
					await this.handleShipAction(chatId, result.orderId!);
					break;
				case 'process_ttn':
					await this.handleTTNInput(chatId, result.orderId!, (result as any).ttn);
					break;
				case 'create_promo':
					await this.handlePromoCreation(chatId, (result as any).promoData);
					break;
			}
		} catch (error) {
			console.error('[TelegramBotV2] User input handling error:', error);
			await this.bot.sendMessage(chatId, '❌ Помилка обробки введених даних');
		}
	}

	private async handleOrderAction(chatId: number, action: string, orderId: string): Promise<void> {
		try {
			const order = await this.orderService.getOrderById(orderId);
			if (!order) {
				await this.bot.sendMessage(chatId, `❌ Замовлення ${orderId} не знайдено`);
				return;
			}

			const statusMap: Record<string, OrderStatus> = {
				confirm: 'confirmed',
				cancel: 'cancelled',
				deliver: 'delivered'
			};

			const newStatus = statusMap[action];
			if (!this.validator.isValidStatusTransition(order.status, newStatus)) {
				const errorMsg = this.validator.getStatusTransitionError(order.status, newStatus);
				await this.bot.sendMessage(chatId, errorMsg, { parse_mode: 'Markdown' });
				return;
			}

			const success = await this.orderService.updateOrderStatus(orderId, newStatus);
			if (success) {
				await this.sheetsService.updateOrderStatus(orderId, newStatus);
				const message = this.formatter.formatStatusChange(orderId, order.status, newStatus);
				await this.bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
			} else {
				await this.bot.sendMessage(chatId, `❌ Не вдалося оновити статус замовлення ${orderId}`);
			}
		} catch (error) {
			console.error('[TelegramBotV2] Order action error:', error);
			await this.bot.sendMessage(chatId, '❌ Помилка виконання дії з замовленням');
		}
	}

	private async handleShipAction(chatId: number, orderId: string): Promise<void> {
		this.stateManager.setState(chatId, {
			awaitingOrderId: false,
			awaitingTTN: true,
			action: 'ship',
			orderId: orderId
		});

		const keyboard = {
			inline_keyboard: [[{ text: '❌ Скасувати', callback_data: 'cancel_operation' }]]
		};

		await this.bot.sendMessage(
			chatId,
			`📦 Введіть ТТН накладної Нової Пошти для замовлення ${orderId}:`,
			{ reply_markup: keyboard }
		);
	}

	private async handleTTNInput(chatId: number, orderId: string, ttn: string): Promise<void> {
		try {
			if (!this.validator.isValidTTN(ttn)) {
				await this.bot.sendMessage(chatId, '❌ ТТН повинен містити 14 цифр. Спробуйте ще раз.');
				return;
			}

			const success = await this.orderService.updateOrderStatus(orderId, 'shipped');
			if (success) {
				await this.sheetsService.updateOrderStatus(orderId, 'shipped');
				await this.sheetsService.updateOrderTTN(orderId, ttn);

				await this.bot.sendMessage(
					chatId,
					`✅ Замовлення ${orderId} успішно відправлено!\n\n📦 ТТН: ${ttn}\n\nЗамовлення очікує доставки.`
				);
			} else {
				await this.bot.sendMessage(chatId, `❌ Не вдалося відправити замовлення ${orderId}`);
			}
		} catch (error) {
			console.error('[TelegramBotV2] TTN processing error:', error);
			await this.bot.sendMessage(chatId, '❌ Помилка обробки ТТН');
		}
	}

	private async handlePromoCreation(chatId: number, promoData: string): Promise<void> {
		// Implementation for promo creation would go here
		await this.bot.sendMessage(chatId, '🎫 Створення промокоду (функція в розробці)');
	}

	private async handleUnknownInput(chatId: number, input: string): Promise<void> {
		await this.bot.sendMessage(
			chatId,
			'❓ Невідома команда. Використайте /help для перегляду доступних команд.'
		);
	}

	private isAuthorizedUser(username?: string): boolean {
		return username === 'qq5756853';
	}

	// Helper methods for menu navigation
	private async showHelp(chatId: number): Promise<void> {
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

	private async showOrdersList(chatId: number): Promise<void> {
		try {
			const orders = await this.orderService.getAllOrders();
			let message = `📋 *Всі замовлення (${orders.length}):*\n\n`;

			if (orders.length === 0) {
				message = '📭 Немає замовлень';
			} else {
				orders.slice(0, 10).forEach((order) => {
					const statusEmoji = this.getStatusEmoji(order.status);
					message += `• ${order.id} - ${statusEmoji} ${order.customerName || 'Невідомий клієнт'}\n`;
				});
			}

			await this.bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
		} catch (error) {
			await this.bot.sendMessage(chatId, '❌ Помилка завантаження замовлень');
		}
	}

	private async showMainMenu(chatId: number): Promise<void> {
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

	private getStatusEmoji(status: string): string {
		const emojiMap: Record<string, string> = {
			pending: '⏳',
			confirmed: '✅',
			shipped: '📦',
			delivered: '🚚',
			cancelled: '❌'
		};
		return emojiMap[status] || '❓';
	}

	// Public methods
	async startPolling(): Promise<void> {
		console.log('[TelegramBotV2] Starting polling...');
		this.bot.startPolling();
	}

	async notifyNewOrder(order: Order): Promise<void> {
		if (!this.adminChatId) {
			console.log('[TelegramBotV2] No admin chat ID set for notifications');
			return;
		}

		try {
			const message = this.formatter.formatNewOrderNotification(order);
			const keyboard = {
				inline_keyboard: [
					[{ text: '✅ Підтвердити', callback_data: `confirm_${order.id}` }],
					[{ text: '📋 Деталі', callback_data: `details_${order.id}` }]
				]
			};

			await this.bot.sendMessage(this.adminChatId, message, {
				parse_mode: 'Markdown',
				reply_markup: keyboard
			});

			console.log(`[TelegramBotV2] New order notification sent for ${order.id}`);
		} catch (error) {
			console.error('[TelegramBotV2] Failed to send new order notification:', error);
		}
	}

	setAdminChatId(chatId: string): void {
		this.adminChatId = chatId;
		console.log('[TelegramBotV2] Admin chat ID set:', chatId);
	}

	getAdminChatId(): string | null {
		return this.adminChatId;
	}

	getBotStatus(): object {
		return {
			adminChatId: this.adminChatId,
			userStates: this.stateManager.getStats(),
			isPolling: false
		};
	}

	// Cleanup
	destroy(): void {
		this.stateManager.destroy();
		console.log('[TelegramBotV2] Bot service destroyed');
	}
}
