import { eq } from 'drizzle-orm';
import { db } from '../../db/index';
import { orders } from '../../db/schema';
import type {
	OrderRepository,
	Order,
	CreateOrderData,
	OrderStatus,
	OrderItem
} from '../../domain/interfaces/order.interface';

// Generate a unique 6-digit order ID
function generateOrderId(): string {
	const timestamp = Date.now().toString().slice(-4); // Last 4 digits of timestamp
	const random = Math.floor(Math.random() * 100)
		.toString()
		.padStart(2, '0'); // 2 random digits
	return timestamp + random; // 6-digit code
}

// Drizzle implementation of OrderRepository
export class DrizzleOrderRepository implements OrderRepository {
	async getOrdersByUserId(userId: string): Promise<Order[]> {
		try {
			console.log('[DrizzleOrderRepository] Fetching orders for user:', userId);
			const results = await db
				.select()
				.from(orders)
				.where(eq(orders.userId, userId))
				.orderBy(orders.createdAt);

			return results.map((order) => this.mapOrderToDomain(order));
		} catch (error) {
			console.error('[DrizzleOrderRepository] Error fetching orders:', error);
			return [];
		}
	}

	async getOrderById(orderId: string): Promise<Order | null> {
		try {
			console.log('[DrizzleOrderRepository] Fetching order by ID:', orderId);
			const results = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);

			return results[0] ? this.mapOrderToDomain(results[0]) : null;
		} catch (error) {
			console.error('[DrizzleOrderRepository] Error fetching order:', error);
			return null;
		}
	}

	async getAllOrders(): Promise<Order[]> {
		try {
			console.log('[DrizzleOrderRepository] Fetching all orders for admin');
			const results = await db.select().from(orders).orderBy(orders.createdAt);

			console.log(`[DrizzleOrderRepository] Raw results count: ${results.length}`);
			results.forEach((order, index) => {
				console.log(`[DrizzleOrderRepository] Raw order ${index + 1}:`, {
					id: order.id,
					userId: order.userId,
					status: order.status,
					total: order.total
				});
			});

			const mappedOrders = results.map((order) => this.mapOrderToDomain(order));
			console.log(`[DrizzleOrderRepository] Mapped orders count: ${mappedOrders.length}`);

			return mappedOrders;
		} catch (error) {
			console.error('[DrizzleOrderRepository] Error fetching all orders:', error);
			console.error(
				'[DrizzleOrderRepository] Error details:',
				error instanceof Error ? error.message : String(error)
			);
			console.error(
				'[DrizzleOrderRepository] Error stack:',
				error instanceof Error ? error.stack : 'No stack trace'
			);
			return [];
		}
	}

	async createOrder(data: CreateOrderData): Promise<Order | null> {
		try {
			console.log('[DrizzleOrderRepository] Creating new order for user:', data.userId);
			console.log('[DrizzleOrderRepository] Input data:', JSON.stringify(data, null, 2));

			// Generate unique 6-digit order ID
			let orderId: string;
			let attempts = 0;
			const maxAttempts = 10;

			do {
				orderId = generateOrderId();
				attempts++;

				// Check if order ID already exists
				const existingOrder = await this.getOrderById(orderId);
				if (!existingOrder) break;
			} while (attempts < maxAttempts);

			if (attempts >= maxAttempts) {
				console.error('[DrizzleOrderRepository] Failed to generate unique order ID');
				return null;
			}

			const now = new Date();

			const insertData = {
				id: orderId,
				userId: data.userId,
				items: JSON.stringify(data.items),
				total: data.total,
				status: 'pending' as OrderStatus,
				deliveryAddress: data.deliveryAddress ? JSON.stringify(data.deliveryAddress) : null,
				notes: data.notes || null,

				// Customer information
				customerName: data.customerName || null,
				customerPhone: data.customerPhone || null,

				createdAt: now,
				updatedAt: now
			};

			console.log(
				'[DrizzleOrderRepository] Insert data prepared:',
				JSON.stringify(insertData, null, 2)
			);

			try {
				await db.insert(orders).values(insertData);
				console.log('[DrizzleOrderRepository] Database insert successful');
			} catch (dbError) {
				console.error('[DrizzleOrderRepository] Database insert failed:', dbError);
				throw dbError;
			}
			console.log('[DrizzleOrderRepository] Order created successfully with ID:', orderId);

			return this.mapOrderToDomain({
				...insertData,
				created_at: Math.floor(now.getTime() / 1000),
				updated_at: Math.floor(now.getTime() / 1000)
			} as any);
		} catch (error) {
			console.error('[DrizzleOrderRepository] Error creating order:', error);
			return null;
		}
	}

	async updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
		try {
			console.log('[DrizzleOrderRepository] Updating order status:', orderId, '->', status);

			// Сначала проверим, существует ли заказ
			const existingOrder = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
			console.log('[DrizzleOrderRepository] Order exists before update:', existingOrder.length > 0);

			if (existingOrder.length === 0) {
				console.log('[DrizzleOrderRepository] Order not found:', orderId);
				return false;
			}

			const result = await db
				.update(orders)
				.set({
					status,
					updatedAt: new Date()
				})
				.where(eq(orders.id, orderId));

			console.log('[DrizzleOrderRepository] Update result:', result);

			// Проверим, действительно ли обновился статус
			const updatedOrder = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
			if (updatedOrder.length > 0) {
				console.log('[DrizzleOrderRepository] Order status after update:', updatedOrder[0].status);
				return updatedOrder[0].status === status;
			}

			return false;
		} catch (error) {
			console.error('[DrizzleOrderRepository] Error updating order status:', error);
			console.error(
				'[DrizzleOrderRepository] Error details:',
				error instanceof Error ? error.message : String(error)
			);
			return false;
		}
	}

	async updateOrderFields(orderId: string, updateData: Partial<Order>): Promise<boolean> {
		try {
			console.log('[DrizzleOrderRepository] Updating order fields:', orderId, updateData);

			// Сначала проверим, существует ли заказ
			const existingOrder = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
			console.log(
				'[DrizzleOrderRepository] Order exists before field update:',
				existingOrder.length > 0
			);

			if (existingOrder.length === 0) {
				console.log('[DrizzleOrderRepository] Order not found:', orderId);
				return false;
			}

			// Создаем объект для обновления
			const updateObject: any = {
				updatedAt: new Date()
			};

			// Добавляем поля для обновления
			if (updateData.customerName !== undefined) {
				updateObject.customer_name = updateData.customerName;
			}
			if (updateData.customerPhone !== undefined) {
				updateObject.customer_phone = updateData.customerPhone;
			}
			if (updateData.userEmail !== undefined) {
				updateObject.user_email = updateData.userEmail;
			}

			console.log('[DrizzleOrderRepository] Update object:', updateObject);

			const result = await db.update(orders).set(updateObject).where(eq(orders.id, orderId));

			console.log('[DrizzleOrderRepository] Field update result:', result);

			// Проверим, действительно ли обновились поля
			const updatedOrder = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
			if (updatedOrder.length > 0) {
				const order = updatedOrder[0];
				console.log('[DrizzleOrderRepository] Order fields after update:', {
					customer_name: order.customerName,
					customer_phone: order.customerPhone,
					user_email: order.userEmail
				});

				// Проверяем, что хотя бы одно поле обновилось
				const hasUpdates =
					(updateData.customerName !== undefined &&
						order.customerName === updateData.customerName) ||
					(updateData.customerPhone !== undefined &&
						order.customerPhone === updateData.customerPhone) ||
					(updateData.userEmail !== undefined && order.userEmail === updateData.userEmail);

				return hasUpdates;
			}

			return false;
		} catch (error) {
			console.error('[DrizzleOrderRepository] Error updating order fields:', error);
			console.error(
				'[DrizzleOrderRepository] Error details:',
				error instanceof Error ? error.message : String(error)
			);
			return false;
		}
	}

	private mapOrderToDomain(dbOrder: any): Order {
		return {
			id: dbOrder.id,
			userId: dbOrder.userId || dbOrder.user_id,
			items: JSON.parse(dbOrder.items),
			total: dbOrder.total,
			status: dbOrder.status,
			deliveryAddress:
				dbOrder.deliveryAddress ||
				(dbOrder.delivery_address ? JSON.parse(dbOrder.delivery_address) : undefined),
			notes: dbOrder.notes || undefined,

			// Customer information
			customerName: dbOrder.customerName || dbOrder.customer_name || undefined,
			customerPhone: dbOrder.customerPhone || dbOrder.customer_phone || undefined,
			userEmail: dbOrder.userEmail || dbOrder.user_email || undefined,

			createdAt: dbOrder.createdAt || new Date(dbOrder.created_at * 1000),
			updatedAt: dbOrder.updatedAt || new Date(dbOrder.updated_at * 1000)
		};
	}
}
