import { OrderRepositoryFactory } from '../../data/factories/order-repository.factory';
import { UserRepositoryFactory } from '../../data/factories/user-repository.factory';
import type {
	OrderRepository,
	Order,
	CreateOrderData,
	OrderStatus,
	OrderItem
} from '../../domain/interfaces/order.interface';

// Lazy-loaded services to avoid circular dependencies
let telegramBotService: any = null;
let googleSheetsService: any = null;
let promoCodeService: any = null;

function getPromoCodeService() {
	if (!promoCodeService) {
		const { PromoCodeService } = require('./promo-code.service');
		promoCodeService = new PromoCodeService();
	}
	return promoCodeService;
}

// Order service - business logic layer

export class OrderService {
	private orderRepository: OrderRepository;
	private userRepository: any; // Will be initialized with factory pattern

	constructor() {
		// Use factory pattern with environment-based configuration
		this.orderRepository = OrderRepositoryFactory.createFromConfig();
		// Initialize userRepository using factory pattern
		this.userRepository = UserRepositoryFactory.createFromConfig();
	}

	async getOrdersByUserId(userId: string): Promise<Order[]> {
		try {
			console.log('[OrderService] Getting orders for user:', userId);

			// Сначала получаем заказы из базы данных
			const dbOrders = await this.orderRepository.getOrdersByUserId(userId);
			console.log('[OrderService] Found', dbOrders.length, 'orders in database');

			// ⚠️  ОБРАТНАЯ СИНХРОНИЗАЦИЯ ОТКЛЮЧЕНА
			// Google Sheets теперь является только зеркалом БД
			// БД является единственным source of truth
			console.log(
				'[OrderService] ⚠️  Google Sheets -> DB sync DISABLED. DB is the source of truth.'
			);

			return dbOrders;
		} catch (error) {
			console.error('[OrderService] Error getting orders:', error);
			return [];
		}
	}

	async getOrderById(orderId: string): Promise<Order | null> {
		try {
			console.log('[OrderService] Getting order by ID:', orderId);
			return await this.orderRepository.getOrderById(orderId);
		} catch (error) {
			console.error('[OrderService] Error getting order:', error);
			return null;
		}
	}

	async getAllOrders(): Promise<Order[]> {
		try {
			console.log('[OrderService] Getting all orders for admin');
			const orders = await this.orderRepository.getAllOrders();
			console.log(`[OrderService] Retrieved ${orders.length} orders from repository`);
			return orders;
		} catch (error) {
			console.error('[OrderService] Error getting all orders:', error);
			return [];
		}
	}

	async createOrder(data: CreateOrderData): Promise<Order | null> {
		try {
			console.log('[OrderService] Creating order for user:', data.userId);
			console.log('[OrderService] Order data:', JSON.stringify(data, null, 2));

			// Validate order data
			if (!data.userId || !data.items || data.items.length === 0 || !data.total) {
				console.error('[OrderService] Invalid order data:', {
					userId: data.userId,
					itemsCount: data.items?.length,
					total: data.total
				});
				return null;
			}

			// Validate items
			for (const item of data.items) {
				if (!item.productId || !item.productName || item.quantity <= 0 || item.price <= 0) {
					console.error('[OrderService] Invalid item data:', item);
					return null;
				}
			}

			const order = await this.orderRepository.createOrder(data);

			if (order) {
				// Синхронизировать с внешними сервисами
				await this.syncNewOrder(order);

				// Очистить старые заказы из Google Sheets
				await this.cleanupOldOrdersFromSheets();
			}

			return order;
		} catch (error) {
			console.error('[OrderService] Error creating order:', error);
			return null;
		}
	}

	async updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
		try {
			console.log('[OrderService] Updating order status:', orderId, '->', status);

			const validStatuses: OrderStatus[] = [
				'pending',
				'confirmed',
				'shipped',
				'delivered',
				'cancelled'
			];
			if (!validStatuses.includes(status)) {
				console.error('[OrderService] Invalid order status:', status);
				return false;
			}

			const success = await this.orderRepository.updateOrderStatus(orderId, status);
			console.log('[OrderService] Repository updateOrderStatus result:', success);

			if (success) {
				console.log('[OrderService] Status update successful, syncing...');
				// Синхронизировать обновление статуса
				await this.syncStatusUpdate(orderId, status);
				console.log('[OrderService] Status sync completed');
			} else {
				console.log('[OrderService] Status update failed');
			}

			return success;
		} catch (error) {
			console.error('[OrderService] Error updating order status:', error);
			return false;
		}
	}

	// Helper method to format order items for display
	formatOrderItems(items: OrderItem[]): any[] {
		return items.map((item) => ({
			...item,
			priceFormatted: `${(item.price / 100).toFixed(2)} ₴`,
			totalFormatted: `${(item.total / 100).toFixed(2)} ₴`
		}));
	}

	// Helper method to get status color for UI
	getStatusColor(status: OrderStatus): string {
		switch (status) {
			case 'pending':
				return 'text-yellow-600 bg-yellow-100';
			case 'confirmed':
				return 'text-blue-600 bg-blue-100';
			case 'shipped':
				return 'text-purple-600 bg-purple-100';
			case 'delivered':
				return 'text-green-600 bg-green-100';
			case 'cancelled':
				return 'text-red-600 bg-red-100';
			default:
				return 'text-gray-600 bg-gray-100';
		}
	}

	// Helper method to get status text in Ukrainian
	getStatusText(status: OrderStatus): string {
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

	// Синхронизация нового заказа с внешними сервисами
	private async syncNewOrder(order: Order): Promise<void> {
		try {
			console.log('[OrderService] Syncing new order:', order.id);

			// Проверяем, не находимся ли мы в тестовом скрипте
			const isTestScript =
				process.argv[1]?.includes('scripts/test-') || process.argv[1]?.includes('test-order');

			if (isTestScript) {
				console.log('[OrderService] Skipping external sync in test script');
				console.log('[OrderService] Order created:', order.id, '- status:', order.status);
				return;
			}

			// Record promo code usage if applicable
			if ((order as any).promoCode) {
				try {
					const promoService = getPromoCodeService();
					await promoService.recordUsage((order as any).promoCode.code, order.userId, order.id);
					console.log('[OrderService] Recorded promo code usage:', (order as any).promoCode.code);
				} catch (error) {
					console.error('[OrderService] Failed to record promo code usage:', error);
					// Don't fail the order creation for this
				}
			}

			// Синхронизировать с Google Sheets (асинхронно, но с повторными попытками)
			this.syncOrderToSheets(order).catch(async (error) => {
				console.error('[OrderService] Failed to sync order to Google Sheets:', error);

				// Повторить попытку через 5 секунд
				console.log('[OrderService] Retrying Google Sheets sync in 5 seconds...');
				setTimeout(() => {
					this.syncOrderToSheets(order).catch((retryError) => {
						console.error(
							'[OrderService] Final failure syncing order to Google Sheets:',
							retryError
						);
					});
				}, 5000);
			});

			// Отправить уведомление в Telegram (асинхронно)
			this.notifyTelegramBot(order).catch((error) => {
				console.error('[OrderService] Failed to notify Telegram bot:', error);
			});
		} catch (error) {
			console.error('[OrderService] Error syncing new order:', error);
			// Не бросаем ошибку, чтобы не ломать основной поток
		}
	}

	// Синхронизация обновления статуса
	private async syncStatusUpdate(orderId: string, status: OrderStatus): Promise<void> {
		try {
			console.log('[OrderService] Syncing status update:', orderId, status);

			// Проверяем, не находимся ли мы в тестовом скрипте
			const isTestScript =
				process.argv[1]?.includes('scripts/test-') || process.argv[1]?.includes('test-order');

			if (isTestScript) {
				console.log('[OrderService] Skipping status sync in test script');
				console.log('[OrderService] Order', orderId, 'status updated to:', status);
				return;
			}

			// Синхронизировать с Google Sheets (асинхронно)
			this.syncStatusToSheets(orderId, status).catch((error) => {
				console.error('[OrderService] Failed to sync status to Google Sheets:', error);
			});
		} catch (error) {
			console.error('[OrderService] Error syncing status update:', error);
			// Не бросаем ошибку, чтобы не ломать основной поток
		}
	}

	// Синхронизировать заказы пользователя из Google Sheets в БД
	async syncUserOrdersFromSheets(userId: string): Promise<void> {
		try {
			console.log('[OrderService] Syncing user orders from Google Sheets:', userId);

			// Получить существующие заказы пользователя
			const existingOrders = await this.orderRepository.getOrdersByUserId(userId);
			console.log(`[OrderService] User has ${existingOrders.length} orders in database`);

			// ⚠️  ОБРАТНАЯ СИНХРОНИЗАЦИЯ ОТКЛЮЧЕНА
			// Google Sheets -> DB sync DISABLED
			console.log(
				'[OrderService] ⚠️  Google Sheets -> DB sync DISABLED. DB is the source of truth.'
			);
			console.log('[OrderService] ✅ User orders sync completed (no-op)');
		} catch (error) {
			console.error('[OrderService] ❌ Error syncing user orders from Google Sheets:', error);
			// Не бросаем ошибку, чтобы не ломать основной поток
		}
	}

	// Синхронизация заказов из Google Sheets в базу данных
	private async syncOrdersFromSheets(userId: string, dbOrders: Order[]): Promise<void> {
		try {
			console.log('[OrderService] Starting sync from Google Sheets for user:', userId);

			// Lazy load Google Sheets service
			if (!googleSheetsService) {
				const { GoogleSheetsService } = await import('../../services/google-sheets.service');
				googleSheetsService = new GoogleSheetsService();
			}

			// Получить все заказы из Google Sheets
			const sheetsOrders = await googleSheetsService.getAllOrders();
			console.log('[OrderService] Found', sheetsOrders.length, 'orders in Google Sheets');

			// Фильтруем заказы пользователя
			const userSheetsOrders = sheetsOrders.filter((order: any) => {
				// Здесь нужно определить, как связать заказы пользователя в Sheets
				// Пока будем обновлять все заказы, которые есть в БД
				return dbOrders.some((dbOrder) => dbOrder.id === order.id);
			});

			console.log('[OrderService] Found', userSheetsOrders.length, 'user orders in Google Sheets');

			// Для каждого заказа из БД проверяем, есть ли он в Sheets с дополнительными данными
			for (const dbOrder of dbOrders) {
				const sheetsOrder = userSheetsOrders.find((order: any) => order.id === dbOrder.id);

				if (sheetsOrder) {
					console.log('[OrderService] Checking order', dbOrder.id, 'for missing data');

					// Проверяем, есть ли недостающие поля
					const needsUpdate = this.checkIfOrderNeedsUpdate(dbOrder, sheetsOrder);

					if (needsUpdate) {
						console.log(
							'[OrderService] Updating order',
							dbOrder.id,
							'with data from Google Sheets'
						);
						await this.updateOrderFromSheetsData(dbOrder, sheetsOrder);
					}
				}
			}

			// TEMPORARILY DISABLED: Создаем новые заказы из Google Sheets, которых нет в БД
			// const allSheetsOrders = await googleSheetsService.getAllOrders();
			// console.log(
			// 	'[OrderService] Checking for new orders in Google Sheets that are missing in DB...'
			// );
			console.log(
				'[OrderService] ⚠️  Auto-creation of orders from Google Sheets DISABLED to prevent duplicates'
			);

			for (const sheetsOrder of sheetsOrders) {
				const existsInDb = dbOrders.some((dbOrder) => dbOrder.id === sheetsOrder.id);

				if (!existsInDb) {
					console.log(
						'[OrderService] Found new order in Google Sheets:',
						sheetsOrder.id,
						'- creating in DB'
					);

					try {
						// Создаем заказ в БД на основе данных из Google Sheets
						const newOrderData: CreateOrderData = {
							userId: userId, // Используем текущего пользователя
							items: this.parseProductsFromSheets(sheetsOrder.products),
							total: parseFloat(sheetsOrder.sum) || 0,
							deliveryAddress: sheetsOrder.deliveryAddress || '',
							notes: sheetsOrder.comments || '',
							customerName: sheetsOrder.clientName || '',
							customerPhone: sheetsOrder.phoneNumber || ''
						};

						const createdOrder = await this.createOrderInternal(newOrderData, sheetsOrder.id);
						console.log(
							'[OrderService] ✅ Created order',
							createdOrder.id,
							'from Google Sheets data'
						);
					} catch (createError) {
						console.error(
							'[OrderService] ❌ Failed to create order from Google Sheets:',
							sheetsOrder.id,
							createError
						);
					}
				}
			}

			console.log('[OrderService] ✅ Sync from Google Sheets completed');
		} catch (error) {
			console.error('[OrderService] ❌ Error syncing from Google Sheets:', error);
			console.error(
				'[OrderService] Error details:',
				error instanceof Error ? error.message : String(error)
			);
			// Не бросаем ошибку, чтобы не ломать загрузку страницы
		}
	}

	// Вспомогательные методы для синхронизации
	private parseProductsFromSheets(productsString: string): OrderItem[] {
		if (!productsString) return [];

		try {
			// Разбираем строку товаров (формат: "Product1 (2 шт.); Product2 (1 шт.)")
			const products = productsString
				.split(';')
				.map((item) => item.trim())
				.filter((item) => item);

			return products.map((productStr) => {
				// Парсим формат "Product Name (quantity шт.)"
				const match = productStr.match(/^(.+?)\s*\((\d+)\s*шт\.\)$/);
				if (match) {
					return {
						productId: 'imported-from-sheets', // Заглушка
						productName: match[1].trim(),
						quantity: parseInt(match[2]),
						price: 0, // Не можем определить цену из строки
						total: 0,
						size: '',
						flavor: ''
					};
				} else {
					// Если формат не распознан, создаем товар с quantity = 1
					return {
						productId: 'imported-from-sheets',
						productName: productStr,
						quantity: 1,
						price: 0,
						total: 0,
						size: '',
						flavor: ''
					};
				}
			});
		} catch (error) {
			console.error('[OrderService] Error parsing products from sheets:', error);
			return [];
		}
	}

	private async createOrderInternal(orderData: CreateOrderData, customId?: string): Promise<Order> {
		try {
			console.log('[OrderService] Creating order with data:', orderData);

			const order: Order = {
				id: customId || crypto.randomUUID(),
				userId: orderData.userId,
				items: orderData.items,
				total: orderData.total,
				status: 'pending',
				deliveryAddress: orderData.deliveryAddress,
				notes: orderData.notes,
				customerName: orderData.customerName,
				customerPhone: orderData.customerPhone,
				createdAt: new Date(),
				updatedAt: new Date()
			};

			// Сохраняем в базе данных
			const savedOrder = await this.orderRepository.createOrder(order);

			if (!savedOrder) {
				throw new Error('Failed to save order to database');
			}

			console.log('[OrderService] Order created successfully:', savedOrder.id);
			return savedOrder;
		} catch (error) {
			console.error('[OrderService] Error creating order internally:', error);
			throw error;
		}
	}

	// Проверяем, нужно ли обновлять заказ данными из Google Sheets
	private checkIfOrderNeedsUpdate(dbOrder: Order, sheetsOrder: any): boolean {
		// Проверяем основные поля
		const needsCustomerName = !dbOrder.customerName && sheetsOrder.clientName;
		const needsCustomerPhone = !dbOrder.customerPhone && sheetsOrder.phoneNumber;
		const needsUserEmail = !dbOrder.userEmail && sheetsOrder.email;

		const needsUpdate = needsCustomerName || needsCustomerPhone || needsUserEmail;

		if (needsUpdate) {
			console.log('[OrderService] Order', dbOrder.id, 'needs update:', {
				customerName: needsCustomerName,
				customerPhone: needsCustomerPhone,
				userEmail: needsUserEmail
			});
		}

		return needsUpdate;
	}

	// Обновляем заказ данными из Google Sheets
	private async updateOrderFromSheetsData(dbOrder: Order, sheetsOrder: any): Promise<void> {
		try {
			console.log('[OrderService] Updating order', dbOrder.id, 'with Sheets data');

			// Создаем объект с обновляемыми полями
			const updateData: Partial<Order> = {};

			// Проверяем, есть ли данные в Sheets, которых нет в БД
			if (sheetsOrder.clientName && !dbOrder.customerName) {
				updateData.customerName = sheetsOrder.clientName;
				console.log('[OrderService] Will update customerName:', sheetsOrder.clientName);
			}

			if (sheetsOrder.phoneNumber && !dbOrder.customerPhone) {
				updateData.customerPhone = sheetsOrder.phoneNumber;
				console.log('[OrderService] Will update customerPhone:', sheetsOrder.phoneNumber);
			}

			if (sheetsOrder.email && !dbOrder.userEmail) {
				updateData.userEmail = sheetsOrder.email;
				console.log('[OrderService] Will update userEmail:', sheetsOrder.email);
			}

			if (Object.keys(updateData).length > 0) {
				// Обновляем поля заказа в базе данных
				console.log('[OrderService] Updating order', dbOrder.id, 'with:', updateData);
				const updateSuccess = await this.orderRepository.updateOrderFields(dbOrder.id, updateData);

				if (updateSuccess) {
					console.log(
						'[OrderService] ✅ Order',
						dbOrder.id,
						'successfully updated with Sheets data'
					);
				} else {
					console.log('[OrderService] ❌ Failed to update order', dbOrder.id);
				}
			} else {
				console.log('[OrderService] No updates needed for order', dbOrder.id);
			}
		} catch (error) {
			console.error('[OrderService] Error updating order from Sheets data:', error);
		}
	}

	// Синхронизация заказа с Google Sheets
	private async syncOrderToSheets(order: Order): Promise<void> {
		try {
			// Проверяем, не находимся ли мы в тестовом скрипте
			const isTestScript =
				process.argv[1]?.includes('scripts/test-') || process.argv[1]?.includes('test-order');

			if (isTestScript) {
				console.log('[OrderService] Skipping Google Sheets sync in test script');
				console.log(
					'[OrderService] Order data:',
					order.id,
					order.customerName,
					order.customerPhone
				);
				return;
			}

			console.log('[OrderService] Starting Google Sheets sync for order:', order.id);
			console.log('[OrderService] Order data:', {
				customerName: order.customerName,
				customerPhone: order.customerPhone,
				total: order.total
			});

			// Lazy load Google Sheets service
			if (!googleSheetsService) {
				console.log('[OrderService] Initializing Google Sheets service...');
				const { GoogleSheetsService } = await import('../../services/google-sheets.service');
				googleSheetsService = new GoogleSheetsService();
				console.log('[OrderService] Google Sheets service initialized');
			}

			// Получить email пользователя для Google Sheets
			let userEmail = '';
			try {
				if (this.userRepository && this.userRepository.getUserById) {
					console.log('[OrderService] Getting user email for userId:', order.userId);
					const user = await this.userRepository.getUserById(order.userId);
					userEmail = user?.email || '';
					console.log('[OrderService] User email retrieved:', userEmail);
				} else {
					console.log('[OrderService] UserRepository not available, skipping email retrieval');
				}
			} catch (userError) {
				console.error('[OrderService] Failed to get user email:', userError);
				// Не бросаем ошибку, продолжаем без email
			}

			// Создать расширенный объект заказа с email
			const orderWithEmail = {
				...order,
				userEmail
			};

			console.log('[OrderService] Calling Google Sheets addOrder...');
			await googleSheetsService.addOrder(orderWithEmail);
			console.log('[OrderService] ✅ Order successfully synced to Google Sheets:', order.id);
		} catch (error) {
			console.error('[OrderService] ❌ Error syncing to Google Sheets:', error);
			console.error(
				'[OrderService] Error details:',
				error instanceof Error ? error.message : String(error)
			);
			throw error;
		}
	}

	// Синхронизация статуса с Google Sheets
	private async syncStatusToSheets(orderId: string, status: OrderStatus): Promise<void> {
		try {
			// Проверяем, не находимся ли мы в тестовом скрипте
			const isTestScript =
				process.argv[1]?.includes('scripts/test-') || process.argv[1]?.includes('test-order');

			if (isTestScript) {
				console.log('[OrderService] Skipping Google Sheets status sync in test script');
				console.log('[OrderService] Order', orderId, 'status update to:', status);
				return;
			}

			console.log(
				'[OrderService] Starting Google Sheets sync for order:',
				orderId,
				'status:',
				status
			);

			// Lazy load Google Sheets service
			if (!googleSheetsService) {
				console.log('[OrderService] Initializing Google Sheets service...');
				const { GoogleSheetsService } = await import('../../services/google-sheets.service');
				googleSheetsService = new GoogleSheetsService();
				console.log('[OrderService] Google Sheets service initialized');
			}

			console.log('[OrderService] Calling googleSheetsService.updateOrderStatus...');
			await googleSheetsService.updateOrderStatus(orderId, status);
			console.log('[OrderService] Status synced to Google Sheets successfully:', orderId, status);
		} catch (error) {
			console.error('[OrderService] Error syncing status to Google Sheets:', error);
			console.error(
				'[OrderService] Error details:',
				error instanceof Error ? error.message : String(error)
			);
			console.error('[OrderService] Full error:', error);
			throw error;
		}
	}

	// Ручная очистка старых заказов из Google Sheets
	async cleanupOldOrders(): Promise<void> {
		await this.cleanupOldOrdersFromSheets();
	}

	// Полная синхронизация всех заказов с Google Sheets (для администрирования)
	async syncAllOrdersToSheets(): Promise<void> {
		try {
			console.log('[OrderService] 🔄 Starting full orders sync to Google Sheets...');

			// Получить все заказы из БД
			const allOrders = await this.orderRepository.getAllOrders();
			console.log(`[OrderService] Found ${allOrders.length} orders in database`);

			if (allOrders.length === 0) {
				console.log('[OrderService] No orders to sync');
				return;
			}

			// Lazy load Google Sheets service
			if (!googleSheetsService) {
				const { GoogleSheetsService } = await import('../../services/google-sheets.service');
				googleSheetsService = new GoogleSheetsService();
			}

			let syncedCount = 0;
			let errorCount = 0;

			// Синхронизировать каждый заказ
			for (const order of allOrders) {
				try {
					console.log(`[OrderService] Syncing order ${order.id}...`);

					// Получить email пользователя
					let userEmail = '';
					try {
						if (this.userRepository && this.userRepository.getUserById) {
							const user = await this.userRepository.getUserById(order.userId);
							userEmail = user?.email || '';
						}
					} catch (userError) {
						console.warn(`[OrderService] Could not get email for user ${order.userId}:`, userError);
					}

					// Синхронизировать заказ
					await googleSheetsService.addOrder({
						...order,
						userEmail
					});

					syncedCount++;
					console.log(`[OrderService] ✅ Synced order ${order.id}`);

					// Небольшая задержка чтобы не перегружать API
					await new Promise((resolve) => setTimeout(resolve, 100));
				} catch (error) {
					console.error(`[OrderService] ❌ Failed to sync order ${order.id}:`, error);
					errorCount++;
				}
			}

			console.log(`[OrderService] 🔄 Full sync completed:`);
			console.log(`  ✅ Synced: ${syncedCount}`);
			console.log(`  ❌ Errors: ${errorCount}`);
			console.log(`  📊 Total: ${allOrders.length}`);
		} catch (error) {
			console.error('[OrderService] ❌ Full sync failed:', error);
			throw error;
		}
	}

	// Очистка старых заказов из Google Sheets
	private async cleanupOldOrdersFromSheets(): Promise<void> {
		try {
			console.log('[OrderService] Starting cleanup of old orders from Google Sheets...');

			// Получить все ID заказов из БД
			const dbOrders = await this.orderRepository.getAllOrders();
			const dbOrderIds = dbOrders.map((order) => order.id);

			console.log(`[OrderService] Found ${dbOrderIds.length} orders in database`);

			// Lazy load Google Sheets service
			if (!googleSheetsService) {
				const { GoogleSheetsService } = await import('../../services/google-sheets.service');
				googleSheetsService = new GoogleSheetsService();
			}

			// Очистить старые заказы
			await googleSheetsService.cleanupOldOrders(dbOrderIds);

			console.log('[OrderService] ✅ Cleanup of old orders from Google Sheets completed');
		} catch (error) {
			console.error('[OrderService] Error cleaning up old orders from Google Sheets:', error);
			// Не бросаем ошибку, чтобы не ломать основной поток создания заказа
		}
	}

	// Уведомление Telegram бота
	private async notifyTelegramBot(order: Order): Promise<void> {
		try {
			// Проверяем, не находимся ли мы в тестовом скрипте
			// В тестовых скриптах бот уже должен быть запущен отдельно
			const isTestScript =
				process.argv[1]?.includes('scripts/test-') || process.argv[1]?.includes('test-order');

			if (isTestScript) {
				console.log('[OrderService] Skipping Telegram bot notification in test script');
				console.log('[OrderService] Order created:', order.id, '- status:', order.status);
				return;
			}

			// Lazy load Telegram bot service
			if (!telegramBotService) {
				const { TelegramBotService } = await import('../../services/telegram-bot.service');
				telegramBotService = new TelegramBotService(false); // Не запускаем polling автоматически
			}

			await telegramBotService.notifyNewOrder(order);
			console.log('[OrderService] Telegram bot notified:', order.id);
		} catch (error) {
			console.error('[OrderService] Error notifying Telegram bot:', error);
			console.error(
				'[OrderService] Error details:',
				error instanceof Error ? error.message : String(error)
			);
			throw error;
		}
	}
}

// Export singleton instance
export const orderService = new OrderService();
