import { eq, and, sql } from 'drizzle-orm';
import { db } from '../db/connection';
import { promoCodes, promoCodeUsages } from '../db/schema';
import type {
	PromoCodeRepository,
	CreatePromoCodeData
} from '../../domain/interfaces/promo-code.interface';

// Simple in-memory rate limiting (use Redis in production)
const rateLimitStore = new Map<string, { attempts: number; resetTime: number }>();

export class DrizzlePromoCodeRepository implements PromoCodeRepository {
	async findByCode(code: string): Promise<any> {
		const result = await db
			.select()
			.from(promoCodes)
			.where(and(eq(promoCodes.code, code), eq(promoCodes.isActive, true)))
			.limit(1);

		return result[0] || null;
	}

	async findById(id: string): Promise<any> {
		const result = await db.select().from(promoCodes).where(eq(promoCodes.id, id)).limit(1);

		return result[0] || null;
	}

	async findAll(): Promise<any[]> {
		return await db.select().from(promoCodes).orderBy(promoCodes.createdAt);
	}

	async create(data: CreatePromoCodeData): Promise<any> {
		const [result] = await db
			.insert(promoCodes)
			.values({
				id: crypto.randomUUID(),
				code: data.code,
				description: data.description,
				discountType: data.discountType,
				discountValue: data.discountValue,
				minimumAmount: data.minimumAmount || 0,
				maximumDiscount: data.maximumDiscount,
				isActive: data.isActive !== undefined ? data.isActive : true,
				expiresAt: data.expiresAt,
				usageLimit: data.usageLimit
			})
			.returning();

		return result;
	}

	async update(id: string, data: Partial<CreatePromoCodeData>): Promise<any> {
		const updateData: any = {
			updatedAt: new Date()
		};

		if (data.code !== undefined) updateData.code = data.code;
		if (data.description !== undefined) updateData.description = data.description;
		if (data.discountType !== undefined) updateData.discountType = data.discountType;
		if (data.discountValue !== undefined) updateData.discountValue = data.discountValue;
		if (data.minimumAmount !== undefined) updateData.minimumAmount = data.minimumAmount;
		if (data.maximumDiscount !== undefined) updateData.maximumDiscount = data.maximumDiscount;
		if (data.isActive !== undefined) updateData.isActive = data.isActive;
		if (data.expiresAt !== undefined) updateData.expiresAt = data.expiresAt;
		if (data.usageLimit !== undefined) updateData.usageLimit = data.usageLimit;

		const [result] = await db
			.update(promoCodes)
			.set(updateData)
			.where(eq(promoCodes.id, id))
			.returning();

		return result;
	}

	async delete(id: string): Promise<void> {
		await db.delete(promoCodes).where(eq(promoCodes.id, id));
	}

	async incrementUsage(id: string): Promise<void> {
		await db
			.update(promoCodes)
			.set({
				usageCount: sql`${promoCodes.usageCount} + 1`,
				updatedAt: new Date()
			})
			.where(eq(promoCodes.id, id));
	}

	async recordUsage(promoCodeId: string, userId: string, orderId?: string): Promise<void> {
		await db.insert(promoCodeUsages).values({
			id: crypto.randomUUID(),
			promoCodeId,
			userId,
			orderId
		});
	}

	async hasUserUsedCode(userId: string, promoCodeId: string): Promise<boolean> {
		const result = await db
			.select()
			.from(promoCodeUsages)
			.where(and(eq(promoCodeUsages.userId, userId), eq(promoCodeUsages.promoCodeId, promoCodeId)))
			.limit(1);

		return result.length > 0;
	}

	async checkRateLimit(userId: string): Promise<{ allowed: boolean; remainingTime?: number }> {
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
	}
}
