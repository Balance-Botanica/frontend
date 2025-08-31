#!/usr/bin/env node

// Устанавливаем переменные окружения напрямую
process.env.GOOGLE_SHEETS_SPREADSHEET_ID = '1DoSeIo_Isq9MBvXVnkdNNShmG5hde6c4hcUetEU04lM';

import { GoogleSheetsService } from '../src/lib/server/services/google-sheets.service.ts';

console.log('🧹 Clearing Google Sheets orders...');

try {
	const sheetsService = new GoogleSheetsService();

	// Очистить все заказы из текущего месяца
	console.log('📅 Clearing orders from current month sheet...');
	await sheetsService.clearAllOrders();

	console.log('✅ Google Sheets cleared successfully!');
	console.log('📋 All orders have been removed from the sheet');

} catch (error) {
	console.error('❌ Failed to clear Google Sheets:', error);
	process.exit(1);
}
