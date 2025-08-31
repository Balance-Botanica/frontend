// Domain interface for orders - defines the contract
export interface Order {
	id: string; // 6-digit order code
	userId: string;
	items: OrderItem[];
	total: number; // Total in kopiyky
	status: OrderStatus;
	deliveryAddress?: DeliveryAddress;
	notes?: string;

	// Customer information for Google Sheets sync
	customerName?: string; // Full name (First + Last)
	customerPhone?: string; // Phone number
	userEmail?: string; // User email from database

	createdAt: Date;
	updatedAt: Date;
}

export interface OrderItem {
	productId: string;
	productName: string;
	quantity: number;
	price: number; // Price per item in kopiyky
	total: number; // Total for this item in kopiyky
	size: string;
	flavor: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface CreateOrderData {
	userId: string;
	items: OrderItem[];
	total: number;
	deliveryAddress?: DeliveryAddress;
	notes?: string;

	// Customer information
	customerName?: string; // Full name (First + Last)
	customerPhone?: string; // Phone number
}

export interface OrderRepository {
	getOrdersByUserId(userId: string): Promise<Order[]>;
	getOrderById(orderId: string): Promise<Order | null>;
	getAllOrders(): Promise<Order[]>;
	createOrder(data: CreateOrderData): Promise<Order | null>;
	updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean>;
	updateOrderFields(orderId: string, updateData: Partial<Order>): Promise<boolean>;
}
