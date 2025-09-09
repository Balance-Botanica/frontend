import TelegramBot from 'node-telegram-bot-api';
import { IBotHandler } from '../interfaces/IBotHandler';
import { OrderService } from '../../application/services/order.service';
import { PromoCodeService } from '../../application/services/promo-code.service';
import type { OrderStatus } from '../../domain/interfaces/order.interface';

/**
 * Handles inline button callbacks
 */
export class CallbackHandler implements IBotHandler {
	private userStates: Map<number, any> = new Map();

	constructor(
		private bot: TelegramBot,
		private orderService: OrderService,
		private promoService: PromoCodeService
	) {}

	async handle(chatId: number, callbackData: string): Promise<void> {
		try {
			console.log(`[CallbackHandler] Processing: ${callbackData}`);

			const parts = callbackData.split('_');
			const action = parts[0];
			const param1 = parts[1];
			const param2 = parts[2];

			switch (action) {
				case 'show':
					await this.handleShowAction(chatId, param1);
					break;
				case 'status':
					await this.handleStatusAction(chatId, param1 as OrderStatus);
					break;
				case 'promo':
					await this.handlePromoAction(chatId, param1);
					break;
				case 'confirm':
					await this.handleConfirmAction(chatId, param1);
					break;
				case 'cancel':
					await this.handleCancelAction(chatId, param1);
					break;
				case 'ship':
					await this.handleShipAction(chatId, param1);
					break;
				case 'deliver':
					await this.handleDeliverAction(chatId, param1);
					break;
				case 'details':
					await this.handleDetailsAction(chatId, param1);
					break;
				case 'back':
					await this.handleBackAction(chatId);
					break;
				case 'action':
					await this.handleOrderAction(chatId, param1);
					break;
				default:
					console.log(`[CallbackHandler] Unknown action: ${action}`);
			}
		} catch (error) {
			console.error('[CallbackHandler] Error:', error);
			await this.bot.sendMessage(chatId, '❌ Помилка обробки дії');
		}
	}

	canHandle(data: any): boolean {
		// Handle callback data (not commands, not free text)
		return typeof data === 'string' && !data.startsWith('/') && data.includes('_');
	}

	getPriority(): number {
		return 5; // Medium priority
	}

	private async handleShowAction(chatId: number, param: string): Promise<void> {
		switch (param) {
			case 'orders':
				await this.showOrdersList(chatId);
				break;
			case 'help':
				await this.showHelp(chatId);
				break;
		}
	}

	private async handleOrderAction(chatId: number, action: string): Promise<void> {
		// Set user state to await order ID for the specified action
		this.userStates.set(chatId, {
			awaitingOrderId: true,
			action: action as 'confirm' | 'cancel' | 'ship' | 'deliver'
		});

		const actionText =
			{
				confirm: 'підтвердити',
				cancel: 'скасувати',
				ship: 'відправити',
				deliver: 'позначити як доставлений'
			}[action] || action;

		const cancelKeyboard = {
			inline_keyboard: [[{ text: '❌ Скасування', callback_data: 'cancel_operation' }]]
		};

		await this.bot.sendMessage(chatId, `📝 Введіть ID замовлення для ${actionText}:`, {
			reply_markup: cancelKeyboard
		});
	}

	private async handleStatusAction(chatId: number, status: OrderStatus): Promise<void> {
		await this.showOrdersByStatus(chatId, status);
	}

	private async handlePromoAction(chatId: number, param: string): Promise<void> {
		switch (param) {
			case 'menu':
				await this.showPromoMenu(chatId);
				break;
		}
	}

	private async handleConfirmAction(chatId: number, orderId: string): Promise<void> {
		await this.updateOrderStatus(chatId, orderId, 'confirmed');
	}

	private async handleCancelAction(chatId: number, orderId: string): Promise<void> {
		if (orderId === 'operation') {
			// Cancel current operation, not order
			await this.bot.sendMessage(chatId, '❌ Операція скасована.');
		} else {
			await this.updateOrderStatus(chatId, orderId, 'cancelled');
		}
	}

	private async handleShipAction(chatId: number, orderId: string): Promise<void> {
		await this.updateOrderStatus(chatId, orderId, 'shipped');
	}

	private async handleDeliverAction(chatId: number, orderId: string): Promise<void> {
		await this.updateOrderStatus(chatId, orderId, 'delivered');
	}

	private async handleDetailsAction(chatId: number, orderId: string): Promise<void> {
		await this.showOrderDetails(chatId, orderId);
	}

	private async handleBackAction(chatId: number): Promise<void> {
		await this.showMainMenu(chatId);
	}

	// Helper methods
	private async showOrdersList(chatId: number): Promise<void> {
		try {
			const orders = await this.orderService.getAllOrders();
			let message = `📋 *Всі замовлення (${orders.length}):*\n\n`;

			if (orders.length === 0) {
				message = '📭 Немає замовлень';
			} else {
				orders.slice(0, 10).forEach((order) => {
					message += `• ${order.id} - ${this.getStatusText(order.status)}\n`;
				});
			}

			await this.bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
		} catch (error) {
			await this.bot.sendMessage(chatId, '❌ Помилка завантаження замовлень');
		}
	}

	private async showOrdersByStatus(chatId: number, status: OrderStatus): Promise<void> {
		try {
			const orders = await this.orderService.getAllOrders();
			const filteredOrders = orders.filter((order) => order.status === status);

			let message = `📋 *Замовлення "${this.getStatusText(status)}" (${filteredOrders.length}):*\n\n`;

			if (filteredOrders.length === 0) {
				message = `📭 Немає замовлень зі статусом "${this.getStatusText(status)}"`;
			} else {
				filteredOrders.forEach((order) => {
					message += `• ${order.id} - ${order.customerName || 'Невідомий клієнт'}\n`;
				});
			}

			await this.bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
		} catch (error) {
			await this.bot.sendMessage(chatId, '❌ Помилка завантаження замовлень');
		}
	}

	private async updateOrderStatus(
		chatId: number,
		orderId: string,
		status: OrderStatus
	): Promise<void> {
		try {
			const success = await this.orderService.updateOrderStatus(orderId, status);

			if (success) {
				const message = `✅ Замовлення ${orderId} оновлено до статусу "${this.getStatusText(status)}"`;
				await this.bot.sendMessage(chatId, message);
			} else {
				await this.bot.sendMessage(chatId, `❌ Замовлення ${orderId} не знайдено`);
			}
		} catch (error) {
			await this.bot.sendMessage(chatId, `❌ Помилка оновлення статусу замовлення ${orderId}`);
		}
	}

	private async showOrderDetails(chatId: number, orderId: string): Promise<void> {
		try {
			const order = await this.orderService.getOrderById(orderId);

			if (!order) {
				await this.bot.sendMessage(chatId, `❌ Замовлення ${orderId} не знайдено`);
				return;
			}

			const message = this.formatOrderDetails(order);
			await this.bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
		} catch (error) {
			await this.bot.sendMessage(chatId, `❌ Помилка завантаження деталей замовлення ${orderId}`);
		}
	}

	private async showMainMenu(chatId: number): Promise<void> {
		const message = '🚀 *Оберіть дію:*';
		const keyboard = {
			inline_keyboard: [
				[{ text: '📋 Всі замовлення', callback_data: 'show_orders' }],
				[{ text: '🎫 Промокоди', callback_data: 'promo_menu' }]
			]
		};

		await this.bot.sendMessage(chatId, message, {
			parse_mode: 'Markdown',
			reply_markup: keyboard
		});
	}

	private async showPromoMenu(chatId: number): Promise<void> {
		const message = '🎫 *Управління промокодами*';
		const keyboard = {
			inline_keyboard: [
				[{ text: '📋 Список', callback_data: 'promo_list' }],
				[{ text: '⬅️ Назад', callback_data: 'back_menu' }]
			]
		};

		await this.bot.sendMessage(chatId, message, {
			parse_mode: 'Markdown',
			reply_markup: keyboard
		});
	}

	private async showHelp(chatId: number): Promise<void> {
		const message = '📖 *Допомога*\n\nВикористовуйте кнопки для керування замовленнями.';
		await this.bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
	}

	private formatOrderDetails(order: any): string {
		let message = `${this.getStatusEmoji(order.status)} *ЗАМОВЛЕННЯ ${order.id}*\n\n`;
		message += `📅 Дата: ${new Date(order.createdAt).toLocaleDateString('uk-UA')}\n`;
		message += `📊 Статус: ${this.getStatusText(order.status)}\n`;
		message += `💰 Сума: ${order.total} ₴\n`;

		if (order.items && order.items.length > 0) {
			message += `\n📦 *Товари:*\n`;
			order.items.forEach((item: any, index: number) => {
				message += `${index + 1}. ${item.productName}\n`;
			});
		}

		return message;
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

	private getStatusText(status: string): string {
		const textMap: Record<string, string> = {
			pending: 'Очікує підтвердження',
			confirmed: 'Підтверджено',
			shipped: 'Відправлено',
			delivered: 'Доставлено',
			cancelled: 'Скасовано'
		};
		return textMap[status] || status;
	}
}
