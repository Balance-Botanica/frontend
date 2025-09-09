// node-telegram-bot-api does not have bundled types, so we import as below to avoid lint errors
// If @types/node-telegram-bot-api is not available, add a custom .d.ts file as a fallback
// See: https://github.com/yagop/node-telegram-bot-api/issues/319
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import TelegramBot from 'node-telegram-bot-api';
import { OrderService } from '../application/services/order.service';
import { GoogleSheetsService } from './google-sheets.service';
import { PromoCodeService } from '../application/services/promo-code.service';
import type { Order, OrderStatus } from '../domain/interfaces/order.interface';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// === CURRENT ARCHITECTURE ANALYSIS ===
// ✅ What works well:
// - Single entry point for bot management
// - All functionality in one place
// - Easy to understand and modify
// - Good error handling and logging
//
// ❌ Current problems:
// - Monolithic class (1600+ lines)
// - Mixed responsibilities (commands + callbacks + formatting)
// - Hard to test individual components
// - Difficult to maintain and extend
// - No separation of concerns
//
// === RECOMMENDED ARCHITECTURE IMPROVEMENTS ===
// 1. Split into smaller, focused modules
// 2. Use dependency injection
// 3. Add proper interfaces and abstractions
// 4. Implement strategy pattern for handlers
// 5. Add unit tests for each component
//
// === EXAMPLE: IMPROVED MODULAR ARCHITECTURE ===

// Example interfaces for better architecture:
interface IBotHandler {
	handle(chatId: number, data: any): Promise<void>;
	canHandle(data: any): boolean;
}

interface IOrderFormatter {
	formatOrderSummary(order: Order): string;
	formatOrderDetails(order: Order): string;
	formatOrderList(orders: Order[]): string;
}

interface IUserStateManager {
	getState(chatId: number): UserState | undefined;
	setState(chatId: number, state: UserState): void;
	clearState(chatId: number): void;
}

interface IMenuBuilder {
	createMainMenu(): any;
	createOrderActions(orderId: string, status: OrderStatus): any;
	createPromoMenu(): any;
}

// Example of how handlers could be structured:
class CommandHandler implements IBotHandler {
	constructor(
		private bot: TelegramBot,
		private orderService: OrderService
	) {}

	async handle(chatId: number, command: string): Promise<void> {
		switch (command) {
			case '/orders':
				await this.handleOrdersCommand(chatId);
				break;
			case '/start':
				await this.handleStartCommand(chatId);
				break;
			default:
				await this.bot.sendMessage(chatId, 'Unknown command');
		}
	}

	canHandle(data: any): boolean {
		return typeof data === 'string' && data.startsWith('/');
	}

	private async handleOrdersCommand(chatId: number): Promise<void> {
		const orders = await this.orderService.getAllOrders();
		const message = this.formatOrdersList(orders);
		await this.bot.sendMessage(chatId, message);
	}

	private async handleStartCommand(chatId: number): Promise<void> {
		const welcomeMessage = 'Welcome to Balance Botanica Bot!';
		const keyboard = this.createMainKeyboard();
		await this.bot.sendMessage(chatId, welcomeMessage, { reply_markup: keyboard });
	}

	private formatOrdersList(orders: Order[]): string {
		return orders.map((order) => `${order.id}: ${order.status}`).join('\n');
	}

	private createMainKeyboard() {
		return {
			inline_keyboard: [
				[{ text: 'Orders', callback_data: 'show_orders' }],
				[{ text: 'Help', callback_data: 'show_help' }]
			]
		};
	}
}

// Example improved TelegramBotService:
class ImprovedTelegramBotService {
	private handlers: IBotHandler[] = [];

	constructor(
		private bot: TelegramBot,
		private orderService: OrderService,
		private stateManager: IUserStateManager,
		private formatter: IOrderFormatter,
		private menuBuilder: IMenuBuilder
	) {
		this.initializeHandlers();
		this.setupEventListeners();
	}

	private initializeHandlers(): void {
		this.handlers.push(new CommandHandler(this.bot, this.orderService));
		// Add other handlers...
	}

	private setupEventListeners(): void {
		this.bot.on('message', (msg) => this.handleMessage(msg));
		this.bot.on('callback_query', (query) => this.handleCallback(query));
	}

	private async handleMessage(msg: TelegramBot.Message): Promise<void> {
		const chatId = msg.chat.id;
		const text = msg.text;

		if (!text) return;

		// Find appropriate handler
		const handler = this.handlers.find((h) => h.canHandle(text));
		if (handler) {
			await handler.handle(chatId, text);
		}
	}

	private async handleCallback(query: TelegramBot.CallbackQuery): Promise<void> {
		// Handle callback with appropriate handler
		const handler = this.handlers.find((h) => h.canHandle(query.data));
		if (handler) {
			await handler.handle(query.message?.chat.id!, query.data);
		}
		this.bot.answerCallbackQuery(query.id);
	}
}

interface UserState {
	awaitingOrderId: boolean;
	awaitingTTN?: boolean;
	awaitingPromoData?: boolean;
	action?: 'confirm' | 'cancel' | 'ship' | 'deliver' | 'create_promo';
	orderId?: string;
}

/**
 * LEGACY IMPLEMENTATION - MONOLITHIC BOT SERVICE
 *
 * This class works but has architectural issues:
 * - Too many responsibilities in one class
 * - Hard to test and maintain
 * - Mixed concerns (presentation + business logic)
 *
 * For production, consider refactoring to the modular architecture shown above.
 */
export class TelegramBotService {
	private bot: TelegramBot;
	private orderService: OrderService;
	private sheetsService: GoogleSheetsService;
	private promoCodeService: PromoCodeService;
	private adminChatId: string | null = null;
	private userStates: Map<number, UserState> = new Map();

	constructor(autoStartPolling = false) {
		const botToken =
			process.env.TELEGRAM_BOT_TOKEN || '8343800455:AAGk9NjKvopbJoGsRfl-Tkv3Rg9kh4qqDfI';

		if (!botToken) {
			throw new Error('TELEGRAM_BOT_TOKEN is required. Please set it in .env file');
		}

		this.bot = new TelegramBot(botToken, { polling: false }); // Вимикаємо авто-polling
		this.orderService = new OrderService();
		this.sheetsService = new GoogleSheetsService();
		this.promoCodeService = new PromoCodeService();

		// Завантажуємо збережений adminChatId
		this.loadAdminChatId();

		this.setupCommands();
		this.setupCallbacks();
		this.setupTextHandler();

		// Запускаємо polling тільки якщо явно вказано
		if (autoStartPolling) {
			this.startPolling();
		}
	}

	// Метод для запуску polling вручну
	startPolling(): void {
		console.log('[TelegramBot] Starting polling manually...');
		this.bot.startPolling();
	}

	private setupCommands(): void {
		// Команда /start
		this.bot.onText(/\/start/, (msg: TelegramBot.Message) => {
			const chatId = msg.chat.id;
			const username = msg.from?.username;

			// Перевіряємо, що це дозволений користувач
			if (username !== 'qq5756853') {
				this.bot.sendMessage(
					chatId,
					'❌ Доступ заборонено. Цей бот призначений тільки для адміністратора.'
				);
				console.log(`[TelegramBot] Access denied for user: @${username} (ID: ${msg.from?.id})`);
				return;
			}

			// Встановлюємо adminChatId при першому запуску
			if (!this.adminChatId) {
				this.setAdminChatId(chatId.toString());
				console.log(`[TelegramBot] Admin chat ID set: ${chatId} for user @${username}`);
			}

			const welcomeMessage = `
🤖 *Balance Botanica Order Management Bot*

Привіт! Я допоможу тобі керувати замовленнями з телефону.

🚀 *Обери дію:*
			`;

			const mainMenu = {
				inline_keyboard: [
					[
						{ text: '⏳ Очікують', callback_data: 'status_pending' },
						{ text: '✅ Підтверджені', callback_data: 'status_confirmed' }
					],
					[{ text: '🎫 Промокоди', callback_data: 'promo_menu' }],
					[
						{ text: '📦 Відправлені', callback_data: 'status_shipped' },
						{ text: '🚚 Доставлені', callback_data: 'status_delivered' }
					],
					[
						{ text: '❌ Скасовані', callback_data: 'status_cancelled' },
						{ text: '📋 Всі замовлення', callback_data: 'all_orders' }
					]
				]
			};

			this.bot.sendMessage(chatId, welcomeMessage, {
				parse_mode: 'Markdown',
				reply_markup: mainMenu
			});
		});

		// Команда /help
		this.bot.onText(/\/help/, (msg: TelegramBot.Message) => {
			const chatId = msg.chat.id;
			const username = msg.from?.username;

			// Перевіряємо доступ
			if (username !== 'qq5756853') {
				this.bot.sendMessage(chatId, '❌ Доступ заборонено.');
				return;
			}

			const helpMessage = `
📖 *Довідка по командах:*

🔹 /orders - Показати всі замовлення
🔹 /pending - Замовлення в очікуванні підтвердження
🔹 /confirmed - Підтверджені замовлення
🔹 /shipped - Відправлені замовлення
🔹 /delivered - Доставлені замовлення
🔹 /cancelled - Скасовані замовлення
🔹 /menu - Оновити головне меню (якщо кнопки не відображаються)

🔹 /status [ID] [статус] - Оновити статус замовлення
   *Приклади:*
   \`/status 123456 confirmed\`
   \`/status 123456 shipped\`
   \`/status 123456 delivered\`

📊 *Статуси замовлень:*
• pending - Очікує підтвердження
• confirmed - Підтверджено
• shipped - Відправлено
• delivered - Доставлено
• cancelled - Скасовано

🎫 *Управління промокодами:*
• Використовуйте кнопку "🎫 Промокоди" в головному меню
• Створюйте промокоди різних типів: відсоткова знижка, фіксована сума, безкоштовна доставка
• Переглядайте статистику використання та список активних промокодів
• Видаляйте непотрібні промокоди з підтвердженням

💡 *Поради:*
• Використовуй inline кнопки для швидкого керування
• Всі зміни синхронізуються з Google Sheets
• Нові замовлення приходять автоматично
• Якщо кнопки не відображаються, використовуйте /menu
			`;

			this.bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
		});

		// Команда /orders - показати всі замовлення
		this.bot.onText(/\/orders/, async (msg: TelegramBot.Message) => {
			const chatId = msg.chat.id;
			const username = msg.from?.username;

			// Перевіряємо доступ
			if (username !== 'qq5756853') {
				this.bot.sendMessage(chatId, '❌ Доступ заборонено.');
				return;
			}

			await this.sendOrdersList(chatId);
		});

		// Команди по статусам
		this.bot.onText(/\/pending/, async (msg: TelegramBot.Message) => {
			const chatId = msg.chat.id;
			const username = msg.from?.username;

			if (username !== 'qq5756853') {
				this.bot.sendMessage(chatId, '❌ Доступ заборонено.');
				return;
			}

			await this.sendOrdersByStatus(chatId, 'pending');
		});

		this.bot.onText(/\/confirmed/, async (msg: TelegramBot.Message) => {
			const chatId = msg.chat.id;
			const username = msg.from?.username;

			if (username !== 'qq5756853') {
				this.bot.sendMessage(chatId, '❌ Доступ заборонено.');
				return;
			}

			await this.sendOrdersByStatus(chatId, 'confirmed');
		});

		this.bot.onText(/\/shipped/, async (msg: TelegramBot.Message) => {
			const chatId = msg.chat.id;
			const username = msg.from?.username;

			if (username !== 'qq5756853') {
				this.bot.sendMessage(chatId, '❌ Доступ заборонено.');
				return;
			}

			await this.sendOrdersByStatus(chatId, 'shipped');
		});

		this.bot.onText(/\/delivered/, async (msg: TelegramBot.Message) => {
			const chatId = msg.chat.id;
			const username = msg.from?.username;

			if (username !== 'qq5756853') {
				this.bot.sendMessage(chatId, '❌ Доступ заборонено.');
				return;
			}

			await this.sendOrdersByStatus(chatId, 'delivered');
		});

		this.bot.onText(/\/cancelled/, async (msg: TelegramBot.Message) => {
			const chatId = msg.chat.id;
			const username = msg.from?.username;

			if (username !== 'qq5756853') {
				this.bot.sendMessage(chatId, '❌ Доступ заборонено.');
				return;
			}

			await this.sendOrdersByStatus(chatId, 'cancelled');
		});

		// Команда /status для оновлення статусу
		this.bot.onText(
			/\/status (.+)/,
			async (msg: TelegramBot.Message, match: RegExpExecArray | null) => {
				const chatId = msg.chat.id;
				const username = msg.from?.username;

				if (username !== 'qq5756853') {
					this.bot.sendMessage(chatId, '❌ Доступ заборонено.');
					return;
				}

				const params = match?.[1]?.split(' ');

				if (!params || params.length !== 2) {
					this.bot.sendMessage(
						chatId,
						'❌ Неправильний формат команди. Використовуй: /status [ID] [статус]'
					);
					return;
				}

				const [orderId, newStatus] = params;
				await this.updateOrderStatus(chatId, orderId, newStatus as OrderStatus);
			}
		);

		// Команда /cancel для скасування поточної операції
		this.bot.onText(/\/cancel/, (msg: TelegramBot.Message) => {
			const chatId = msg.chat.id;
			const username = msg.from?.username;

			if (username !== 'qq5756853') {
				this.bot.sendMessage(chatId, '❌ Доступ заборонено.');
				return;
			}

			this.userStates.delete(chatId);
			this.bot.sendMessage(chatId, '❌ Операція скасована.');
		});

		// Команда /menu для оновлення головного меню
		this.bot.onText(/\/menu/, (msg: TelegramBot.Message) => {
			const chatId = msg.chat.id;
			const username = msg.from?.username;

			if (username !== 'qq5756853') {
				this.bot.sendMessage(chatId, '❌ Доступ заборонено.');
				return;
			}

			this.sendMainMenu(chatId);
		});
	}

	private setupCallbacks(): void {
		// Обробка inline кнопок
		this.bot.on('callback_query', async (query: TelegramBot.CallbackQuery) => {
			const chatId = query.message?.chat.id;
			const data = query.data;
			const username = query.from?.username;

			console.log('[TelegramBot] 📨 Callback received:', { data, chatId, username });

			if (!chatId || !data) return;

			// Перевіряємо доступ
			if (username !== 'qq5756853') {
				this.bot.answerCallbackQuery(query.id, { text: '❌ Доступ заборонено' });
				return;
			}

			// Розбір callback data
			const parts = data.split('_');
			const action = parts[0];
			const param1 = parts[1];
			const param2 = parts[2];

			try {
				console.log(
					`[TelegramBot] Processing callback: action='${action}', param1='${param1}', param2='${param2}'`
				);

				// Спочатку перевіряємо повну строку data для спеціальних випадків
				switch (data) {
					case 'promo_menu':
						console.log('[TelegramBot] 🎫 Promo menu button clicked');
						await this.sendPromoMenu(chatId);
						this.bot.answerCallbackQuery(query.id);
						return;
					case 'back_menu':
						await this.sendMainMenu(chatId);
						this.bot.answerCallbackQuery(query.id);
						return;
					case 'all_orders':
						await this.sendOrdersList(chatId);
						this.bot.answerCallbackQuery(query.id);
						return;
					case 'refresh_orders':
						await this.sendOrdersList(chatId);
						this.bot.answerCallbackQuery(query.id);
						return;
					case 'create_promo':
						this.userStates.set(chatId, {
							awaitingOrderId: false,
							awaitingTTN: false,
							awaitingPromoData: true,
							action: 'create_promo'
						});
						this.bot.sendMessage(
							chatId,
							'🎫 Введіть дані промокоду у форматі:\n\nКод,Тип,Значення[,Мін.сума][,Ліміт][,Дедлайн]\n\nПриклади:\nWELCOME10,percentage,10\nSAVE50,fixed,50,500\nFREESHIP,free_shipping,0\n\nТипи: percentage, fixed, free_shipping'
						);
						this.bot.answerCallbackQuery(query.id);
						return;
					case 'list_promos':
						await this.sendPromoList(chatId);
						this.bot.answerCallbackQuery(query.id);
						return;
					case 'promo_stats':
						await this.sendPromoStats(chatId);
						this.bot.answerCallbackQuery(query.id);
						return;
					case 'delete_promo':
						await this.sendDeletePromoList(chatId);
						this.bot.answerCallbackQuery(query.id);
						return;
				}

				// Потім перевіряємо за частинами
				switch (action) {
					// Скасування операції (повинно бути першим!)
					case 'cancel':
						if (param1 === 'operation') {
							console.log('[TelegramBot] ❌ Cancel operation button clicked');
							this.userStates.delete(chatId);
							this.bot.sendMessage(chatId, '❌ Операція скасована.');
							await this.sendOrdersList(chatId);
							this.bot.answerCallbackQuery(query.id);
							return;
						}
						// Якщо це не скасування операції, продовжуємо до звичайної обробки cancel
						break;

					// Меню статусів
					case 'status':
						await this.sendOrdersByStatus(chatId, param1 as OrderStatus);
						this.bot.answerCallbackQuery(query.id);
						return;
					case 'confirm':
						if (param1 === 'delete') {
							await this.confirmDeletePromo(chatId, param2);
							this.bot.answerCallbackQuery(query.id);
							return;
						}
						break;
					case 'delete':
						if (param1 === 'confirmed') {
							await this.deletePromoCode(chatId, param2);
							this.bot.answerCallbackQuery(query.id);
							return;
						}
						break;
					case 'all':
						if (param1 === 'orders') {
							await this.sendOrdersList(chatId);
							this.bot.answerCallbackQuery(query.id);
							return;
						}
						break;

					// Дії з замовленнями
					case 'confirm':
						// Перевіряємо, чи це підтвердження замовлення (не видалення промокоду)
						if (param1 && param1 !== 'delete' && !param1.startsWith('delete')) {
							await this.updateOrderStatus(chatId, param1, 'confirmed');
							this.bot.answerCallbackQuery(query.id);
							return;
						}
						// Якщо це видалення промокоду, продовжуємо існуючу логіку
						if (param1 === 'delete') {
							await this.confirmDeletePromo(chatId, param2);
							this.bot.answerCallbackQuery(query.id);
							return;
						}
						break;
					case 'ship':
						// Для відправки замовлення запитуємо ТТН
						this.userStates.set(chatId, {
							awaitingOrderId: false,
							awaitingTTN: true,
							action: 'ship',
							orderId: param1
						});

						const cancelKeyboard = {
							inline_keyboard: [[{ text: '❌ Скасування', callback_data: 'cancel_operation' }]]
						};
						this.bot.sendMessage(
							chatId,
							`📦 Введіть ТТН накладної Нової Пошт.и для замовлення ${param1}:`,
							{
								reply_markup: cancelKeyboard
							}
						);
						this.bot.answerCallbackQuery(query.id);
						return;
					case 'deliver':
						await this.updateOrderStatus(chatId, param1, 'delivered');
						this.bot.answerCallbackQuery(query.id);
						return;
					case 'cancel':
						await this.updateOrderStatus(chatId, param1, 'cancelled');
						this.bot.answerCallbackQuery(query.id);
						return;
					case 'details':
						await this.sendOrderDetails(chatId, param1);
						this.bot.answerCallbackQuery(query.id);
						return;

					// Навігація
					case 'back':
					case 'menu':
						await this.sendMainMenu(chatId);
						this.bot.answerCallbackQuery(query.id);
						return;
					case 'refresh':
						if (param1 === 'orders') {
							await this.sendOrdersList(chatId);
							this.bot.answerCallbackQuery(query.id);
							return;
						}
						break;

					// Нові дії з замовленнями
					case 'action':
						await this.handleOrderAction(chatId, param1);
						this.bot.answerCallbackQuery(query.id);
						return;

					// Скасування операції вже оброблено вище
				}

				// Прибрати loading стан кнопки
				this.bot.answerCallbackQuery(query.id);
			} catch (error) {
				console.error('Callback query error:', error);
				this.bot.answerCallbackQuery(query.id, { text: '❌ Помилка виконання дії' });
			}
		});
	}

	private setupTextHandler(): void {
		// Обробка текстових повідомлень для введення ID замовлення та ТТН
		this.bot.on('message', async (msg: TelegramBot.Message) => {
			const chatId = msg.chat.id;
			const text = msg.text;
			const username = msg.from?.username;

			if (!text) return;

			// Перевіряємо доступ
			if (username !== 'qq5756853') {
				return; // Тихо ігноруємо повідомлення від інших користувачів
			}

			if (!this.adminChatId || chatId.toString() !== this.adminChatId) {
				return;
			}

			// Перевіряємо стан користувача
			const userState = this.userStates.get(chatId);
			if (!userState) return;

			// Якщо користувач чекає ТТН
			if (userState.awaitingTTN && userState.orderId) {
				await this.processTTN(chatId, text.trim(), userState.orderId);
				return;
			}

			// Якщо користувач чекає ID замовлення
			if (userState.awaitingOrderId && userState.action && userState.action !== 'create_promo') {
				await this.processOrderId(
					chatId,
					text.trim(),
					userState.action as 'confirm' | 'cancel' | 'ship' | 'deliver'
				);
				return;
			}

			// Якщо користувач чекає дані промокоду
			if (userState.awaitingPromoData && userState.action === 'create_promo') {
				await this.processPromoData(chatId, text.trim());
				return;
			}
		});
	}

	private async handleOrderAction(chatId: number, action: string): Promise<void> {
		const actionMap = {
			confirm: 'підтвердити',
			cancel: 'скасувати',
			ship: 'відправити',
			deliver: 'позначити як доставлений'
		};

		const actionText = actionMap[action as keyof typeof actionMap] || action;

		this.userStates.set(chatId, {
			awaitingOrderId: true,
			action: action as 'confirm' | 'cancel' | 'ship' | 'deliver'
		});

		const cancelKeyboard = {
			inline_keyboard: [[{ text: '❌ Скасування', callback_data: 'cancel_operation' }]]
		};
		this.bot.sendMessage(chatId, `📝 Введіть ID замовлення для ${actionText}:`, {
			reply_markup: cancelKeyboard
		});
	}

	private async processOrderId(
		chatId: number,
		orderId: string,
		action: 'confirm' | 'cancel' | 'ship' | 'deliver'
	): Promise<void> {
		try {
			// Для отправки замовлення сначала запрашиваем ТТН
			if (action === 'ship') {
				this.userStates.set(chatId, {
					awaitingOrderId: false,
					awaitingTTN: true,
					action: 'ship',
					orderId: orderId
				});

				const cancelKeyboard = {
					inline_keyboard: [[{ text: '❌ Скасування', callback_data: 'cancel_operation' }]]
				};
				this.bot.sendMessage(
					chatId,
					`📦 Введіть ТТН накладної Нової Пошт.и для замовлення ${orderId}:`,
					{
						reply_markup: cancelKeyboard
					}
				);
				return;
			}

			// Для інших дій відразу оновлюємо статус
			this.userStates.delete(chatId);

			// Визначаємо новий статус
			const statusMap = {
				confirm: 'confirmed' as OrderStatus,
				cancel: 'cancelled' as OrderStatus,
				ship: 'shipped' as OrderStatus,
				deliver: 'delivered' as OrderStatus
			};

			const newStatus = statusMap[action];
			await this.updateOrderStatus(chatId, orderId, newStatus);
		} catch (error) {
			console.error('Failed to process order ID:', error);
			this.bot.sendMessage(chatId, '❌ Ошибка обработки ID замовлення. Попробуйте еще раз.');
			this.userStates.delete(chatId);
		}
	}

	private async processTTN(chatId: number, ttn: string, orderId: string): Promise<void> {
		try {
			// Очищуємо стан користувача
			this.userStates.delete(chatId);

			// Валідація ТТН (повинен бути числом з 14 цифр)
			if (!/^\d{14}$/.test(ttn)) {
				this.bot.sendMessage(chatId, '❌ ТТН повинен містити 14 цифр. Спробуйте ще раз.');
				return;
			}

			console.log(`[TelegramBot] Shipping order ${orderId} with TTN: ${ttn}`);

			// Оновлюємо статус замовлення на shipped
			await this.updateOrderStatus(chatId, orderId, 'shipped');

			// Синхронізуємо ТТН з Google Sheets
			try {
				await this.sheetsService.updateOrderTTN(orderId, ttn);
				console.log(`[TelegramBot] TTN ${ttn} synced to Google Sheets for order ${orderId}`);
			} catch (sheetsError) {
				console.error('[TelegramBot] Failed to sync TTN to Google Sheets:', sheetsError);
				// Не перериваємо процес, якщо Google Sheets недоступний
			}

			// Надсилаємо підтвердження з ТТН
			this.bot.sendMessage(
				chatId,
				`✅ Замовлення ${orderId} успішно позначено як відправлене!\n\n📦 ТТН: ${ttn}\n\nЗамовлення очікує доставки.`
			);
		} catch (error) {
			console.error('Failed to process TTN:', error);
			this.bot.sendMessage(chatId, '❌ Помилка обробки ТТН. Спробуйте ще раз.');
		}
	}

	private async sendOrdersList(chatId: number): Promise<void> {
		try {
			this.bot.sendMessage(chatId, '📦 Завантажую замовлення...');

			// Для адміна отримуємо всі замовлення з бази даних
			const orders = await this.getAllOrdersForAdmin();

			if (orders.length === 0) {
				const emptyMessage = '📭 Немає активних замовлень';
				const emptyKeyboard = {
					inline_keyboard: [
						[
							{ text: '✅ Підтвердити замовлення', callback_data: 'action_confirm' },
							{ text: '❌ Скасувати замовлення', callback_data: 'action_cancel' }
						],
						[{ text: '⬅️ Назад', callback_data: 'back_menu' }]
					]
				};

				this.bot.sendMessage(chatId, emptyMessage, { reply_markup: emptyKeyboard });
				return;
			}

			let message = `📋 *Всі замовлення (${orders.length}):*\n\n`;

			// Показуємо всі замовлення з детальною інформацією
			for (const order of orders) {
				message += this.formatOrderDetailedSummary(order);
			}

			// Кнопки керування замовленнями
			const inlineKeyboard = {
				inline_keyboard: [
					[
						{ text: '✅ Підтвердити замовлення', callback_data: 'action_confirm' },
						{ text: '❌ Скасувати замовлення', callback_data: 'action_cancel' }
					],
					[
						{ text: '📦 Відправити замовлення', callback_data: 'action_ship' },
						{ text: '🚚 Доставлено', callback_data: 'action_deliver' }
					],
					[
						{ text: '🔄 Обновить', callback_data: 'refresh_orders' },
						{ text: '⬅️ Назад', callback_data: 'back_menu' }
					]
				]
			};

			this.bot.sendMessage(chatId, message, {
				parse_mode: 'Markdown',
				reply_markup: inlineKeyboard
			});
		} catch (error) {
			console.error('Failed to send orders list:', error);
			this.bot.sendMessage(chatId, '❌ Помилка завантаження замовлень');
		}
	}

	// Отримати всі замовлення для адміністратора
	private async getAllOrdersForAdmin(): Promise<Order[]> {
		try {
			console.log('[TelegramBot] Getting all orders for admin...');
			// Прямий запит до бази даних для отримання всіх замовлень
			const orders = await this.orderService.getAllOrders();
			console.log(`[TelegramBot] Retrieved ${orders.length} orders from database`);
			orders.forEach((order, index) => {
				console.log(
					`[TelegramBot] Order ${index + 1}: ID=${order.id}, Status=${order.status}, User=${order.userId}`
				);
			});
			return orders;
		} catch (error) {
			console.error('[TelegramBot] Failed to get all orders for admin:', error);
			return [];
		}
	}

	private async sendOrdersByStatus(chatId: number, status: OrderStatus): Promise<void> {
		try {
			const orders = await this.getAllOrdersForAdmin();
			const filteredOrders = orders.filter((order) => order.status === status);

			if (filteredOrders.length === 0) {
				const emptyMessage = `📭 Немає замовлень зі статусом "${this.getStatusText(status)}"`;
				const emptyKeyboard = {
					inline_keyboard: [
						[
							{ text: '✅ Підтвердити замовлення', callback_data: 'action_confirm' },
							{ text: '❌ Скасувати замовлення', callback_data: 'action_cancel' }
						],
						[{ text: '⬅️ Назад', callback_data: 'back_menu' }]
					]
				};

				this.bot.sendMessage(chatId, emptyMessage, { reply_markup: emptyKeyboard });
				return;
			}

			let message = `📋 *Замовлення "${this.getStatusText(status)}" (${filteredOrders.length}):*\n\n`;

			// Показуємо всі замовлення з детальною інформацією
			for (const order of filteredOrders) {
				message += this.formatOrderDetailedSummary(order);
			}

			// Кнопки керування замовленнями
			const inlineKeyboard = {
				inline_keyboard: [
					[
						{ text: '✅ Підтвердити замовлення', callback_data: 'action_confirm' },
						{ text: '❌ Скасувати замовлення', callback_data: 'action_cancel' }
					],
					[
						{ text: '📦 Відправити замовлення', callback_data: 'action_ship' },
						{ text: '🚚 Доставлено', callback_data: 'action_deliver' }
					],
					[
						{ text: '🔄 Обновить', callback_data: 'refresh_orders' },
						{ text: '⬅️ Назад', callback_data: 'back_menu' }
					]
				]
			};

			this.bot.sendMessage(chatId, message, {
				parse_mode: 'Markdown',
				reply_markup: inlineKeyboard
			});
		} catch (error) {
			console.error('Failed to send orders by status:', error);
			this.bot.sendMessage(chatId, '❌ Помилка завантаження замовлень');
		}
	}

	private async updateOrderStatus(
		chatId: number,
		orderId: string,
		status: OrderStatus
	): Promise<void> {
		try {
			console.log(`[TelegramBot] Starting order status update: ${orderId} -> ${status}`);

			// Спочатку отримуємо поточний статус замовлення для валідації
			const currentOrder = await this.orderService.getOrderById(orderId);
			if (!currentOrder) {
				console.log(`[TelegramBot] Order ${orderId} not found`);
				this.bot.sendMessage(chatId, `❌ Замовлення ${orderId} не знайдено`);
				return;
			}

			const currentStatus = currentOrder.status;
			console.log(`[TelegramBot] Current order status: ${currentStatus}`);

			// Валідація переходів статусів (заборона перепрыгивания)
			if (!this.isValidStatusTransition(currentStatus, status)) {
				const errorMessage = this.getStatusTransitionErrorMessage(currentStatus, status);
				console.log(`[TelegramBot] Invalid status transition: ${currentStatus} -> ${status}`);
				this.bot.sendMessage(chatId, errorMessage);
				return;
			}

			// Оновити статус у БД
			const success = await this.orderService.updateOrderStatus(orderId, status);
			console.log(`[TelegramBot] OrderService.updateOrderStatus result: ${success}`);

			if (!success) {
				console.log(`[TelegramBot] OrderService returned false for order ${orderId}`);
				this.bot.sendMessage(chatId, `❌ Замовлення ${orderId} не знайдено`);
				return;
			}

			console.log(`[TelegramBot] Order status update successful: ${orderId} -> ${status}`);

			// Оновити статус у Google Sheets
			await this.sheetsService.updateOrderStatus(orderId, status);

			const statusText = this.getStatusText(status);
			const message = `✅ Замовлення *${orderId}* оновлено\n\n📊 Новий статус: *${statusText}*`;

			const successKeyboard = {
				inline_keyboard: [
					[
						{ text: '🔄 Продовжити роботу', callback_data: 'back_menu' },
						{ text: '📋 Деталі замовлення', callback_data: `details_${orderId}` }
					]
				]
			};

			this.bot.sendMessage(chatId, message, {
				parse_mode: 'Markdown',
				reply_markup: successKeyboard
			});
		} catch (error) {
			console.error('Failed to update order status:', error);
			this.bot.sendMessage(chatId, `❌ Помилка оновлення статусу замовлення ${orderId}`);
		}
	}

	private async sendOrderDetails(chatId: number, orderId: string): Promise<void> {
		try {
			const order = await this.orderService.getOrderById(orderId);

			if (!order) {
				this.bot.sendMessage(chatId, `❌ Замовлення ${orderId} не знайдено`);
				return;
			}

			const message = this.formatOrderDetails(order);

			const inlineKeyboard = {
				inline_keyboard: [
					[
						{ text: '✅ Підтвердити', callback_data: `confirm_${orderId}` },
						{ text: '📦 Відправити', callback_data: `ship_${orderId}` }
					],
					[
						{ text: '🚚 Доставлено', callback_data: `deliver_${orderId}` },
						{ text: '❌ Скасувати', callback_data: `cancel_${orderId}` }
					]
				]
			};

			this.bot.sendMessage(chatId, message, {
				parse_mode: 'Markdown',
				reply_markup: inlineKeyboard
			});
		} catch (error) {
			console.error('Failed to send order details:', error);
			this.bot.sendMessage(chatId, `❌ Помилка завантаження деталей замовлення ${orderId}`);
		}
	}

	private formatOrderSummary(order: Order): string {
		const statusEmoji = this.getStatusEmoji(order.status);
		const date = new Date(order.createdAt).toLocaleDateString('uk-UA');
		const total = (order.total / 100).toFixed(2);

		return (
			`${statusEmoji} *${order.id}* - ${date}\n` +
			`💰 ${total} ₴ - ${order.items?.length || 0} товаров\n\n`
		);
	}

	private formatOrderDetailedSummary(order: Order): string {
		const statusEmoji = this.getStatusEmoji(order.status);
		const statusText = this.getStatusText(order.status);
		const date = new Date(order.createdAt).toLocaleDateString('uk-UA');
		const total = (order.total / 100).toFixed(2);

		console.log(
			`[TelegramBot] Formatting order ${order.id}: status=${order.status}, statusText=${statusText}, statusEmoji=${statusEmoji}`
		);

		let summary = `${statusEmoji} *ЗАМОВЛЕННЯ ${order.id}*\n`;
		summary += `📅 Дата: ${date}\n`;
		summary += `📊 Статус: ${statusText}\n`;
		summary += `💰 Сума: ${total} ₴\n`;
		summary += `📦 Товарів: ${order.items?.length || 0}\n`;

		// Показуємо товари
		if (order.items && order.items.length > 0) {
			summary += `🛍️ Товари:\n`;
			order.items.forEach((item, index) => {
				const price = (item.price / 100).toFixed(2);
				summary += `   ${index + 1}. ${item.productName} (${item.quantity}шт. × ${price}₴)\n`;
			});
		}

		// Адреса доставки
		if (order.deliveryAddress) {
			summary += `🏠 Адреса: `;

			// Перевіряємо, чи це адреса Нової Пошти
			if (
				order.deliveryAddress.npWarehouse ||
				order.deliveryAddress.npCityName ||
				order.deliveryAddress.useNovaPost
			) {
				// Адреса Нової Пошти
				if (order.deliveryAddress.npCityName) {
					summary += `${order.deliveryAddress.npCityName}`;
				}
				if (order.deliveryAddress.npWarehouse) {
					summary += `, НП №${order.deliveryAddress.npWarehouse}`;
				}
			} else {
				// Звичайна адреса доставки
				if (order.deliveryAddress.city) {
					summary += `${order.deliveryAddress.city}`;
				}
				if (order.deliveryAddress.street) {
					summary += `, ${order.deliveryAddress.street}`;
				}
			}
			summary += `\n`;
		}

		if (order.notes) {
			summary += `📝 Примітки: ${order.notes}\n`;
		}

		summary += `\n─────────────\n\n`;

		return summary;
	}

	private formatOrderDetails(order: Order): string {
		const statusEmoji = this.getStatusEmoji(order.status);
		const createDate = new Date(order.createdAt).toLocaleDateString('uk-UA');
		const total = (order.total / 100).toFixed(2);

		let message = `${statusEmoji} *ЗАМОВЛЕННЯ ${order.id}*\n\n`;
		message += `📅 Створено: ${createDate}\n`;
		message += `📊 Статус: ${this.getStatusText(order.status)}\n`;
		message += `💰 Сумма: ${total} ₴\n\n`;

		message += `📦 *Товари:*\n`;
		order.items?.forEach((item, index) => {
			const price = (item.price / 100).toFixed(2);
			const itemTotal = (item.total / 100).toFixed(2);
			message += `${index + 1}. ${item.productName}\n`;
			message += `   ${item.quantity} шт.. × ${price} ₴ = ${itemTotal} ₴\n`;
		});

		if (order.deliveryAddress) {
			message += `\n🏠 *Адреса доставки:*\n`;

			// Перевіряємо, чи це адреса Нової Пошти
			if (
				order.deliveryAddress.npWarehouse ||
				order.deliveryAddress.npCityName ||
				order.deliveryAddress.useNovaPost
			) {
				// Адреса Нової Пошти
				if (order.deliveryAddress.npCityFullName) {
					message += `${order.deliveryAddress.npCityFullName}\n`;
				}
				if (order.deliveryAddress.npWarehouse) {
					message += `Відділення Нової Пошти №${order.deliveryAddress.npWarehouse}\n`;
				}
				if (order.deliveryAddress.name && order.deliveryAddress.name !== 'Нова Пошта') {
					message += `Отримувач: ${order.deliveryAddress.name}\n`;
				}
			} else {
				// Звичайна адреса доставки
				if (order.deliveryAddress.street) {
					message += `${order.deliveryAddress.street}\n`;
				}
				if (order.deliveryAddress.city) {
					message += `${order.deliveryAddress.city}\n`;
				}
				if (order.deliveryAddress.postalCode) {
					message += `${order.deliveryAddress.postalCode}\n`;
				}
				if (order.deliveryAddress.name) {
					message += `Отримувач: ${order.deliveryAddress.name}\n`;
				}
			}
		}

		if (order.notes) {
			message += `\n📝 *Примітки:* ${order.notes}\n`;
		}

		return message;
	}

	private getStatusEmoji(status: OrderStatus): string {
		switch (status) {
			case 'pending':
				return '⏳';
			case 'confirmed':
				return '✅';
			case 'shipped':
				return '📦';
			case 'delivered':
				return '🚚';
			case 'cancelled':
				return '❌';
			default:
				return '❓';
		}
	}

	private getStatusText(status: OrderStatus): string {
		switch (status) {
			case 'pending':
				return 'Очікує підтвердження';
			case 'confirmed':
				return 'Підтверджено';
			case 'shipped':
				return 'Відправлено';
			case 'delivered':
				return 'Доставлено';
			case 'cancelled':
				return 'Скасовано';
			default:
				return status;
		}
	}

	// Отримати кнопки дій для замовлення залежно від статусу
	private getOrderActionButtons(orderId: string, currentStatus: OrderStatus): any[] {
		const buttons = [];

		switch (currentStatus) {
			case 'pending':
				buttons.push(
					{ text: '✅ Підтвердити', callback_data: `confirm_${orderId}` },
					{ text: '❌ Скасувати', callback_data: `cancel_${orderId}` }
				);
				break;
			case 'confirmed':
				buttons.push(
					{ text: '📦 Відправити', callback_data: `ship_${orderId}` },
					{ text: '❌ Скасувати', callback_data: `cancel_${orderId}` }
				);
				break;
			case 'shipped':
				buttons.push({ text: '🚚 Доставлено', callback_data: `deliver_${orderId}` });
				break;
			case 'delivered':
			case 'cancelled':
				// Для завершених замовлень показуємо тільки деталі
				buttons.push({ text: '📋 Деталі', callback_data: `details_${orderId}` });
				break;
		}

		return buttons;
	}

	// Надіслати головне меню
	private async sendMainMenu(chatId: number): Promise<void> {
		const welcomeMessage = `
🤖 *Balance Botanica Order Management Bot*

🚀 *Обери дію:*
		`;

		const mainMenu = {
			inline_keyboard: [
				[
					{ text: '⏳ Очікують', callback_data: 'status_pending' },
					{ text: '✅ Підтверджені', callback_data: 'status_confirmed' }
				],
				[{ text: '🎫 Промокоди', callback_data: 'promo_menu' }],
				[
					{ text: '📦 Відправлені', callback_data: 'status_shipped' },
					{ text: '🚚 Доставлені', callback_data: 'status_delivered' }
				],
				[
					{ text: '❌ Скасовані', callback_data: 'status_cancelled' },
					{ text: '📋 Всі закази', callback_data: 'all_orders' }
				]
			]
		};

		this.bot.sendMessage(chatId, welcomeMessage, {
			parse_mode: 'Markdown',
			reply_markup: mainMenu
		});
	}

	// Метод для отправки уведомления о новом заказе
	async notifyNewOrder(order: Order): Promise<void> {
		console.log('[TelegramBot] notifyNewOrder called for order:', order.id);
		console.log('[TelegramBot] Current adminChatId:', this.adminChatId);

		if (!this.adminChatId) {
			console.log('[TelegramBot] ❌ Admin chat ID not set, skipping notification');
			console.log('[TelegramBot] 💡 Make sure to send /start to the bot first');
			return;
		}

		console.log('[TelegramBot] ✅ Admin chat ID found, sending notification...');

		const total = (order.total / 100).toFixed(2);
		const createDate = new Date(order.createdAt).toLocaleString('uk-UA');

		let message = `🆕 *НОВЫЙ ЗАКАЗ ${order.id}*\n\n`;
		message += `📅 Время: ${createDate}\n`;
		message += `👤 Клиент: ${order.customerName || order.userId}\n`;
		message += `📞 Телефон: ${order.customerPhone || 'Не указан'}\n`;
		message += `💰 Сумма: ${total} ₴\n`;
		message += `📦 Товаров: ${order.items?.length || 0}\n\n`;

		// Добавляем информацию о товарах
		if (order.items && order.items.length > 0) {
			message += `🛒 *Состав замовлення:*\n`;
			order.items.forEach((item, index) => {
				const price = (item.price / 100).toFixed(2);
				message += `${index + 1}. ${item.productName}\n`;
				message += `   ${item.quantity} шт.. × ${price} ₴\n`;
			});
			message += '\n';
		}

		// Добавляем адрес доставки если есть
		if (order.deliveryAddress) {
			message += `🏠 *Доставка:*\n`;
			if (typeof order.deliveryAddress === 'string') {
				// Если адрес - строка, показываем первые 100 символов
				const shortAddress =
					order.deliveryAddress.length > 100
						? order.deliveryAddress.substring(0, 100) + '...'
						: order.deliveryAddress;
				message += `${shortAddress}\n`;
			} else {
				// Если адрес - объект
				if (order.deliveryAddress.npWarehouse) {
					message += `Нова Пошт.а №${order.deliveryAddress.npWarehouse}\n`;
				} else if (order.deliveryAddress.street) {
					message += `${order.deliveryAddress.street}, ${order.deliveryAddress.city}\n`;
				}
			}
			message += '\n';
		}

		message += `⚡ *Требуется подтверждение!*`;

		const inlineKeyboard = {
			inline_keyboard: [
				[
					{ text: '✅ Підтвердити', callback_data: `confirm_${order.id}` },
					{ text: '📋 Детали', callback_data: `details_${order.id}` }
				],
				[{ text: '❌ Скасувати', callback_data: `cancel_${order.id}` }]
			]
		};

		try {
			const result = await this.bot.sendMessage(this.adminChatId, message, {
				parse_mode: 'Markdown',
				reply_markup: inlineKeyboard
			});
			console.log('[TelegramBot] ✅ Notification sent successfully to chat:', this.adminChatId);
			console.log('[TelegramBot] 📨 Message details:', {
				messageId: result.message_id,
				chatId: result.chat.id,
				orderId: order.id
			});
		} catch (error) {
			console.error('[TelegramBot] ❌ Failed to send new order notification:', error);
			console.error('[TelegramBot] 🔍 Error details:', {
				adminChatId: this.adminChatId,
				orderId: order.id,
				messageLength: message.length,
				error: error instanceof Error ? error.message : String(error)
			});
		}
	}

	// Метод для установки ID чата админа (нужно вызвать после первого сообщения боту)
	setAdminChatId(chatId: string): void {
		this.adminChatId = chatId;
		console.log('Admin chat ID set:', chatId);
		// Сохраняем в файл
		this.saveAdminChatId(chatId);
	}

	// Метод для получения ID чата админа
	getAdminChatId(): string | null {
		return this.adminChatId;
	}

	// Метод для проверки статуса бота
	getBotStatus(): object {
		return {
			adminChatId: this.adminChatId,
			botToken: this.bot ? '✅ Set' : '❌ Not set',
			isPolling: false, // В нашем случае polling управляется снаружи
			fileExists: this.checkAdminChatIdFile()
		};
	}

	// Проверка существования файла с adminChatId
	private checkAdminChatIdFile(): boolean {
		try {
			const { readFileSync } = require('fs');
			const { join } = require('path');
			const filePath = join(process.cwd(), 'admin-chat-id.json');
			readFileSync(filePath);
			return true;
		} catch {
			return false;
		}
	}

	// Метод для тестирования отправки сообщения
	async testNotification(): Promise<boolean> {
		console.log('[TelegramBot] 🧪 Testing notification...');

		if (!this.adminChatId) {
			console.log('[TelegramBot] ❌ Cannot test: adminChatId not set');
			return false;
		}

		try {
			const testMessage = `🧪 *ТЕСТОВОЕ УВЕДОМЛЕНИЕ*\n\nВремя: ${new Date().toLocaleString('uk-UA')}\n\nЭто тестовое сообщение для проверки работы бота.`;

			const result = await this.bot.sendMessage(this.adminChatId, testMessage, {
				parse_mode: 'Markdown'
			});

			console.log('[TelegramBot] ✅ Test notification sent successfully!');
			console.log('[TelegramBot] 📨 Test message ID:', result.message_id);
			return true;
		} catch (error) {
			console.error('[TelegramBot] ❌ Test notification failed:', error);
			return false;
		}
	}

	// Сохраняем adminChatId в файл
	private saveAdminChatId(chatId: string): void {
		try {
			const filePath = join(process.cwd(), 'admin-chat-id.json');
			writeFileSync(filePath, JSON.stringify({ adminChatId: chatId }, null, 2));
			console.log('[TelegramBot] Admin chat ID saved to file');
		} catch (error) {
			console.error('[TelegramBot] Failed to save admin chat ID:', error);
		}
	}

	// Загружаем adminChatId из файла
	private loadAdminChatId(): void {
		try {
			const filePath = join(process.cwd(), 'admin-chat-id.json');
			const data = readFileSync(filePath, 'utf8');
			const parsed = JSON.parse(data);
			if (parsed.adminChatId) {
				this.adminChatId = parsed.adminChatId;
				console.log('[TelegramBot] Admin chat ID loaded from file:', this.adminChatId);
			}
		} catch (error) {
			// Файл не существует или поврежден - это нормально для первого запуска
			console.log('[TelegramBot] No saved admin chat ID found (this is normal)');
		}
	}

	// === ПРОМОКОДИ - МЕТОДЫ УПРАВЛЕНИЯ ===

	private async sendPromoMenu(chatId: number): Promise<void> {
		const promoMenu = {
			inline_keyboard: [
				[
					{ text: '➕ Створити промокод', callback_data: 'create_promo' },
					{ text: '📋 Список промокодів', callback_data: 'list_promos' }
				],
				[
					{ text: '🗑️ Видалити промокод', callback_data: 'delete_promo' },
					{ text: '📊 Статистика', callback_data: 'promo_stats' }
				],
				[{ text: '⬅️ Назад', callback_data: 'back_menu' }]
			]
		};

		this.bot.sendMessage(chatId, '🎫 *Управління промокодами*\n\nОберіть дію:', {
			parse_mode: 'Markdown',
			reply_markup: promoMenu
		});
	}

	private async sendPromoList(chatId: number): Promise<void> {
		try {
			const promoCodes = await this.promoCodeService.getAllPromoCodes();

			if (promoCodes.length === 0) {
				this.bot.sendMessage(chatId, '📭 Немає активних промокодів', {
					reply_markup: {
						inline_keyboard: [[{ text: '⬅️ Назад', callback_data: 'promo_menu' }]]
					}
				});
				return;
			}

			let message = '🎫 *Список промокодів:*\n\n';

			for (const [index, promo] of promoCodes.entries()) {
				const status = promo.isActive ? '✅' : '❌';
				const discount =
					promo.discountType === 'percentage'
						? `${promo.discountValue}%`
						: promo.discountType === 'fixed'
							? `₴${promo.discountValue}`
							: 'Безкоштовна доставка';

				message += `${index + 1}. *${promo.code}* ${status}\n`;
				message += `   Знижка: ${discount}\n`;
				message += `   Використано: ${promo.usageCount || 0}`;
				if (promo.usageLimit) message += `/${promo.usageLimit}`;
				message += '\n';

				if (promo.expiresAt) {
					const expiry = new Date(promo.expiresAt).toLocaleDateString('uk-UA');
					message += `   Діє до: ${expiry}\n`;
				}

				message += '\n';
			}

			const keyboard = {
				inline_keyboard: [
					[{ text: '➕ Створити новий', callback_data: 'create_promo' }],
					[{ text: '⬅️ Назад', callback_data: 'promo_menu' }]
				]
			};

			this.bot.sendMessage(chatId, message, {
				parse_mode: 'Markdown',
				reply_markup: keyboard
			});
		} catch (error) {
			console.error('Error sending promo list:', error);
			this.bot.sendMessage(chatId, '❌ Помилка завантаження списку промокодів');
		}
	}

	private async sendPromoStats(chatId: number): Promise<void> {
		try {
			const promoCodes = await this.promoCodeService.getAllPromoCodes();

			let totalCodes = promoCodes.length;
			let activeCodes = promoCodes.filter((p) => p.isActive).length;
			let totalUsage = promoCodes.reduce((sum, p) => sum + (p.usageCount || 0), 0);
			let expiredCodes = promoCodes.filter(
				(p) => p.expiresAt && new Date(p.expiresAt) < new Date()
			).length;

			let message = '📊 *Статистика промокодів*\n\n';
			message += `📋 Загальна кількість: ${totalCodes}\n`;
			message += `✅ Активних: ${activeCodes}\n`;
			message += `❌ Прострочених: ${expiredCodes}\n`;
			message += `🎯 Загальна кількість використань: ${totalUsage}\n\n`;

			if (promoCodes.length > 0) {
				message += '*Топ промокодів:*\n';
				const topPromos = promoCodes
					.sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
					.slice(0, 5);

				for (const promo of topPromos) {
					message += `• ${promo.code}: ${promo.usageCount || 0} використань\n`;
				}
			}

			this.bot.sendMessage(chatId, message, {
				parse_mode: 'Markdown',
				reply_markup: {
					inline_keyboard: [[{ text: '⬅️ Назад', callback_data: 'promo_menu' }]]
				}
			});
		} catch (error) {
			console.error('Error sending promo stats:', error);
			this.bot.sendMessage(chatId, '❌ Помилка завантаження статистики');
		}
	}

	private async processPromoData(chatId: number, text: string): Promise<void> {
		try {
			// Clear user state
			this.userStates.delete(chatId);

			// Parse promo data: Code,Type,Value[,MinAmount][,Limit][,Deadline]
			const parts = text.split(',').map((p) => p.trim());

			if (parts.length < 3) {
				this.bot.sendMessage(
					chatId,
					'❌ Неправильний формат. Використовуйте: Код,Тип,Значення[,Мін.сума][,Ліміт][,Дедлайн]'
				);
				return;
			}

			const [code, type, valueStr, minAmountStr, limitStr, deadlineStr] = parts;

			// Validate type
			if (!['percentage', 'fixed', 'free_shipping'].includes(type)) {
				this.bot.sendMessage(
					chatId,
					'❌ Неправильний тип. Доступні: percentage, fixed, free_shipping'
				);
				return;
			}

			// Validate value
			const value = parseFloat(valueStr);
			if (isNaN(value) || value < 0) {
				this.bot.sendMessage(chatId, '❌ Неправильне значення знижки');
				return;
			}

			// Parse optional parameters
			const minAmount = minAmountStr ? parseFloat(minAmountStr) : 0;
			const limit = limitStr ? parseInt(limitStr) : undefined;
			const deadline = deadlineStr ? new Date(deadlineStr) : undefined;

			// Create promo code
			const promoData = {
				code: code.toUpperCase(),
				discountType: type as 'percentage' | 'fixed' | 'free_shipping',
				discountValue: value,
				minimumAmount: minAmount || undefined,
				usageLimit: limit || undefined,
				expiresAt: deadline || undefined,
				isActive: true
			};

			const promoCode = await this.promoCodeService.createPromoCode(promoData);

			let message = '✅ *Промокод створено успішно!*\n\n';
			message += `🎫 Код: *${promoCode.code}*\n`;
			message += `💰 Знижка: ${type === 'percentage' ? `${value}%` : type === 'fixed' ? `₴${value}` : 'Безкоштовна доставка'}\n`;

			if (minAmount > 0) message += `📦 Мін. сума: ₴${minAmount}\n`;
			if (limit) message += `🔢 Ліміт використань: ${limit}\n`;
			if (deadline) message += `📅 Діє до: ${deadline.toLocaleDateString('uk-UA')}\n`;

			this.bot.sendMessage(chatId, message, {
				parse_mode: 'Markdown',
				reply_markup: {
					inline_keyboard: [
						[{ text: '➕ Створити ще один', callback_data: 'create_promo' }],
						[{ text: '📋 Переглянути список', callback_data: 'list_promos' }],
						[{ text: '⬅️ Назад до меню', callback_data: 'promo_menu' }]
					]
				}
			});
		} catch (error) {
			console.error('Error processing promo data:', error);
			this.bot.sendMessage(
				chatId,
				'❌ Помилка створення промокоду. Перевірте дані та спробуйте ще раз.'
			);
		}
	}

	private async sendDeletePromoList(chatId: number): Promise<void> {
		try {
			const promoCodes = await this.promoCodeService.getAllPromoCodes();

			if (promoCodes.length === 0) {
				this.bot.sendMessage(chatId, '📭 Немає промокодів для видалення', {
					reply_markup: {
						inline_keyboard: [[{ text: '⬅️ Назад', callback_data: 'promo_menu' }]]
					}
				});
				return;
			}

			let message = '🗑️ *Видалення промокодів*\n\nОберіть промокод для видалення:\n\n';

			const inlineKeyboard: any[][] = [];

			for (const promo of promoCodes) {
				const discount =
					promo.discountType === 'percentage'
						? `${promo.discountValue}%`
						: promo.discountType === 'fixed'
							? `₴${promo.discountValue}`
							: 'Безкоштовна доставка';

				message += `• *${promo.code}* - ${discount}`;
				if (promo.usageCount && promo.usageCount > 0) {
					message += ` (${promo.usageCount} використань)`;
				}
				message += '\n';

				inlineKeyboard.push([
					{
						text: `🗑️ ${promo.code}`,
						callback_data: `confirm_delete_${promo.code}`
					}
				]);
			}

			inlineKeyboard.push([{ text: '⬅️ Назад', callback_data: 'promo_menu' }]);

			this.bot.sendMessage(chatId, message, {
				parse_mode: 'Markdown',
				reply_markup: { inline_keyboard: inlineKeyboard }
			});
		} catch (error) {
			console.error('Error sending delete promo list:', error);
			this.bot.sendMessage(chatId, '❌ Помилка завантаження списку промокодів');
		}
	}

	private async confirmDeletePromo(chatId: number, promoCode: string): Promise<void> {
		try {
			const promo = await this.promoCodeService.getPromoCodeByCode(promoCode);

			if (!promo) {
				this.bot.sendMessage(chatId, `❌ Промокод *${promoCode}* не знайдено`, {
					parse_mode: 'Markdown',
					reply_markup: {
						inline_keyboard: [[{ text: '⬅️ Назад', callback_data: 'delete_promo' }]]
					}
				});
				return;
			}

			const discount =
				promo.discountType === 'percentage'
					? `${promo.discountValue}%`
					: promo.discountType === 'fixed'
						? `₴${promo.discountValue}`
						: 'Безкоштовна доставка';

			let confirmMessage = `⚠️ *ВИ СИГУРНІ, ЩО ХОЧЕТЕ ВИДАЛИТИ ПРОМОКОД?*\n\n`;
			confirmMessage += `🎫 Код: *${promo.code}*\n`;
			confirmMessage += `💰 Знижка: ${discount}\n`;

			if (promo.usageCount && promo.usageCount > 0) {
				confirmMessage += `📊 Використано: ${promo.usageCount} разів\n`;
			}

			if (promo.usageLimit) {
				confirmMessage += `🔢 Ліміт: ${promo.usageLimit}\n`;
			}

			confirmMessage += `\n❌ Цю дію неможливо буде скасувати!`;

			const confirmKeyboard = {
				inline_keyboard: [
					[
						{ text: '✅ ТАК, ВИДАЛИТИ', callback_data: `delete_confirmed_${promo.code}` },
						{ text: '❌ НІ, СКАСУВАТИ', callback_data: 'delete_promo' }
					]
				]
			};

			this.bot.sendMessage(chatId, confirmMessage, {
				parse_mode: 'Markdown',
				reply_markup: confirmKeyboard
			});
		} catch (error) {
			console.error('Error confirming delete promo:', error);
			this.bot.sendMessage(chatId, '❌ Помилка підтвердження видалення промокоду');
		}
	}

	private async deletePromoCode(chatId: number, promoCode: string): Promise<void> {
		try {
			const success = await this.promoCodeService.deletePromoCodeByCode(promoCode);

			if (success) {
				this.bot.sendMessage(chatId, `✅ Промокод *${promoCode}* успішно видалено!`, {
					parse_mode: 'Markdown',
					reply_markup: {
						inline_keyboard: [
							[{ text: '🗑️ Видалити ще один', callback_data: 'delete_promo' }],
							[{ text: '⬅️ До меню промокодів', callback_data: 'promo_menu' }]
						]
					}
				});
			} else {
				this.bot.sendMessage(chatId, `❌ Не вдалося видалити промокод *${promoCode}*`, {
					parse_mode: 'Markdown',
					reply_markup: {
						inline_keyboard: [[{ text: '⬅️ Назад', callback_data: 'delete_promo' }]]
					}
				});
			}
		} catch (error) {
			console.error('Error deleting promo code:', error);
			this.bot.sendMessage(chatId, `❌ Помилка видалення промокоду *${promoCode}*`, {
				parse_mode: 'Markdown'
			});
		}
	}

	// Валідація переходів статусів замовлень
	private isValidStatusTransition(currentStatus: OrderStatus, newStatus: OrderStatus): boolean {
		// Дозволені переходи статусів (не можна перепрыгивать)
		const validTransitions: Record<OrderStatus, OrderStatus[]> = {
			pending: ['confirmed', 'cancelled'], // Очікує -> Підтверджено або Скасовано
			confirmed: ['shipped', 'cancelled'], // Підтверджено -> Відправлено або Скасовано
			shipped: ['delivered'], // Відправлено -> Доставлено
			delivered: [], // Доставлено - кінцевий статус
			cancelled: [] // Скасовано - кінцевий статус
		};

		return validTransitions[currentStatus]?.includes(newStatus) || false;
	}

	// Повідомлення про помилку при недозволеному переході статусу
	private getStatusTransitionErrorMessage(
		currentStatus: OrderStatus,
		newStatus: OrderStatus
	): string {
		const statusNames = {
			pending: 'Очікує підтвердження',
			confirmed: 'Підтверджено',
			shipped: 'Відправлено',
			delivered: 'Доставлено',
			cancelled: 'Скасовано'
		};

		const currentName = statusNames[currentStatus];
		const newName = statusNames[newStatus];

		let message = `❌ *Недозволений перехід статусу!*\n\n`;
		message += `Поточний статус: *${currentName}*\n`;
		message += `Бажаний статус: *${newName}*\n\n`;

		// Даємо підказку про правильну послідовність
		switch (currentStatus) {
			case 'pending':
				message += `💡 Спочатку потрібно *підтвердити* замовлення, потім можна відправити або скасувати.`;
				break;
			case 'confirmed':
				message += `💡 Спочатку потрібно *відправити* замовлення, потім можна позначити як доставлене.`;
				break;
			case 'shipped':
				message += `💡 Замовлення вже відправлено. Тепер можна тільки позначити як доставлене.`;
				break;
			case 'delivered':
			case 'cancelled':
				message += `💡 Цей статус є кінцевим і не може бути змінений.`;
				break;
		}

		return message;
	}
}
