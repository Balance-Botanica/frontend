import type { Order } from '../../domain/interfaces/order.interface';

/**
 * Handles formatting of order-related messages
 */
export class OrderFormatter {
	/**
	 * Format a single order as a summary line
	 */
	formatOrderSummary(order: Order): string {
		const statusEmoji = this.getStatusEmoji(order.status);
		const date = new Date(order.createdAt).toLocaleDateString('uk-UA');
		const total = (order.total / 100).toFixed(2);

		return `${statusEmoji} ${order.id} - ${date} - ${total} ₴`;
	}

	/**
	 * Format detailed order information
	 */
	formatOrderDetails(order: Order): string {
		const statusEmoji = this.getStatusEmoji(order.status);
		const statusText = this.getStatusText(order.status);
		const date = new Date(order.createdAt).toLocaleDateString('uk-UA');
		const total = (order.total / 100).toFixed(2);

		let message = `${statusEmoji} *ЗАМОВЛЕННЯ ${order.id}*\n\n`;
		message += `📅 Дата: ${date}\n`;
		message += `📊 Статус: ${statusText}\n`;
		message += `💰 Сума: ${total} ₴\n`;

		// Customer info
		if (order.customerName) {
			message += `👤 Клієнт: ${order.customerName}\n`;
		}
		if (order.customerPhone) {
			message += `📞 Телефон: ${order.customerPhone}\n`;
		}

		// Items
		if (order.items && order.items.length > 0) {
			message += `\n📦 *Товари:*\n`;
			order.items.forEach((item, index) => {
				const price = (item.price / 100).toFixed(2);
				const itemTotal = (item.total / 100).toFixed(2);
				message += `${index + 1}. ${item.productName}\n`;
				message += `   ${item.quantity} шт. × ${price} ₴ = ${itemTotal} ₴\n`;
			});
		}

		// Delivery address
		if (order.deliveryAddress) {
			message += `\n🏠 *Адреса доставки:*\n`;
			message += this.formatDeliveryAddress(order.deliveryAddress);
		}

		// Notes
		if (order.notes) {
			message += `\n📝 *Примітки:* ${order.notes}`;
		}

		return message;
	}

	/**
	 * Format a list of orders
	 */
	formatOrderList(orders: Order[], title?: string): string {
		const titleText = title || `Замовлення (${orders.length})`;

		if (orders.length === 0) {
			return `📭 Немає ${titleText.toLowerCase()}`;
		}

		let message = `📋 *${titleText}:*\n\n`;

		orders.forEach((order, index) => {
			if (index < 10) {
				// Limit to first 10
				message += this.formatOrderSummary(order) + '\n';
			}
		});

		if (orders.length > 10) {
			message += `\n... та ще ${orders.length - 10} замовлень`;
		}

		return message;
	}

	/**
	 * Format delivery address based on type
	 */
	private formatDeliveryAddress(address: any): string {
		// Check if it's Nova Poshta
		if (address.npWarehouse || address.npCityName || address.useNovaPost) {
			let novaPoshtaAddress = '';

			if (address.npCityFullName) {
				novaPoshtaAddress += `${address.npCityFullName}\n`;
			}

			if (address.npWarehouse) {
				novaPoshtaAddress += `Відділення Нової Пошти №${address.npWarehouse}\n`;
			}

			if (address.name && address.name !== 'Нова Пошта') {
				novaPoshtaAddress += `Отримувач: ${address.name}\n`;
			}

			return novaPoshtaAddress || 'Нова Пошта (дані відсутні)';
		}

		// Regular address
		let regularAddress = '';

		if (address.street) {
			regularAddress += `${address.street}\n`;
		}
		if (address.city) {
			regularAddress += `${address.city}\n`;
		}
		if (address.postalCode) {
			regularAddress += `${address.postalCode}\n`;
		}
		if (address.name) {
			regularAddress += `Отримувач: ${address.name}\n`;
		}

		return regularAddress || 'Адреса не вказана';
	}

	/**
	 * Get status emoji
	 */
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

	/**
	 * Get status text in Ukrainian
	 */
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

	/**
	 * Format order status change notification
	 */
	formatStatusChange(orderId: string, oldStatus: string, newStatus: string): string {
		const oldEmoji = this.getStatusEmoji(oldStatus);
		const newEmoji = this.getStatusEmoji(newStatus);
		const newText = this.getStatusText(newStatus);

		return `✅ Замовлення *${orderId}* оновлено\n\n${oldEmoji} → ${newEmoji} ${newText}`;
	}

	/**
	 * Format new order notification
	 */
	formatNewOrderNotification(order: Order): string {
		const total = (order.total / 100).toFixed(2);
		const createDate = new Date(order.createdAt).toLocaleString('uk-UA');

		let message = `🆕 *НОВЫЙ ЗАКАЗ ${order.id}*\n\n`;
		message += `📅 Время: ${createDate}\n`;
		message += `👤 Клиент: ${order.customerName || order.userId}\n`;
		message += `📞 Телефон: ${order.customerPhone || 'Не указан'}\n`;
		message += `💰 Сумма: ${total} ₴\n`;
		message += `📦 Товаров: ${order.items?.length || 0}\n\n`;

		// Add items summary
		if (order.items && order.items.length > 0) {
			message += `🛒 *Состав замовлення:*\n`;
			order.items.slice(0, 3).forEach((item, index) => {
				const price = (item.price / 100).toFixed(2);
				message += `${index + 1}. ${item.productName}\n`;
				message += `   ${item.quantity} шт.. × ${price} ₴\n`;
			});

			if (order.items.length > 3) {
				message += `... та ще ${order.items.length - 3} товарів\n`;
			}
			message += '\n';
		}

		message += `⚡ *Требуется подтверждение!*`;

		return message;
	}
}
