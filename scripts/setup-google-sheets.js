#!/usr/bin/env node

// Загружаем переменные окружения
import { config } from 'dotenv';
config();

import { GoogleSheetsService } from '../src/lib/server/services/google-sheets.service.ts';

console.log('🔧 Setting up Google Sheets for Balance Botanica...');

try {
	const sheetsService = new GoogleSheetsService();

	// Создать лист для текущего месяца
	console.log('📅 Ensuring current month sheet exists...');
	await sheetsService.ensureMonthSheetExists();

	console.log('✅ Google Sheets setup completed!');
	console.log('📋 Your table is ready for order management');

} catch (error) {
	console.error('❌ Failed to setup Google Sheets:', error);
	process.exit(1);
}
