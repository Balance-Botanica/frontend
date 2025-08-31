import { google } from 'googleapis';
import { readFileSync } from 'fs';
import { join } from 'path';
import type { Order, OrderStatus } from '../domain/interfaces/order.interface';

export class GoogleSheetsService {
	private sheets: any;
	private spreadsheetId: string;
	private auth: any;

	constructor() {
		this.spreadsheetId = '1DoSeIo_Isq9MBvXVnkdNNShmG5hde6c4hcUetEU04lM'; // Твоя таблица
		this.initializeAuth();
		this.initializeSheets();
	}

	private initializeAuth() {
		try {
			// Читаем путь к credentials из переменной окружения
			const credentialsPath =
				process.env.GOOGLE_CREDENTIALS_PATH || './balance-botanica-d061b04ea697.json';
			const fullPath = join(process.cwd(), credentialsPath);
			const credentials = JSON.parse(readFileSync(fullPath, 'utf8'));

			this.auth = new google.auth.GoogleAuth({
				credentials,
				scopes: ['https://www.googleapis.com/auth/spreadsheets']
			});
		} catch (error) {
			console.error('Failed to initialize Google Auth:', error);
			console.error('Make sure GOOGLE_CREDENTIALS_PATH is set in .env file');
			throw error;
		}
	}

	private initializeSheets() {
		this.sheets = google.sheets({ version: 'v4', auth: this.auth });
	}

	// Получить текущий месяц и год для листа
	private getCurrentMonthSheetName(): string {
		const now = new Date();
		const monthNames = [
			'Січень',
			'Лютий',
			'Березень',
			'Квітень',
			'Травень',
			'Червень',
			'Липень',
			'Серпень',
			'Вересень',
			'Жовтень',
			'Листопад',
			'Грудень'
		];
		return `${monthNames[now.getMonth()]} ${now.getFullYear()}`;
	}

	// Создать новый лист для месяца если его нет
	private async ensureMonthSheetExists(): Promise<string> {
		try {
			const sheetName = this.getCurrentMonthSheetName();

			// Получить список листов
			const response = await this.sheets.spreadsheets.get({
				spreadsheetId: this.spreadsheetId
			});

			const sheets = response.data.sheets || [];
			const sheetExists = sheets.some((sheet: any) => sheet.properties?.title === sheetName);

			if (!sheetExists) {
				// Создать новый лист
				await this.sheets.spreadsheets.batchUpdate({
					spreadsheetId: this.spreadsheetId,
					requestBody: {
						requests: [
							{
								addSheet: {
									properties: {
										title: sheetName
									}
								}
							}
						]
					}
				});

				// Добавить заголовки
				await this.initializeSheetHeaders(sheetName);
			}

			return sheetName;
		} catch (error) {
			console.error('Failed to ensure month sheet exists:', error);
			throw error;
		}
	}

	// Инициализировать заголовки листа
	private async initializeSheetHeaders(sheetName: string): Promise<void> {
		const headers = [
			'Order ID',
			'Create Date',
			'Client Name',
			'Phone Number',
			'Email',
			'Delivery Address',
			'Products Bought',
			'Sum(Total)',
			'Status',
			'ТТН Нова Пошта',
			'Comments',
			'Update Date'
		];

		await this.sheets.spreadsheets.values.update({
			spreadsheetId: this.spreadsheetId,
			range: `${sheetName}!A1:L1`,
			valueInputOption: 'RAW',
			requestBody: {
				values: [headers]
			}
		});

		// Установить ширину колонок
		await this.sheets.spreadsheets.batchUpdate({
			spreadsheetId: this.spreadsheetId,
			requestBody: {
				requests: [
					{
						updateDimensionProperties: {
							range: {
								sheetId: await this.getSheetId(sheetName),
								dimension: 'COLUMNS',
								startIndex: 0,
								endIndex: 1
							},
							properties: { pixelSize: 100 },
							fields: 'pixelSize'
						}
					},
					{
						updateDimensionProperties: {
							range: {
								sheetId: await this.getSheetId(sheetName),
								dimension: 'COLUMNS',
								startIndex: 1,
								endIndex: 2
							},
							properties: { pixelSize: 120 },
							fields: 'pixelSize'
						}
					},
					{
						updateDimensionProperties: {
							range: {
								sheetId: await this.getSheetId(sheetName),
								dimension: 'COLUMNS',
								startIndex: 2,
								endIndex: 3
							},
							properties: { pixelSize: 150 },
							fields: 'pixelSize'
						}
					},
					{
						updateDimensionProperties: {
							range: {
								sheetId: await this.getSheetId(sheetName),
								dimension: 'COLUMNS',
								startIndex: 3,
								endIndex: 4
							},
							properties: { pixelSize: 120 },
							fields: 'pixelSize'
						}
					},
					{
						updateDimensionProperties: {
							range: {
								sheetId: await this.getSheetId(sheetName),
								dimension: 'COLUMNS',
								startIndex: 4,
								endIndex: 5
							},
							properties: { pixelSize: 200 },
							fields: 'pixelSize'
						}
					},
					{
						updateDimensionProperties: {
							range: {
								sheetId: await this.getSheetId(sheetName),
								dimension: 'COLUMNS',
								startIndex: 5,
								endIndex: 6
							},
							properties: { pixelSize: 300 },
							fields: 'pixelSize'
						}
					},
					{
						updateDimensionProperties: {
							range: {
								sheetId: await this.getSheetId(sheetName),
								dimension: 'COLUMNS',
								startIndex: 6,
								endIndex: 7
							},
							properties: { pixelSize: 400 },
							fields: 'pixelSize'
						}
					},
					{
						updateDimensionProperties: {
							range: {
								sheetId: await this.getSheetId(sheetName),
								dimension: 'COLUMNS',
								startIndex: 7,
								endIndex: 8
							},
							properties: { pixelSize: 100 },
							fields: 'pixelSize'
						}
					},
					{
						updateDimensionProperties: {
							range: {
								sheetId: await this.getSheetId(sheetName),
								dimension: 'COLUMNS',
								startIndex: 8,
								endIndex: 9
							},
							properties: { pixelSize: 120 },
							fields: 'pixelSize'
						}
					},
					{
						updateDimensionProperties: {
							range: {
								sheetId: await this.getSheetId(sheetName),
								dimension: 'COLUMNS',
								startIndex: 9,
								endIndex: 10
							},
							properties: { pixelSize: 150 },
							fields: 'pixelSize'
						}
					},
					{
						updateDimensionProperties: {
							range: {
								sheetId: await this.getSheetId(sheetName),
								dimension: 'COLUMNS',
								startIndex: 10,
								endIndex: 11
							},
							properties: { pixelSize: 200 },
							fields: 'pixelSize'
						}
					},
					{
						updateDimensionProperties: {
							range: {
								sheetId: await this.getSheetId(sheetName),
								dimension: 'COLUMNS',
								startIndex: 11,
								endIndex: 12
							},
							properties: { pixelSize: 120 },
							fields: 'pixelSize'
						}
					}
				]
			}
		});

		// Создать data validation для колонки Status
		await this.setupStatusValidation(sheetName);
	}

	// Получить ID листа по имени
	private async getSheetId(sheetName: string): Promise<number> {
		const response = await this.sheets.spreadsheets.get({
			spreadsheetId: this.spreadsheetId
		});

		const sheet = response.data.sheets?.find((s: any) => s.properties?.title === sheetName);
		if (!sheet) {
			throw new Error(`Sheet ${sheetName} not found`);
		}

		return sheet.properties?.sheetId || 0;
	}

	// Настроить валидацию для статуса
	private async setupStatusValidation(sheetName: string): Promise<void> {
		const sheetId = await this.getSheetId(sheetName);

		await this.sheets.spreadsheets.batchUpdate({
			spreadsheetId: this.spreadsheetId,
			requestBody: {
				requests: [
					{
						setDataValidation: {
							range: {
								sheetId: sheetId,
								startRowIndex: 1, // Начиная со второй строки (после заголовка)
								endRowIndex: 1000, // До 1000 строки
								startColumnIndex: 8, // Колонка I (Status)
								endColumnIndex: 9
							},
							rule: {
								condition: {
									type: 'ONE_OF_LIST',
									values: [
										{ userEnteredValue: 'pending' },
										{ userEnteredValue: 'confirmed' },
										{ userEnteredValue: 'shipped' },
										{ userEnteredValue: 'delivered' },
										{ userEnteredValue: 'cancelled' }
									]
								},
								strict: true,
								showCustomUi: true
							}
						}
					}
				]
			}
		});
	}

	// Добавить новый заказ в таблицу
	async addOrder(order: Order): Promise<void> {
		try {
			const sheetName = await this.ensureMonthSheetExists();

			// Подготовить данные заказа
			const orderData = [
				order.id,
				new Date(order.createdAt).toLocaleDateString('uk-UA'),
				order.customerName || '', // Client Name from order data
				order.customerPhone || '', // Phone Number from order data
				order.userEmail || '', // Email from user data
				this.formatDeliveryAddress(order.deliveryAddress),
				this.formatProducts(order.items),
				`${(order.total / 100).toFixed(2)} ₴`,
				order.status,
				'', // ТТН Нова Пошта (будет заполняться при отправке)
				order.notes || '',
				new Date().toLocaleDateString('uk-UA')
			];

			// Найти следующую свободную строку
			const response = await this.sheets.spreadsheets.values.get({
				spreadsheetId: this.spreadsheetId,
				range: `${sheetName}!A:A`
			});

			const nextRow = (response.data.values?.length || 0) + 1;

			// Добавить заказ
			await this.sheets.spreadsheets.values.update({
				spreadsheetId: this.spreadsheetId,
				range: `${sheetName}!A${nextRow}:L${nextRow}`,
				valueInputOption: 'RAW',
				requestBody: {
					values: [orderData]
				}
			});

			console.log(`Order ${order.id} added to Google Sheets`);
		} catch (error) {
			console.error('Failed to add order to Google Sheets:', error);
			throw error;
		}
	}

	// Обновить статус заказа
	async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
		try {
			console.log('[GoogleSheets] Starting updateOrderStatus:', orderId, '->', status);

			// Найти заказ во всех листах
			const { sheetName, rowIndex } = await this.findOrderInAllSheets(orderId);
			console.log('[GoogleSheets] Order found in sheet:', sheetName, 'at row:', rowIndex);

			if (!sheetName || rowIndex === -1) {
				throw new Error(`Order ${orderId} not found in any Google Sheets`);
			}

			// Обновить статус и дату обновления
			console.log('[GoogleSheets] Updating range:', `${sheetName}!I${rowIndex}:L${rowIndex}`);
			console.log('[GoogleSheets] New values:', [
				status,
				'',
				'',
				new Date().toLocaleDateString('uk-UA')
			]);

			await this.sheets.spreadsheets.values.update({
				spreadsheetId: this.spreadsheetId,
				range: `${sheetName}!I${rowIndex}:L${rowIndex}`,
				valueInputOption: 'RAW',
				requestBody: {
					values: [[status, '', '', new Date().toLocaleDateString('uk-UA')]]
				}
			});

			console.log(
				`[GoogleSheets] Order ${orderId} status updated to ${status} in Google Sheets successfully`
			);
		} catch (error) {
			console.error('[GoogleSheets] Failed to update order status in Google Sheets:', error);
			console.error(
				'[GoogleSheets] Error details:',
				error instanceof Error ? error.message : String(error)
			);
			throw error;
		}
	}

	// Обновить ТТН для заказа
	async updateOrderTTN(orderId: string, ttn: string): Promise<void> {
		try {
			console.log('[GoogleSheets] Starting updateOrderTTN:', orderId, '->', ttn);

			// Найти заказ во всех листах
			const { sheetName, rowIndex } = await this.findOrderInAllSheets(orderId);
			console.log('[GoogleSheets] Order found in sheet:', sheetName, 'at row:', rowIndex);

			if (!sheetName || rowIndex === -1) {
				throw new Error(`Order ${orderId} not found in any Google Sheets`);
			}

			// Обновить ТТН в колонке J (10-й столбец)
			console.log('[GoogleSheets] Updating TTN in range:', `${sheetName}!J${rowIndex}`);

			await this.sheets.spreadsheets.values.update({
				spreadsheetId: this.spreadsheetId,
				range: `${sheetName}!J${rowIndex}`,
				valueInputOption: 'RAW',
				requestBody: {
					values: [[ttn]]
				}
			});

			console.log(
				`[GoogleSheets] Order ${orderId} TTN updated to ${ttn} in Google Sheets successfully`
			);
		} catch (error) {
			console.error('[GoogleSheets] Failed to update order TTN in Google Sheets:', error);
			console.error(
				'[GoogleSheets] Error details:',
				error instanceof Error ? error.message : String(error)
			);
			throw error;
		}
	}

	// Получить все заказы из таблицы
	async getAllOrders(): Promise<any[]> {
		try {
			console.log('[GoogleSheets] Getting all orders from all sheets...');

			// Получить список всех листов
			const spreadsheetResponse = await this.sheets.spreadsheets.get({
				spreadsheetId: this.spreadsheetId
			});

			const sheets = spreadsheetResponse.data.sheets || [];
			const allOrders: any[] = [];

			// Проходим по каждому листу
			for (const sheet of sheets) {
				const sheetName = sheet.properties?.title;
				if (!sheetName) continue;

				console.log(`[GoogleSheets] Reading orders from sheet: ${sheetName}`);

				try {
					const response = await this.sheets.spreadsheets.values.get({
						spreadsheetId: this.spreadsheetId,
						range: `${sheetName}!A:L`
					});

					const rows = response.data.values || [];
					if (rows.length <= 1) continue; // Только заголовки

					const sheetOrders = rows.slice(1).map((row: any[]) => ({
						id: row[0],
						createDate: row[1],
						clientName: row[2],
						phoneNumber: row[3],
						email: row[4],
						deliveryAddress: row[5],
						products: row[6],
						sum: row[7],
						status: row[8],
						ttn: row[9],
						comments: row[10],
						updateDate: row[11],
						sheetName: sheetName // Добавляем название листа для отладки
					}));

					allOrders.push(...sheetOrders);
					console.log(`[GoogleSheets] Found ${sheetOrders.length} orders in sheet ${sheetName}`);
				} catch (sheetError) {
					console.warn(
						`[GoogleSheets] Error reading sheet ${sheetName}:`,
						sheetError instanceof Error ? sheetError.message : String(sheetError)
					);
					// Продолжаем чтение других листов
				}
			}

			console.log(`[GoogleSheets] Total orders found across all sheets: ${allOrders.length}`);
			return allOrders;
		} catch (error) {
			console.error('[GoogleSheets] Failed to get orders from Google Sheets:', error);
			return [];
		}
	}

	// Вспомогательные методы форматирования
	private formatDeliveryAddress(address: any): string {
		if (!address) return '';

		// Если адрес пришел как строка JSON, распарсим его
		let parsedAddress = address;
		if (typeof address === 'string') {
			try {
				parsedAddress = JSON.parse(address);
			} catch (e) {
				console.log('[GoogleSheetsService] Failed to parse delivery address JSON:', address);
				return 'Ошибка форматирования адреса';
			}
		}

		let result = '';

		// Обработка Nova Poshta адреса
		if (parsedAddress.useNovaPost && parsedAddress.npWarehouse) {
			if (parsedAddress.npCityFullName) result += parsedAddress.npCityFullName;
			result += `, ${parsedAddress.npWarehouse}`;
			return result;
		}

		// Обработка обычного адреса
		if (parsedAddress.street) result += parsedAddress.street;
		if (parsedAddress.city) result += result ? `, ${parsedAddress.city}` : parsedAddress.city;
		if (parsedAddress.postalCode)
			result += result ? `, ${parsedAddress.postalCode}` : parsedAddress.postalCode;
		if (parsedAddress.country && parsedAddress.country !== 'Ukraine')
			result += result ? `, ${parsedAddress.country}` : parsedAddress.country;

		return result || 'Адрес доставки не указан';
	}

	private formatProducts(items: any[]): string {
		if (!items || items.length === 0) return '';

		return items.map((item) => `${item.productName} (${item.quantity} шт.)`).join('; ');
	}

	async clearAllOrders(): Promise<void> {
		try {
			console.log('[GoogleSheetsService] Clearing all orders from sheet...');

			const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
			if (!spreadsheetId) {
				throw new Error('GOOGLE_SHEETS_SPREADSHEET_ID not found in environment');
			}

			const sheetName = this.getCurrentMonthSheetName();
			const range = `${sheetName}!A2:J`; // Очистить все строки начиная со второй (заголовки)

			// Очистить диапазон
			await this.sheets.spreadsheets.values.clear({
				spreadsheetId,
				range
			});

			console.log('[GoogleSheetsService] All orders cleared from sheet successfully');
		} catch (error) {
			console.error('[GoogleSheetsService] Error clearing orders from sheet:', error);
			throw error;
		}
	}

	// Очистить старые заказы, которых нет в БД
	async cleanupOldOrders(dbOrderIds: string[]): Promise<void> {
		try {
			console.log('[GoogleSheets] Starting cleanup of old orders...');
			console.log(`[GoogleSheets] DB has ${dbOrderIds.length} orders`);

			// Получить список всех листов
			const spreadsheetResponse = await this.sheets.spreadsheets.get({
				spreadsheetId: this.spreadsheetId
			});

			const sheets = spreadsheetResponse.data.sheets || [];
			let totalCleaned = 0;

			// Проходим по каждому листу
			for (const sheet of sheets) {
				const sheetName = sheet.properties?.title;
				if (!sheetName) continue;

				console.log(`[GoogleSheets] Checking sheet: ${sheetName}`);

				try {
					const response = await this.sheets.spreadsheets.values.get({
						spreadsheetId: this.spreadsheetId,
						range: `${sheetName}!A:A`
					});

					const rows = response.data.values || [];
					if (rows.length <= 1) continue; // Только заголовки

					// Найти строки для удаления (начиная с конца чтобы индексы не смещались)
					const rowsToDelete: number[] = [];

					for (let i = rows.length - 1; i >= 1; i--) {
						// Начиная с 1 (после заголовка)
						const orderId = rows[i][0]; // ID в первом столбце
						if (orderId && !dbOrderIds.includes(orderId)) {
							rowsToDelete.push(i + 1); // +1 потому что индексация с 1
							console.log(`[GoogleSheets] Found old order to delete: ${orderId} at row ${i + 1}`);
						}
					}

					// Удаляем строки (от большего индекса к меньшему)
					for (const rowIndex of rowsToDelete.sort((a, b) => b - a)) {
						try {
							await this.sheets.spreadsheets.batchUpdate({
								spreadsheetId: this.spreadsheetId,
								requestBody: {
									requests: [
										{
											deleteRange: {
												range: {
													sheetId: sheet.properties?.sheetId,
													startRowIndex: rowIndex - 1, // -1 потому что индексация с 0
													endRowIndex: rowIndex,
													startColumnIndex: 0,
													endColumnIndex: 12 // Все столбцы A-L
												},
												shiftDimension: 'ROWS'
											}
										}
									]
								}
							});

							totalCleaned++;
							console.log(
								`[GoogleSheets] Deleted old order at row ${rowIndex} in sheet ${sheetName}`
							);
						} catch (deleteError) {
							console.error(
								`[GoogleSheets] Failed to delete row ${rowIndex} in ${sheetName}:`,
								deleteError
							);
						}
					}
				} catch (sheetError) {
					console.warn(
						`[GoogleSheets] Error processing sheet ${sheetName}:`,
						sheetError instanceof Error ? sheetError.message : String(sheetError)
					);
				}
			}

			console.log(`[GoogleSheets] Cleanup completed. Deleted ${totalCleaned} old orders.`);
		} catch (error) {
			console.error('[GoogleSheets] Error during cleanup:', error);
			throw error;
		}
	}

	// Найти заказ во всех листах таблицы
	private async findOrderInAllSheets(
		orderId: string
	): Promise<{ sheetName: string; rowIndex: number }> {
		try {
			console.log('[GoogleSheets] Searching for order', orderId, 'in all sheets...');

			// Получить список всех листов
			const spreadsheetResponse = await this.sheets.spreadsheets.get({
				spreadsheetId: this.spreadsheetId
			});

			const sheets = spreadsheetResponse.data.sheets || [];
			console.log(
				'[GoogleSheets] Found sheets:',
				sheets.map((s: any) => s.properties?.title)
			);

			// Проходим по каждому листу
			for (const sheet of sheets) {
				const sheetName = sheet.properties?.title;
				if (!sheetName) continue;

				console.log('[GoogleSheets] Checking sheet:', sheetName);

				try {
					// Получить данные листа
					const response = await this.sheets.spreadsheets.values.get({
						spreadsheetId: this.spreadsheetId,
						range: `${sheetName}!A:L`
					});

					const rows = response.data.values || [];
					console.log(`[GoogleSheets] Sheet ${sheetName} has ${rows.length} rows`);

					// Найти заказ в этом листе
					for (let i = 1; i < rows.length; i++) {
						// Начиная со второй строки (после заголовка)
						if (rows[i][0] === orderId) {
							const rowIndex = i + 1; // +1 потому что индексация с 1
							console.log(
								`[GoogleSheets] Order ${orderId} found in sheet ${sheetName} at row ${rowIndex}`
							);
							return { sheetName, rowIndex };
						}
					}
				} catch (sheetError) {
					console.warn(
						`[GoogleSheets] Error reading sheet ${sheetName}:`,
						sheetError instanceof Error ? sheetError.message : String(sheetError)
					);
					// Продолжаем проверку других листов
				}
			}

			console.error(`[GoogleSheets] Order ${orderId} not found in any sheet`);
			return { sheetName: '', rowIndex: -1 };
		} catch (error) {
			console.error('[GoogleSheets] Error searching for order in all sheets:', error);
			return { sheetName: '', rowIndex: -1 };
		}
	}
}
