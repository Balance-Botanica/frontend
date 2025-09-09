import type { OrderStatus } from '../../domain/interfaces/order.interface';

/**
 * Validates order status transitions and other order-related rules
 */
export class OrderValidator {
	private static readonly VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
		pending: ['confirmed', 'cancelled'],
		confirmed: ['shipped', 'cancelled'],
		shipped: ['delivered'],
		delivered: [], // Final state
		cancelled: [] // Final state
	};

	private static readonly STATUS_NAMES: Record<OrderStatus, string> = {
		pending: 'Очікує підтвердження',
		confirmed: 'Підтверджено',
		shipped: 'Відправлено',
		delivered: 'Доставлено',
		cancelled: 'Скасовано'
	};

	/**
	 * Check if status transition is valid
	 */
	isValidStatusTransition(currentStatus: OrderStatus, newStatus: OrderStatus): boolean {
		if (currentStatus === newStatus) {
			return false; // No change needed
		}

		const allowedTransitions = this.VALID_TRANSITIONS[currentStatus];
		return allowedTransitions?.includes(newStatus) || false;
	}

	/**
	 * Get error message for invalid transition
	 */
	getStatusTransitionError(currentStatus: OrderStatus, newStatus: OrderStatus): string {
		const currentName = this.STATUS_NAMES[currentStatus];
		const newName = this.STATUS_NAMES[newStatus];

		let message = `❌ *Недозволений перехід статусу!*\n\n`;
		message += `Поточний статус: *${currentName}*\n`;
		message += `Бажаний статус: *${newName}*\n\n`;

		// Provide helpful guidance
		message += this.getTransitionGuidance(currentStatus, newStatus);

		return message;
	}

	/**
	 * Get guidance for status transition
	 */
	private getTransitionGuidance(currentStatus: OrderStatus, newStatus: OrderStatus): string {
		switch (currentStatus) {
			case 'pending':
				return `💡 Спочатку потрібно *підтвердити* замовлення, потім можна відправити або скасувати.`;

			case 'confirmed':
				if (newStatus === 'delivered') {
					return `💡 Спочатку потрібно *відправити* замовлення, потім можна позначити як доставлене.`;
				}
				return `💡 Підтверджене замовлення можна відправити або скасувати.`;

			case 'shipped':
				if (newStatus !== 'delivered') {
					return `💡 Відправлене замовлення можна тільки позначити як доставлене.`;
				}
				return `✅ Перехід дозволений.`;

			case 'delivered':
			case 'cancelled':
				return `💡 Цей статус є кінцевим і не може бути змінений.`;

			default:
				return `❓ Невідомий статус.`;
		}
	}

	/**
	 * Validate order ID format
	 */
	isValidOrderId(orderId: string): boolean {
		// Order ID should be alphanumeric, 4-20 characters
		return /^[A-Za-z0-9]{4,20}$/.test(orderId);
	}

	/**
	 * Validate TTN format (Nova Poshta)
	 */
	isValidTTN(ttn: string): boolean {
		// Nova Poshta TTN should be exactly 14 digits
		return /^\d{14}$/.test(ttn.trim());
	}

	/**
	 * Get all possible next statuses for current status
	 */
	getPossibleTransitions(currentStatus: OrderStatus): OrderStatus[] {
		return this.VALID_TRANSITIONS[currentStatus] || [];
	}

	/**
	 * Check if status is final (cannot be changed)
	 */
	isFinalStatus(status: OrderStatus): boolean {
		return this.VALID_TRANSITIONS[status]?.length === 0;
	}

	/**
	 * Get status name in Ukrainian
	 */
	getStatusName(status: OrderStatus): string {
		return this.STATUS_NAMES[status] || status;
	}

	/**
	 * Get status emoji
	 */
	getStatusEmoji(status: OrderStatus): string {
		const emojiMap: Record<OrderStatus, string> = {
			pending: '⏳',
			confirmed: '✅',
			shipped: '📦',
			delivered: '🚚',
			cancelled: '❌'
		};
		return emojiMap[status] || '❓';
	}

	/**
	 * Validate user permissions for status change
	 */
	canUserChangeStatus(userId: string, currentStatus: OrderStatus, newStatus: OrderStatus): boolean {
		// Basic validation - could be extended with role-based permissions
		return this.isValidStatusTransition(currentStatus, newStatus);
	}

	/**
	 * Get transition path (sequence of statuses)
	 */
	getTransitionPath(fromStatus: OrderStatus, toStatus: OrderStatus): OrderStatus[] | null {
		if (fromStatus === toStatus) {
			return [];
		}

		// Simple BFS to find path
		const visited = new Set<OrderStatus>();
		const queue: Array<{ status: OrderStatus; path: OrderStatus[] }> = [
			{ status: fromStatus, path: [] }
		];

		while (queue.length > 0) {
			const { status, path } = queue.shift()!;

			if (status === toStatus) {
				return path;
			}

			if (visited.has(status)) continue;
			visited.add(status);

			const nextStatuses = this.VALID_TRANSITIONS[status] || [];
			for (const nextStatus of nextStatuses) {
				queue.push({
					status: nextStatus,
					path: [...path, nextStatus]
				});
			}
		}

		return null; // No path found
	}
}
