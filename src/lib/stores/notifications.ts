import { writable } from 'svelte/store';

/**
 * 🔔 Notification Types
 */
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

/**
 * 📩 Notification Interface
 */
export interface Notification {
	id: string;
	type: NotificationType;
	title?: string;
	message: string;
	duration?: number; // Duration in milliseconds, 0 means persistent
	actions?: NotificationAction[];
}

/**
 * 🎬 Notification Action Interface
 */
export interface NotificationAction {
	label: string;
	action: () => void;
	style?: 'primary' | 'secondary' | 'danger';
}

/**
 * 📊 Notification Store State
 */
interface NotificationState {
	notifications: Notification[];
}

/**
 * 🔔 Global Notification Store
 * Manages all notifications displayed in the application
 */
function createNotificationStore() {
	const { subscribe, set, update } = writable<NotificationState>({
		notifications: []
	});

	let notificationCounter = 0;

	/**
	 * Generate unique notification ID
	 */
	function generateId(): string {
		return `notification-${Date.now()}-${++notificationCounter}`;
	}

	/**
	 * Add a new notification
	 */
	function addNotification(notification: Omit<Notification, 'id'>): string {
		const id = generateId();
		const newNotification: Notification = {
			id,
			duration: notification.duration ?? 5000, // Default 5 seconds
			...notification
		};

		update((state) => ({
			...state,
			notifications: [...state.notifications, newNotification]
		}));

		// Auto-dismiss notification if duration is set
		if (newNotification.duration && newNotification.duration > 0) {
			setTimeout(() => {
				removeNotification(id);
			}, newNotification.duration);
		}

		return id;
	}

	/**
	 * Remove a specific notification
	 */
	function removeNotification(id: string) {
		update((state) => ({
			...state,
			notifications: state.notifications.filter((n) => n.id !== id)
		}));
	}

	/**
	 * Clear all notifications
	 */
	function clearAll() {
		set({ notifications: [] });
	}

	/**
	 * Show success notification
	 */
	function success(
		message: string,
		options?: Partial<Omit<Notification, 'id' | 'type' | 'message'>>
	) {
		return addNotification({
			type: 'success',
			message,
			...options
		});
	}

	/**
	 * Show error notification
	 */
	function error(
		message: string,
		options?: Partial<Omit<Notification, 'id' | 'type' | 'message'>>
	) {
		return addNotification({
			type: 'error',
			message,
			duration: 8000, // Errors stay longer by default
			...options
		});
	}

	/**
	 * Show warning notification
	 */
	function warning(
		message: string,
		options?: Partial<Omit<Notification, 'id' | 'type' | 'message'>>
	) {
		return addNotification({
			type: 'warning',
			message,
			duration: 6000, // Warnings stay a bit longer
			...options
		});
	}

	/**
	 * Show info notification
	 */
	function info(message: string, options?: Partial<Omit<Notification, 'id' | 'type' | 'message'>>) {
		return addNotification({
			type: 'info',
			message,
			...options
		});
	}

	/**
	 * Show email confirmation notification (specific use case)
	 */
	function emailConfirmation(email: string) {
		return addNotification({
			type: 'success',
			title: 'Check your email',
			message: `Please check ${email} for a confirmation link to activate your account.`,
			duration: 10000, // Give users time to read
			actions: [
				{
					label: 'Dismiss',
					action: () => {}, // Will auto-remove
					style: 'secondary'
				}
			]
		});
	}

	return {
		subscribe,
		add: addNotification,
		remove: removeNotification,
		clear: clearAll,
		success,
		error,
		warning,
		info,
		emailConfirmation
	};
}

export const notificationStore = createNotificationStore();

// Export derived store for easy access to notifications
export const notifications = {
	subscribe: notificationStore.subscribe
};
