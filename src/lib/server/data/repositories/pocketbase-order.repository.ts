import { getAuthenticatedClient } from '../../pocketbase/index';
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
			const pb = await getAuthenticatedClient();
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
			const pb = await getAuthenticatedClient();
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
			const pb = await getAuthenticatedClient();
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
			const pb = await getAuthenticatedClient();

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
			const pb = await getAuthenticatedClient();

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
			const pb = await getAuthenticatedClient();

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
			return true;
		} catch (error) {
			console.error('[PocketBaseOrderRepository] Error updating order fields:', error);
			return false;
		}
	}

	async deleteOrder(orderId: string): Promise<boolean> {
		try {
			console.log('[PocketBaseOrderRepository] Deleting order:', orderId);
			const pb = await getAuthenticatedClient();
			await pb.collection('orders').delete(orderId);
			console.log('[PocketBaseOrderRepository] Order deleted successfully');
			return true;
		} catch (error) {
			console.error('[PocketBaseOrderRepository] Error deleting order:', error);
			return false;
		}
	}

	// Map PocketBase record to domain model
	private mapOrderToDomain(record: any): Order {
		return {
			id: record.id,
			userId: record.user_id,
			items: this.parseItems(record.items),
			total: record.total,
			status: record.status as OrderStatus,
			deliveryAddress: record.delivery_address ? JSON.parse(record.delivery_address) : null,
			notes: record.notes,
			customerName: record.customer_name,
			customerPhone: record.customer_phone,
			userEmail: record.user_email,
			createdAt: new Date(record.created),
			updatedAt: new Date(record.updated)
		};
	}

	// Parse items from JSON string
	private parseItems(items: string | any[]): OrderItem[] {
		if (Array.isArray(items)) {
			return items;
		}
		try {
			return JSON.parse(items);
		} catch (error) {
			console.error('[PocketBaseOrderRepository] Error parsing items:', error);
			return [];
		}
	}
}
