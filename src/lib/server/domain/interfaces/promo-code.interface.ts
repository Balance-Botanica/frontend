import type { PromoCode, PromoCodeUsage } from '../../db/schema';

export interface PromoCodeRepository {
	findByCode(code: string): Promise<PromoCode | null>;
	findById(id: string): Promise<PromoCode | null>;
	findAll(): Promise<PromoCode[]>;
	create(data: CreatePromoCodeData): Promise<PromoCode>;
	update(id: string, data: Partial<CreatePromoCodeData>): Promise<PromoCode>;
	delete(id: string): Promise<void>;
	incrementUsage(id: string): Promise<void>;
	recordUsage(promoCodeId: string, userId: string, orderId?: string): Promise<void>;
	hasUserUsedCode(userId: string, promoCodeId: string): Promise<boolean>;
	checkRateLimit(userId: string): Promise<{ allowed: boolean; remainingTime?: number }>;
}

export interface CreatePromoCodeData {
	code?: string;
	description?: string;
	discountType: 'percentage' | 'fixed' | 'free_shipping';
	discountValue: number;
	minimumAmount?: number;
	maximumDiscount?: number;
	expiresAt?: Date;
	usageLimit?: number;
	isActive?: boolean;
}

export interface PromoCodeValidationResult {
	valid: boolean;
	promoCode?: PromoCode;
	discount?: number;
	error?: string;
	message: string;
}
