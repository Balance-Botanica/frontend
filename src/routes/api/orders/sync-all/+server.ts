import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { orderService } from '$lib/server/application/services/order.service';

export const POST: RequestHandler = async ({ request }) => {
	try {
		console.log('[API] Starting full orders sync to Google Sheets...');

		// Запускаем синхронизацию асинхронно
		orderService
			.syncAllOrdersToSheets()
			.then(() => {
				console.log('[API] Full sync completed successfully');
			})
			.catch((error) => {
				console.error('[API] Full sync failed:', error);
			});

		return json({
			success: true,
			message: 'Full sync started. Check server logs for progress.',
			timestamp: new Date().toISOString()
		});
	} catch (error) {
		console.error('[API] Error starting full sync:', error);
		return json(
			{
				success: false,
				error: 'Failed to start sync',
				timestamp: new Date().toISOString()
			},
			{ status: 500 }
		);
	}
};
