import { pb } from '../../pocketbase/index';
import type { PromoCodeRepository } from '../../domain/interfaces/promo-code.interface';

interface CreatePromoCodeData {
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

// Simple in-memory rate limiting (use Redis in production)
const rateLimitStore = new Map<string, { attempts: number; resetTime: number }>();

export class PocketBasePromoCodeRepository implements PromoCodeRepository {
	async findByCode(code: string): Promise<any> {
		try {
			const records = await pb.collection('promo_codes').getList(1, 1, {
				filter: `code = "${code}" && is_active = true`
			});

			return records.items[0] || null;
		} catch (error) {
			return null;
		}
	}

	async findById(id: string): Promise<any> {
		try {
			const record = await pb.collection('promo_codes').getOne(id);
			return record || null;
		} catch (error) {
			return null;
		}
	}

	async findAll(): Promise<any[]> {
		try {
			const records = await pb.collection('promo_codes').getList(1, 100, {
				sort: 'created'
			});
			return records.items;
		} catch (error) {
			return [];
		}
	}

	async create(data: CreatePromoCodeData): Promise<any> {
		try {
			const record = await pb.collection('promo_codes').create({
				code: data.code,
				description: data.description,
				discount_type: data.discountType,
				discount_value: data.discountValue,
				minimum_amount: data.minimumAmount || 0,
				maximum_discount: data.maximumDiscount,
				is_active: data.isActive !== undefined ? data.isActive : true,
				expires_at: data.expiresAt ? data.expiresAt.toISOString() : null,
				usage_limit: data.usageLimit,
				usage_count: 0,
				created: new Date().toISOString(),
				updated: new Date().toISOString()
			});

			return record;
		} catch (error) {
			throw error;
		}
	}

	async update(id: string, data: Partial<CreatePromoCodeData>): Promise<any> {
		try {
			const updateData: any = {
				updated: new Date().toISOString()
			};

			if (data.code !== undefined) updateData.code = data.code;
			if (data.description !== undefined) updateData.description = data.description;
			if (data.discountType !== undefined) updateData.discount_type = data.discountType;
			if (data.discountValue !== undefined) updateData.discount_value = data.discountValue;
			if (data.minimumAmount !== undefined) updateData.minimum_amount = data.minimumAmount;
			if (data.maximumDiscount !== undefined) updateData.maximum_discount = data.maximumDiscount;
			if (data.isActive !== undefined) updateData.is_active = data.isActive;
			if (data.expiresAt !== undefined)
				updateData.expires_at = data.expiresAt ? data.expiresAt.toISOString() : null;
			if (data.usageLimit !== undefined) updateData.usage_limit = data.usageLimit;

			const record = await pb.collection('promo_codes').update(id, updateData);
			return record;
		} catch (error) {
			throw error;
		}
	}

	async delete(id: string): Promise<void> {
		try {
			await pb.collection('promo_codes').delete(id);
		} catch (error) {
			throw error;
		}
	}

	async incrementUsage(id: string): Promise<void> {
		try {
			// Get current promo code to get current usage count
			const promoCode = await this.findById(id);
			if (promoCode) {
				await pb.collection('promo_codes').update(id, {
					usage_count: promoCode.usage_count + 1,
					updated: new Date().toISOString()
				});
			}
		} catch (error) {
			throw error;
		}
	}

	async recordUsage(promoCodeId: string, userId: string, orderId?: string): Promise<void> {
		try {
			await pb.collection('promo_code_usages').create({
				promo_code_id: promoCodeId,
				user_id: userId,
				order_id: orderId || null,
				used_at: new Date().toISOString()
			});
		} catch (error) {
			throw error;
		}
	}

	async hasUserUsedCode(userId: string, promoCodeId: string): Promise<boolean> {
		try {
			const records = await pb.collection('promo_code_usages').getList(1, 1, {
				filter: `user_id = "${userId}" && promo_code_id = "${promoCodeId}"`
			});

			return records.items.length > 0;
		} catch (error) {
			return false;
		}
	}

	async checkRateLimit(userId: string): Promise<{ allowed: boolean; remainingTime?: number }> {
		try {
			const now = Date.now();
			const windowMs = 5 * 60 * 1000; // 5 minutes
			const maxAttempts = 5; // 5 attempts per 5 minutes

			const userLimit = rateLimitStore.get(userId);

			if (!userLimit) {
				rateLimitStore.set(userId, { attempts: 1, resetTime: now + windowMs });
				return { allowed: true };
			}

			if (now > userLimit.resetTime) {
				// Reset the window
				rateLimitStore.set(userId, { attempts: 1, resetTime: now + windowMs });
				return { allowed: true };
			}

			if (userLimit.attempts >= maxAttempts) {
				return {
					allowed: false,
					remainingTime: Math.ceil((userLimit.resetTime - now) / 1000)
				};
			}

			userLimit.attempts++;
			rateLimitStore.set(userId, userLimit);

			return { allowed: true };
		} catch (error) {
			// If there's an error with rate limiting, allow the request
			return { allowed: true };
		}
	}
}
