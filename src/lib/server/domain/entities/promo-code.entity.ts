export interface PromoCode {
	id: string;
	code: string;
	description?: string;
	discountType: 'percentage' | 'fixed' | 'free_shipping';
	discountValue: number;
	minimumAmount?: number;
	maximumDiscount?: number;
	isActive: boolean;
	expiresAt?: Date;
	usageLimit?: number;
	usageCount?: number;
	created: Date;
	updated: Date;
}

export interface PromoCodeUsage {
	id: string;
	promoCodeId: string;
	userId: string;
	orderId?: string;
	usedAt: Date;
}
