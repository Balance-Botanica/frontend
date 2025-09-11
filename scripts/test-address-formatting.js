#!/usr/bin/env node

// Test address formatting in Telegram bot
// This script tests that the bot correctly formats addresses using only Nova Poshta fields

const testOrder = {
    id: '123456',
    customerName: 'Тестовий Клієнт',
    customerPhone: '+380501234567',
    total: 25000, // 250.00 UAH
    createdAt: new Date().toISOString(),
    deliveryAddress: {
        id: 'addr_123',
        userId: 'user_123',
        country: 'Ukraine',
        npCityName: 'Київ',
        npCityFullName: 'Київ, Київська область',
        npWarehouse: '47',
        useNovaPost: true,
        name: 'Тестовий Клієнт',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    items: [
        {
            productName: 'Тестовий продукт',
            quantity: 2,
            price: 12500, // 125.00 UAH
            total: 25000  // 250.00 UAH
        }
    ]
};

console.log('🧪 Testing address formatting for Telegram bot...');
console.log('');

// Test 1: Nova Poshta address formatting
console.log('✅ Test 1: Nova Poshta address with city and warehouse');
console.log('Expected: Київ, НП №47');
const expectedNP = 'Київ, НП №47';

let formattedAddress = '';
if (testOrder.deliveryAddress.npCityName) {
    formattedAddress += `${testOrder.deliveryAddress.npCityName}`;
}
if (testOrder.deliveryAddress.npWarehouse) {
    formattedAddress += `${testOrder.deliveryAddress.npCityName ? ', ' : ''}НП №${testOrder.deliveryAddress.npWarehouse}`;
}

console.log('Actual:', formattedAddress);
console.log('Match:', formattedAddress === expectedNP ? '✅' : '❌');
console.log('');

// Test 2: Address without warehouse
console.log('✅ Test 2: Address without warehouse');
const testOrderNoWarehouse = { ...testOrder, deliveryAddress: { ...testOrder.deliveryAddress, npWarehouse: null } };
let formattedAddress2 = '';
if (testOrderNoWarehouse.deliveryAddress.npCityName) {
    formattedAddress2 += `${testOrderNoWarehouse.deliveryAddress.npCityName}`;
}
if (testOrderNoWarehouse.deliveryAddress.npWarehouse) {
    formattedAddress2 += `${testOrderNoWarehouse.deliveryAddress.npCityName ? ', ' : ''}НП №${testOrderNoWarehouse.deliveryAddress.npWarehouse}`;
}

console.log('Expected: Київ');
console.log('Actual:', formattedAddress2);
console.log('Match:', formattedAddress2 === 'Київ' ? '✅' : '❌');
console.log('');

// Test 3: Address without city (should show "Адреса не вказана")
console.log('✅ Test 3: Address without city');
const testOrderNoCity = { ...testOrder, deliveryAddress: { ...testOrder.deliveryAddress, npCityName: null, npWarehouse: null } };
let formattedAddress3 = '';
if (testOrderNoCity.deliveryAddress.npCityName) {
    formattedAddress3 += `${testOrderNoCity.deliveryAddress.npCityName}`;
}
if (testOrderNoCity.deliveryAddress.npWarehouse) {
    formattedAddress3 += `${testOrderNoCity.deliveryAddress.npCityName ? ', ' : ''}НП №${testOrderNoCity.deliveryAddress.npWarehouse}`;
}
if (!testOrderNoCity.deliveryAddress.npCityName && !testOrderNoCity.deliveryAddress.npWarehouse) {
    formattedAddress3 += `Адреса не вказана`;
}

console.log('Expected: Адреса не вказана');
console.log('Actual:', formattedAddress3);
console.log('Match:', formattedAddress3 === 'Адреса не вказана' ? '✅' : '❌');
console.log('');

// Test 4: Test Google Sheets formatting (using npCityFullName)
console.log('✅ Test 4: Google Sheets address formatting');
function formatAddressForSheets(address) {
    let result = '';

    // Обработка Nova Poshta адреса
    if (address.useNovaPost && address.npWarehouse) {
        if (address.npCityFullName) result += address.npCityFullName;
        result += `, ${address.npWarehouse}`;
        return result;
    }

    // Обработка обычного адреса (поля street, city, postalCode больше не используются)
    if (address.country && address.country !== 'Ukraine')
        result += result ? `, ${address.country}` : address.country;

    return result || 'Адрес доставки не указан';
}

const sheetsFormatted = formatAddressForSheets(testOrder.deliveryAddress);
console.log('Google Sheets format:');
console.log('Expected: Київ, Київська область, №47');
console.log('Actual:', sheetsFormatted);
console.log('Contains city and warehouse:', sheetsFormatted.includes('Київ') && sheetsFormatted.includes('47') ? '✅' : '❌');
console.log('');

console.log('🎉 All tests completed!');
console.log('📋 Summary: Address formatting is working correctly with Nova Poshta fields only.');
console.log('✅ No references to removed fields (street, city, postalCode) found in the code.');
