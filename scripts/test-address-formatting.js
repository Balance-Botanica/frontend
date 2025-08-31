#!/usr/bin/env node

// Тестируем форматирование адреса Новой Почты
const testAddress = `{"id":"529cf62a-54ba-47af-8c5e-7f6073209d48","userId":"7907d65a-35d1-4c44-b941-76fe92c9d551","name":"фівфів","isDefault":true,"street":"","city":"","postalCode":"","country":"Ukraine","npCityName":"Коцюбинське","npCityFullName":"смт Коцюбинське, Бучанський р-н, Київська обл.","npWarehouse":"Поштомат \\"Нова Пошта\\" №2631: вул. Пономарьова, 26 к1, під'їзд №4 (ТІЛЬКИ ДЛЯ МЕШКАНЦІВ)","useNovaPost":true,"createdAt":"2025-08-28T22:11:57.000Z","updatedAt":"2025-08-28T22:11:57.000Z"}`;

console.log('🧪 Testing address formatting...');
console.log('📝 Raw address JSON:');
console.log(testAddress);
console.log();

// Симулируем метод formatDeliveryAddress
function formatDeliveryAddress(address) {
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
    if (parsedAddress.postalCode) result += result ? `, ${parsedAddress.postalCode}` : parsedAddress.postalCode;
    if (parsedAddress.country && parsedAddress.country !== 'Ukraine')
        result += result ? `, ${parsedAddress.country}` : parsedAddress.country;

    return result || 'Адрес доставки не указан';
}

const formattedAddress = formatDeliveryAddress(testAddress);

console.log('✅ Formatted address result:');
console.log(formattedAddress);
console.log();
console.log('📊 Address should appear in Google Sheets column F as:');
console.log(`"${formattedAddress}"`);
console.log();

if (formattedAddress.includes('Коцюбинське') && formattedAddress.includes('Поштомат')) {
    console.log('🎉 SUCCESS: Address contains both city and warehouse information!');
} else {
    console.log('❌ ERROR: Address formatting is incomplete');
}
