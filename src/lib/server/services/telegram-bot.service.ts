// node-telegram-bot-api does not have bundled types, so we import as below to avoid lint errors
// If @types/node-telegram-bot-api is not available, add a custom .d.ts file as a fallback
// See: https://github.com/yagop/node-telegram-bot-api/issues/319
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import TelegramBot from 'node-telegram-bot-api';
import { OrderService } from '../application/services/order.service';
import { GoogleSheetsService } from './google-sheets.service';
import type { Order, OrderStatus } from '../domain/interfaces/order.interface';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface UserState {
	awaitingOrderId: boolean;
	awaitingTTN?: boolean;
	action?: 'confirm' | 'cancel' | 'ship' | 'deliver';
	orderId?: string;
}

export class TelegramBotService {
	private bot: TelegramBot;
	private orderService: OrderService;
	private sheetsService: GoogleSheetsService;
	private adminChatId: string | null = null;
	private userStates: Map<number, UserState> = new Map();

	constructor(autoStartPolling = false) {
		const botToken =
			process.env.TELEGRAM_BOT_TOKEN || '8343800455:AAGk9NjKvopbJoGsRfl-Tkv3Rg9kh4qqDfI';

		if (!botToken) {
			throw new Error('TELEGRAM_BOT_TOKEN is required. Please set it in .env file');
		}

		this.bot = new TelegramBot(botToken, { polling: false }); // Отключаем авто-polling
		this.orderService = new OrderService();
		this.sheetsService = new GoogleSheetsService();

		// Загружаем сохраненный adminChatId
		this.loadAdminChatId();

		this.setupCommands();
		this.setupCallbacks();
		this.setupTextHandler();

		// Запускаем polling только если явно указано
		if (autoStartPolling) {
			this.startPolling();
		}
	}

	// Метод для запуска polling вручную
	startPolling(): void {
		console.log('[TelegramBot] Starting polling manually...');
		this.bot.startPolling();
	}

	private setupCommands(): void {
		// Команда /start
		this.bot.onText(/\/start/, (msg: TelegramBot.Message) => {
			const chatId = msg.chat.id;
			const username = msg.from?.username;

			// Проверяем, что это разрешенный пользователь
			if (username !== 'qq5756853') {
				this.bot.sendMessage(
					chatId,
					'❌ Доступ запрещен. Этот бот предназначен только для администратора.'
				);
				console.log(`[TelegramBot] Access denied for user: @${username} (ID: ${msg.from?.id})`);
				return;
			}

			// Устанавливаем adminChatId при первом запуске
			if (!this.adminChatId) {
				this.setAdminChatId(chatId.toString());
				console.log(`[TelegramBot] Admin chat ID set: ${chatId} for user @${username}`);
			}

			const welcomeMessage = `
🤖 *Balance Botanica Order Management Bot*

Привет! Я помогу тебе управлять заказами с телефона.

🚀 *Выбери действие:*
			`;

			const mainMenu = {
				inline_keyboard: [
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
						{ text: '📋 Всі закази', callback_data: 'all_orders' }
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

			// Проверяем доступ
			if (username !== 'qq5756853') {
				this.bot.sendMessage(chatId, '❌ Доступ запрещен.');
				return;
			}

			const helpMessage = `
📖 *Справка по командам:*

🔹 /orders - Показать все заказы
🔹 /pending - Заказы в ожидании подтверждения
🔹 /confirmed - Подтвержденные заказы
🔹 /shipped - Отправленные заказы
🔹 /delivered - Доставленные заказы
🔹 /cancelled - Отмененные заказы

🔹 /status [ID] [статус] - Обновить статус заказа
   *Примеры:*
   \`/status 123456 confirmed\`
   \`/status 123456 shipped\`
   \`/status 123456 delivered\`

📊 *Статусы заказов:*
• pending - Очікує підтвердження
• confirmed - Підтверджено
• shipped - Відправлено
• delivered - Доставлено
• cancelled - Скасовано

💡 *Советы:*
• Используй inline кнопки для быстрого управления
• Все изменения синхронизируются с Google Sheets
• Новые заказы приходят автоматически
			`;

			this.bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
		});

		// Команда /orders - показать все заказы
		this.bot.onText(/\/orders/, async (msg: TelegramBot.Message) => {
			const chatId = msg.chat.id;
			const username = msg.from?.username;

			// Проверяем доступ
			if (username !== 'qq5756853') {
				this.bot.sendMessage(chatId, '❌ Доступ запрещен.');
				return;
			}

			await this.sendOrdersList(chatId);
		});

		// Команды по статусам
		this.bot.onText(/\/pending/, async (msg: TelegramBot.Message) => {
			const chatId = msg.chat.id;
			const username = msg.from?.username;

			if (username !== 'qq5756853') {
				this.bot.sendMessage(chatId, '❌ Доступ запрещен.');
				return;
			}

			await this.sendOrdersByStatus(chatId, 'pending');
		});

		this.bot.onText(/\/confirmed/, async (msg: TelegramBot.Message) => {
			const chatId = msg.chat.id;
			const username = msg.from?.username;

			if (username !== 'qq5756853') {
				this.bot.sendMessage(chatId, '❌ Доступ запрещен.');
				return;
			}

			await this.sendOrdersByStatus(chatId, 'confirmed');
		});

		this.bot.onText(/\/shipped/, async (msg: TelegramBot.Message) => {
			const chatId = msg.chat.id;
			const username = msg.from?.username;

			if (username !== 'qq5756853') {
				this.bot.sendMessage(chatId, '❌ Доступ запрещен.');
				return;
			}

			await this.sendOrdersByStatus(chatId, 'shipped');
		});

		this.bot.onText(/\/delivered/, async (msg: TelegramBot.Message) => {
			const chatId = msg.chat.id;
			const username = msg.from?.username;

			if (username !== 'qq5756853') {
				this.bot.sendMessage(chatId, '❌ Доступ запрещен.');
				return;
			}

			await this.sendOrdersByStatus(chatId, 'delivered');
		});

		this.bot.onText(/\/cancelled/, async (msg: TelegramBot.Message) => {
			const chatId = msg.chat.id;
			const username = msg.from?.username;

			if (username !== 'qq5756853') {
				this.bot.sendMessage(chatId, '❌ Доступ запрещен.');
				return;
			}

			await this.sendOrdersByStatus(chatId, 'cancelled');
		});

		// Команда /status для обновления статуса
		this.bot.onText(
			/\/status (.+)/,
			async (msg: TelegramBot.Message, match: RegExpExecArray | null) => {
				const chatId = msg.chat.id;
				const username = msg.from?.username;

				if (username !== 'qq5756853') {
					this.bot.sendMessage(chatId, '❌ Доступ запрещен.');
					return;
				}

				const params = match?.[1]?.split(' ');

				if (!params || params.length !== 2) {
					this.bot.sendMessage(
						chatId,
						'❌ Неверный формат команды. Используй: /status [ID] [статус]'
					);
					return;
				}

				const [orderId, newStatus] = params;
				await this.updateOrderStatus(chatId, orderId, newStatus as OrderStatus);
			}
		);

		// Команда /cancel для отмены текущей операции
		this.bot.onText(/\/cancel/, (msg: TelegramBot.Message) => {
			const chatId = msg.chat.id;
			const username = msg.from?.username;

			if (username !== 'qq5756853') {
				this.bot.sendMessage(chatId, '❌ Доступ запрещен.');
				return;
			}

			this.userStates.delete(chatId);
			this.bot.sendMessage(chatId, '❌ Операция отменена.');
		});
	}

	private setupCallbacks(): void {
		// Обработка inline кнопок
		this.bot.on('callback_query', async (query: TelegramBot.CallbackQuery) => {
			const chatId = query.message?.chat.id;
			const data = query.data;
			const username = query.from?.username;

			if (!chatId || !data) return;

			// Проверяем доступ
			if (username !== 'qq5756853') {
				this.bot.answerCallbackQuery(query.id, { text: '❌ Доступ запрещен' });
				return;
			}

			// Разбор callback data
			const parts = data.split('_');
			const action = parts[0];
			const param1 = parts[1];
			const param2 = parts[2];

			try {
				switch (action) {
					// Меню статусов
					case 'status':
						await this.sendOrdersByStatus(chatId, param1 as OrderStatus);
						break;
					case 'all':
						if (param1 === 'orders') {
							await this.sendOrdersList(chatId);
						}
						break;

					// Действия с заказами
					case 'confirm':
						await this.updateOrderStatus(chatId, param1, 'confirmed');
						break;
					case 'ship':
						// Для отправки заказа запрашиваем ТТН
						this.userStates.set(chatId, {
							awaitingOrderId: false,
							awaitingTTN: true,
							action: 'ship',
							orderId: param1
						});

						const cancelKeyboard = {
							inline_keyboard: [[{ text: '❌ Отмена', callback_data: 'cancel_operation' }]]
						};
						this.bot.sendMessage(
							chatId,
							`📦 Введіть ТТН накладної Нової Пошти для заказа ${param1}:`,
							{
								reply_markup: cancelKeyboard
							}
						);
						break;
					case 'deliver':
						await this.updateOrderStatus(chatId, param1, 'delivered');
						break;
					case 'cancel':
						await this.updateOrderStatus(chatId, param1, 'cancelled');
						break;
					case 'details':
						await this.sendOrderDetails(chatId, param1);
						break;

					// Навигация
					case 'back':
					case 'menu':
						await this.sendMainMenu(chatId);
						break;
					case 'refresh':
						if (param1 === 'orders') {
							await this.sendOrdersList(chatId);
						}
						break;

					// Новые действия с заказами
					case 'action':
						await this.handleOrderAction(chatId, param1);
						break;

					// Отмена операции
					case 'cancel':
						if (param1 === 'operation') {
							this.userStates.delete(chatId);
							this.bot.sendMessage(chatId, '❌ Операция отменена.');
							await this.sendOrdersList(chatId);
						}
						break;
				}

				// Убрать loading состояние кнопки
				this.bot.answerCallbackQuery(query.id);
			} catch (error) {
				console.error('Callback query error:', error);
				this.bot.answerCallbackQuery(query.id, { text: '❌ Ошибка выполнения действия' });
			}
		});
	}

	private setupTextHandler(): void {
		// Обработка текстовых сообщений для ввода ID заказа и ТТН
		this.bot.on('message', async (msg: TelegramBot.Message) => {
			const chatId = msg.chat.id;
			const text = msg.text;
			const username = msg.from?.username;

			if (!text) return;

			// Проверяем доступ
			if (username !== 'qq5756853') {
				return; // Тихо игнорируем сообщения от других пользователей
			}

			if (!this.adminChatId || chatId.toString() !== this.adminChatId) {
				return;
			}

			// Проверяем состояние пользователя
			const userState = this.userStates.get(chatId);
			if (!userState) return;

			// Если пользователь ждет ТТН
			if (userState.awaitingTTN && userState.orderId) {
				await this.processTTN(chatId, text.trim(), userState.orderId);
				return;
			}

			// Если пользователь ждет ID заказа
			if (userState.awaitingOrderId && userState.action) {
				await this.processOrderId(chatId, text.trim(), userState.action);
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
			inline_keyboard: [[{ text: '❌ Отмена', callback_data: 'cancel_operation' }]]
		};
		this.bot.sendMessage(chatId, `📝 Введіть ID заказа для ${actionText}:`, {
			reply_markup: cancelKeyboard
		});
	}

	private async processOrderId(
		chatId: number,
		orderId: string,
		action: 'confirm' | 'cancel' | 'ship' | 'deliver'
	): Promise<void> {
		try {
			// Для отправки заказа сначала запрашиваем ТТН
			if (action === 'ship') {
				this.userStates.set(chatId, {
					awaitingOrderId: false,
					awaitingTTN: true,
					action: 'ship',
					orderId: orderId
				});

				const cancelKeyboard = {
					inline_keyboard: [[{ text: '❌ Отмена', callback_data: 'cancel_operation' }]]
				};
				this.bot.sendMessage(
					chatId,
					`📦 Введіть ТТН накладної Нової Пошти для заказа ${orderId}:`,
					{
						reply_markup: cancelKeyboard
					}
				);
				return;
			}

			// Для остальных действий сразу обновляем статус
			this.userStates.delete(chatId);

			// Определяем новый статус
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
			this.bot.sendMessage(chatId, '❌ Ошибка обработки ID заказа. Попробуйте еще раз.');
			this.userStates.delete(chatId);
		}
	}

	private async processTTN(chatId: number, ttn: string, orderId: string): Promise<void> {
		try {
			// Очищаем состояние пользователя
			this.userStates.delete(chatId);

			// Валидация ТТН (должен быть числом из 14 цифр)
			if (!/^\d{14}$/.test(ttn)) {
				this.bot.sendMessage(chatId, '❌ ТТН должен содержать 14 цифр. Попробуйте еще раз.');
				return;
			}

			console.log(`[TelegramBot] Shipping order ${orderId} with TTN: ${ttn}`);

			// Обновляем статус заказа на shipped
			await this.updateOrderStatus(chatId, orderId, 'shipped');

			// Синхронизируем ТТН с Google Sheets
			try {
				await this.sheetsService.updateOrderTTN(orderId, ttn);
				console.log(`[TelegramBot] TTN ${ttn} synced to Google Sheets for order ${orderId}`);
			} catch (sheetsError) {
				console.error('[TelegramBot] Failed to sync TTN to Google Sheets:', sheetsError);
				// Не прерываем процесс, если Google Sheets недоступен
			}

			// Отправляем подтверждение с ТТН
			this.bot.sendMessage(
				chatId,
				`✅ Заказ ${orderId} успешно отмечен как отправленный!\n\n📦 ТТН: ${ttn}\n\nЗаказ ожидает доставки.`
			);
		} catch (error) {
			console.error('Failed to process TTN:', error);
			this.bot.sendMessage(chatId, '❌ Ошибка обработки ТТН. Попробуйте еще раз.');
		}
	}

	private async sendOrdersList(chatId: number): Promise<void> {
		try {
			this.bot.sendMessage(chatId, '📦 Загружаю заказы...');

			// Для админа получаем все заказы из базы данных
			const orders = await this.getAllOrdersForAdmin();

			if (orders.length === 0) {
				const emptyMessage = '📭 Нет активных заказов';
				const emptyKeyboard = {
					inline_keyboard: [
						[
							{ text: '✅ Підтвердити заказ', callback_data: 'action_confirm' },
							{ text: '❌ Скасувати заказ', callback_data: 'action_cancel' }
						],
						[{ text: '⬅️ Назад', callback_data: 'back_menu' }]
					]
				};

				this.bot.sendMessage(chatId, emptyMessage, { reply_markup: emptyKeyboard });
				return;
			}

			let message = `📋 *Все заказы (${orders.length}):*\n\n`;

			// Показываем все заказы с подробной информацией
			for (const order of orders) {
				message += this.formatOrderDetailedSummary(order);
			}

			// Кнопки управления заказами
			const inlineKeyboard = {
				inline_keyboard: [
					[
						{ text: '✅ Підтвердити заказ', callback_data: 'action_confirm' },
						{ text: '❌ Скасувати заказ', callback_data: 'action_cancel' }
					],
					[
						{ text: '📦 Відправити заказ', callback_data: 'action_ship' },
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
			this.bot.sendMessage(chatId, '❌ Ошибка загрузки заказов');
		}
	}

	// Получить все заказы для администратора
	private async getAllOrdersForAdmin(): Promise<Order[]> {
		try {
			console.log('[TelegramBot] Getting all orders for admin...');
			// Прямой запрос к базе данных для получения всех заказов
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
				const emptyMessage = `📭 Нет заказов со статусом "${this.getStatusText(status)}"`;
				const emptyKeyboard = {
					inline_keyboard: [
						[
							{ text: '✅ Підтвердити заказ', callback_data: 'action_confirm' },
							{ text: '❌ Скасувати заказ', callback_data: 'action_cancel' }
						],
						[{ text: '⬅️ Назад', callback_data: 'back_menu' }]
					]
				};

				this.bot.sendMessage(chatId, emptyMessage, { reply_markup: emptyKeyboard });
				return;
			}

			let message = `📋 *Заказы "${this.getStatusText(status)}" (${filteredOrders.length}):*\n\n`;

			// Показываем все заказы с подробной информацией
			for (const order of filteredOrders) {
				message += this.formatOrderDetailedSummary(order);
			}

			// Кнопки управления заказами
			const inlineKeyboard = {
				inline_keyboard: [
					[
						{ text: '✅ Підтвердити заказ', callback_data: 'action_confirm' },
						{ text: '❌ Скасувати заказ', callback_data: 'action_cancel' }
					],
					[
						{ text: '📦 Відправити заказ', callback_data: 'action_ship' },
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
			this.bot.sendMessage(chatId, '❌ Ошибка загрузки заказов');
		}
	}

	private async updateOrderStatus(
		chatId: number,
		orderId: string,
		status: OrderStatus
	): Promise<void> {
		try {
			console.log(`[TelegramBot] Starting order status update: ${orderId} -> ${status}`);

			// Обновить статус в БД
			const success = await this.orderService.updateOrderStatus(orderId, status);
			console.log(`[TelegramBot] OrderService.updateOrderStatus result: ${success}`);

			if (!success) {
				console.log(`[TelegramBot] OrderService returned false for order ${orderId}`);
				this.bot.sendMessage(chatId, `❌ Заказ ${orderId} не найден`);
				return;
			}

			console.log(`[TelegramBot] Order status update successful: ${orderId} -> ${status}`);

			// Обновить статус в Google Sheets
			await this.sheetsService.updateOrderStatus(orderId, status);

			const statusText = this.getStatusText(status);
			const message = `✅ Заказ *${orderId}* обновлен\n\n📊 Новый статус: *${statusText}*`;

			const successKeyboard = {
				inline_keyboard: [
					[
						{ text: '🔄 Продолжить работу', callback_data: 'back_menu' },
						{ text: '📋 Детали заказа', callback_data: `details_${orderId}` }
					]
				]
			};

			this.bot.sendMessage(chatId, message, {
				parse_mode: 'Markdown',
				reply_markup: successKeyboard
			});
		} catch (error) {
			console.error('Failed to update order status:', error);
			this.bot.sendMessage(chatId, `❌ Ошибка обновления статуса заказа ${orderId}`);
		}
	}

	private async sendOrderDetails(chatId: number, orderId: string): Promise<void> {
		try {
			const order = await this.orderService.getOrderById(orderId);

			if (!order) {
				this.bot.sendMessage(chatId, `❌ Заказ ${orderId} не найден`);
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
			this.bot.sendMessage(chatId, `❌ Ошибка загрузки деталей заказа ${orderId}`);
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

		let summary = `${statusEmoji} *ЗАКАЗ ${order.id}*\n`;
		summary += `📅 Дата: ${date}\n`;
		summary += `📊 Статус: ${statusText}\n`;
		summary += `💰 Сумма: ${total} ₴\n`;
		summary += `📦 Товаров: ${order.items?.length || 0}\n`;

		// Показываем товары
		if (order.items && order.items.length > 0) {
			summary += `🛍️ Товары:\n`;
			order.items.forEach((item, index) => {
				const price = (item.price / 100).toFixed(2);
				summary += `   ${index + 1}. ${item.productName} (${item.quantity}шт × ${price}₴)\n`;
			});
		}

		// Адрес доставки
		if (order.deliveryAddress) {
			summary += `🏠 Адрес: `;
			if (order.deliveryAddress.city) {
				summary += `${order.deliveryAddress.city}`;
			}
			if (order.deliveryAddress.street) {
				summary += `, ${order.deliveryAddress.street}`;
			}
			if (order.deliveryAddress.npWarehouse) {
				summary += ` (НП №${order.deliveryAddress.npWarehouse})`;
			}
			summary += `\n`;
		}

		if (order.notes) {
			summary += `📝 Примечания: ${order.notes}\n`;
		}

		summary += `\n─────────────\n\n`;

		return summary;
	}

	private formatOrderDetails(order: Order): string {
		const statusEmoji = this.getStatusEmoji(order.status);
		const createDate = new Date(order.createdAt).toLocaleDateString('uk-UA');
		const total = (order.total / 100).toFixed(2);

		let message = `${statusEmoji} *ЗАКАЗ ${order.id}*\n\n`;
		message += `📅 Создан: ${createDate}\n`;
		message += `📊 Статус: ${this.getStatusText(order.status)}\n`;
		message += `💰 Сумма: ${total} ₴\n\n`;

		message += `📦 *Товары:*\n`;
		order.items?.forEach((item, index) => {
			const price = (item.price / 100).toFixed(2);
			const itemTotal = (item.total / 100).toFixed(2);
			message += `${index + 1}. ${item.productName}\n`;
			message += `   ${item.quantity} шт. × ${price} ₴ = ${itemTotal} ₴\n`;
		});

		if (order.deliveryAddress) {
			message += `\n🏠 *Адрес доставки:*\n`;
			if (order.deliveryAddress.street) {
				message += `${order.deliveryAddress.street}\n`;
			}
			if (order.deliveryAddress.city) {
				message += `${order.deliveryAddress.city}\n`;
			}
			if (order.deliveryAddress.npWarehouse) {
				message += `Нова Пошта №${order.deliveryAddress.npWarehouse}\n`;
			}
		}

		if (order.notes) {
			message += `\n📝 *Примечания:* ${order.notes}\n`;
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

	// Получить кнопки действий для заказа в зависимости от статуса
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
				// Для завершенных заказов показываем только детали
				buttons.push({ text: '📋 Детали', callback_data: `details_${orderId}` });
				break;
		}

		return buttons;
	}

	// Отправить главное меню
	private async sendMainMenu(chatId: number): Promise<void> {
		const welcomeMessage = `
🤖 *Balance Botanica Order Management Bot*

🚀 *Выбери действие:*
		`;

		const mainMenu = {
			inline_keyboard: [
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
			message += `🛒 *Состав заказа:*\n`;
			order.items.forEach((item, index) => {
				const price = (item.price / 100).toFixed(2);
				message += `${index + 1}. ${item.productName}\n`;
				message += `   ${item.quantity} шт. × ${price} ₴\n`;
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
					message += `Нова Пошта №${order.deliveryAddress.npWarehouse}\n`;
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
}
