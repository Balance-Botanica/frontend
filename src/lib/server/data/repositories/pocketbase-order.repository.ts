import { pb } from '../../pocketbase/index';
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

// PocketBase implementation of OrderRepository
export class PocketBaseOrderRepository implements OrderRepository {
	async getOrdersByUserId(userId: string): Promise<Order[]> {
		try {
			console.log('[PocketBaseOrderRepository] Fetching orders for user:', userId);
			const records = await pb.collection('orders').getList(1, 50, {
				filter: `user_id = "${userId}"`,
				sort: 'created'
			});

			return records.items.map((record) => this.mapOrderToDomain(record));
		} catch (error) {
			console.error('[PocketBaseOrderRepository] Error fetching orders:', error);
			return [];
		}
	}

	async getOrderById(orderId: string): Promise<Order | null> {
		try {
			console.log('[PocketBaseOrderRepository] Fetching order by ID:', orderId);
			const record = await pb.collection('orders').getOne(orderId);
			return record ? this.mapOrderToDomain(record) : null;
		} catch (error) {
			console.error('[PocketBaseOrderRepository] Error fetching order:', error);
			return null;
		}
	}

	async getAllOrders(): Promise<Order[]> {
		try {
			console.log('[PocketBaseOrderRepository] Fetching all orders for admin');
			const records = await pb.collection('orders').getList(1, 100, {
				sort: 'created'
			});

			console.log(`[PocketBaseOrderRepository] Raw results count: ${records.items.length}`);
			records.items.forEach((record, index) => {
				console.log(`[PocketBaseOrderRepository] Raw order ${index + 1}:`, {
					id: record.id,
					user_id: record.user_id,
					status: record.status,
					total: record.total
				});
			});

			const mappedOrders = records.items.map((record) => this.mapOrderToDomain(record));
			console.log(`[PocketBaseOrderRepository] Mapped orders count: ${mappedOrders.length}`);

			return mappedOrders;
		} catch (error) {
			console.error('[PocketBaseOrderRepository] Error fetching all orders:', error);
			console.error(
				'[PocketBaseOrderRepository] Error details:',
				error instanceof Error ? error.message : String(error)
			);
			return [];
		}
	}

	async createOrder(data: CreateOrderData): Promise<Order | null> {
		try {
			console.log('[PocketBaseOrderRepository] Creating new order for user:', data.userId);
			console.log('[PocketBaseOrderRepository] Input data:', JSON.stringify(data, null, 2));

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
				console.error('[PocketBaseOrderRepository] Failed to generate unique order ID');
				return null;
			}

			const now = new Date().toISOString();

			const record = await pb.collection('orders').create({
				id: orderId,
				user_id: data.userId,
				items: JSON.stringify(data.items),
				total: data.total,
				status: 'pending',
				delivery_address: data.deliveryAddress ? JSON.stringify(data.deliveryAddress) : null,
				notes: data.notes || null,

				// Customer information
				customer_name: data.customerName || null,
				customer_phone: data.customerPhone || null,

				created: now,
				updated: now
			});

			console.log('[PocketBaseOrderRepository] Order created successfully with ID:', orderId);

			return this.mapOrderToDomain(record);
		} catch (error) {
			console.error('[PocketBaseOrderRepository] Error creating order:', error);
			return null;
		}
	}

	async updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
		try {
			console.log('[PocketBaseOrderRepository] Updating order status:', orderId, '->', status);

			// First check if order exists
			const existingOrder = await this.getOrderById(orderId);
			console.log('[PocketBaseOrderRepository] Order exists before update:', !!existingOrder);

			if (!existingOrder) {
				console.log('[PocketBaseOrderRepository] Order not found:', orderId);
				return false;
			}

			const record = await pb.collection('orders').update(orderId, {
				status,
				updated: new Date().toISOString()
			});

			console.log('[PocketBaseOrderRepository] Update result:', record);

			// Verify the status was updated
			const updatedOrder = await this.getOrderById(orderId);
			if (updatedOrder) {
				console.log('[PocketBaseOrderRepository] Order status after update:', updatedOrder.status);
				return updatedOrder.status === status;
			}

			return false;
		} catch (error) {
			console.error('[PocketBaseOrderRepository] Error updating order status:', error);
			console.error(
				'[PocketBaseOrderRepository] Error details:',
				error instanceof Error ? error.message : String(error)
			);
			return false;
		}
	}

	async updateOrderFields(orderId: string, updateData: Partial<Order>): Promise<boolean> {
		try {
			console.log('[PocketBaseOrderRepository] Updating order fields:', orderId, updateData);

			// First check if order exists
			const existingOrder = await this.getOrderById(orderId);
			console.log('[PocketBaseOrderRepository] Order exists before field update:', !!existingOrder);

			if (!existingOrder) {
				console.log('[PocketBaseOrderRepository] Order not found:', orderId);
				return false;
			}

			// Create object for updating
			const updateObject: any = {
				updated: new Date().toISOString()
			};

			// Add fields to update
			if (updateData.customerName !== undefined) {
				updateObject.customer_name = updateData.customerName;
			}
			if (updateData.customerPhone !== undefined) {
				updateObject.customer_phone = updateData.customerPhone;
			}
			if (updateData.userEmail !== undefined) {
				updateObject.user_email = updateData.userEmail;
			}

			console.log('[PocketBaseOrderRepository] Update object:', updateObject);

			const record = await pb.collection('orders').update(orderId, updateObject);

			console.log('[PocketBaseOrderRepository] Field update result:', record);

			// Verify fields were updated
			const updatedOrder = await this.getOrderById(orderId);
			if (updatedOrder) {
				const order = updatedOrder;
				console.log('[PocketBaseOrderRepository] Order fields after update:', {
					customer_name: order.customerName,
					customer_phone: order.customerPhone,
					user_email: order.userEmail
				});

				// Check that at least one field was updated
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
			console.error('[PocketBaseOrderRepository] Error updating order fields:', error);
			console.error(
				'[PocketBaseOrderRepository] Error details:',
				error instanceof Error ? error.message : String(error)
			);
			return false;
		}
	}

	private mapOrderToDomain(record: any): Order {
		return {
			id: record.id,
			userId: record.user_id,
			items: JSON.parse(record.items),
			total: record.total,
			status: record.status as OrderStatus,
			deliveryAddress: record.delivery_address ? JSON.parse(record.delivery_address) : undefined,
			notes: record.notes || undefined,

			// Customer information
			customerName: record.customer_name || undefined,
			customerPhone: record.customer_phone || undefined,
			userEmail: record.user_email || undefined,

			createdAt: new Date(record.created),
			updatedAt: new Date(record.updated)
		};
	}
}
