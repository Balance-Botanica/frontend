import { DrizzlePromoCodeRepository } from '../../data/repositories/drizzle-promo-code.repository';
import type {
	PromoCodeRepository,
	PromoCode,
	CreatePromoCodeData,
	PromoCodeValidationResult
} from '../../domain/interfaces/promo-code.interface';

export class PromoCodeService {
	private promoCodeRepository: PromoCodeRepository;

	constructor() {
		this.promoCodeRepository = new DrizzlePromoCodeRepository();
	}

	/**
	 * Validate a promo code for a user
	 */
	async validatePromoCode(
		code: string,
		userId: string,
		cartTotal: number
	): Promise<PromoCodeValidationResult> {
		try {
			// Rate limiting check (implement in repository)
			const rateLimitCheck = await this.promoCodeRepository.checkRateLimit(userId);
			if (!rateLimitCheck.allowed) {
				return {
					valid: false,
					error: 'rate_limit_exceeded',
					message: 'Too many promo code attempts. Please try again later.'
				};
			}

			// Find the promo code
			const promoCode = await this.promoCodeRepository.findByCode(code);
			if (!promoCode) {
				return {
					valid: false,
					error: 'code_not_found',
					message: 'Promo code not found.'
				};
			}

			// Check if active
			if (!promoCode.isActive) {
				return {
					valid: false,
					error: 'code_inactive',
					message: 'This promo code is no longer active.'
				};
			}

			// Check expiration
			if (promoCode.expiresAt && new Date(promoCode.expiresAt) < new Date()) {
				return {
					valid: false,
					error: 'code_expired',
					message: 'This promo code has expired.'
				};
			}

			// Check usage limit
			if (promoCode.usageLimit && promoCode.usageCount >= promoCode.usageLimit) {
				return {
					valid: false,
					error: 'usage_limit_exceeded',
					message: 'This promo code has reached its usage limit.'
				};
			}

			// Check minimum amount
			if (promoCode.minimumAmount && cartTotal < promoCode.minimumAmount) {
				return {
					valid: false,
					error: 'minimum_amount_not_met',
					message: `Minimum order amount of ₴${promoCode.minimumAmount} required.`
				};
			}

			// Check if user already used this code
			const hasUsed = await this.promoCodeRepository.hasUserUsedCode(userId, promoCode.id);
			if (hasUsed) {
				return {
					valid: false,
					error: 'already_used',
					message: 'You have already used this promo code.'
				};
			}

			// Calculate discount
			const discount = this.calculateDiscount(promoCode, cartTotal);

			return {
				valid: true,
				promoCode,
				discount,
				message: 'Promo code applied successfully!'
			};
		} catch (error) {
			console.error('Promo code validation error:', error);
			return {
				valid: false,
				error: 'validation_error',
				message: 'An error occurred while validating the promo code.'
			};
		}
	}

	/**
	 * Calculate discount amount based on promo code type
	 */
	private calculateDiscount(promoCode: PromoCode, cartTotal: number): number {
		let discount = 0;

		switch (promoCode.discountType) {
			case 'percentage':
				discount = (cartTotal * promoCode.discountValue) / 100;
				break;
			case 'fixed':
				discount = promoCode.discountValue;
				break;
			case 'free_shipping':
				// This will be handled separately in checkout
				discount = 0;
				break;
		}

		// Apply maximum discount limit if set
		if (promoCode.maximumDiscount && discount > promoCode.maximumDiscount) {
			discount = promoCode.maximumDiscount;
		}

		// Ensure discount doesn't exceed cart total
		return Math.min(discount, cartTotal);
	}

	/**
	 * Record promo code usage
	 */
	async recordUsage(promoCodeId: string, userId: string, orderId?: string): Promise<void> {
		await this.promoCodeRepository.incrementUsage(promoCodeId);
		await this.promoCodeRepository.recordUsage(promoCodeId, userId, orderId);
	}

	/**
	 * Create a new promo code (admin function)
	 */
	async createPromoCode(data: CreatePromoCodeData): Promise<PromoCode> {
		// Generate unique code if not provided
		if (!data.code) {
			data.code = this.generateUniqueCode();
		}

		return await this.promoCodeRepository.create(data);
	}

	/**
	 * Get all promo codes (admin function)
	 */
	async getAllPromoCodes(): Promise<PromoCode[]> {
		return await this.promoCodeRepository.findAll();
	}

	/**
	 * Update promo code (admin function)
	 */
	async updatePromoCode(id: string, data: Partial<CreatePromoCodeData>): Promise<PromoCode> {
		return await this.promoCodeRepository.update(id, data);
	}

	/**
	 * Delete promo code (admin function)
	 */
	async deletePromoCode(id: string): Promise<void> {
		await this.promoCodeRepository.delete(id);
	}

	/**
	 * Generate a unique promo code
	 */
	private generateUniqueCode(): string {
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		let code = '';

		// Generate 8-character code
		for (let i = 0; i < 8; i++) {
			code += chars.charAt(Math.floor(Math.random() * chars.length));
		}

		// Add prefix for better UX
		return `BAL${code}`;
	}
}
