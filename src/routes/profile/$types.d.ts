import type { DeliveryAddress } from '$lib/server/domain/interfaces/user.interface';

export interface PageData {
	deliveryAddresses: DeliveryAddress[];
}

export interface ActionData {
	success: boolean;
	error?: string;
	deliveryAddress?: DeliveryAddress;
}
