import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PromoCodeService } from '$lib/server/application/services/promo-code.service';

// Lazy load service to avoid circular dependencies
let promoCodeService: PromoCodeService | null = null;

function getPromoCodeService(): PromoCodeService {
	if (!promoCodeService) {
		promoCodeService = new PromoCodeService();
	}
	return promoCodeService;
}

export async function POST({ request, locals }: { request: Request; locals: any }) {
	try {
		// Check authentication
		if (!locals.user?.id) {
			throw error(401, 'Authentication required');
		}

		const { action, code, cartTotal } = await request.json();

		if (!action) {
			throw error(400, 'Action is required');
		}

		const service = getPromoCodeService();
		const userId = locals.user.id;

		switch (action) {
			case 'validate': {
				if (!code || !cartTotal) {
					throw error(400, 'Code and cart total are required for validation');
				}

				const result = await service.validatePromoCode(code.toUpperCase(), userId, cartTotal);

				return json({
					success: result.valid,
					...result
				});
			}

			case 'remove': {
				// For now, just return success - we can implement removal logic later
				return json({
					success: true,
					message: 'Promo code removed successfully'
				});
			}

			default:
				throw error(400, 'Invalid action');
		}
	} catch (err: any) {
		console.error('Promo code API error:', err);

		if (err.status) {
			throw err;
		}

		throw error(500, 'Internal server error');
	}
}

// GET endpoint for admin to fetch promo codes
export async function GET({ locals }: { locals: any }) {
	try {
		// Check authentication
		if (!locals.user?.id) {
			throw error(401, 'Authentication required');
		}

		// TODO: Add admin role check here

		const service = getPromoCodeService();
		const promoCodes = await service.getAllPromoCodes();

		return json({
			success: true,
			promoCodes
		});
	} catch (err: any) {
		console.error('Promo codes GET error:', err);

		if (err.status) {
			throw err;
		}

		throw error(500, 'Internal server error');
	}
}
