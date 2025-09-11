#!/usr/bin/env node

// Test Telegram bot address formatting
const testOrder = {
    id: '806039',
    customerName: 'Тест',
    customerPhone: '+380501234567',
    total: 6800,
    createdAt: '2025-09-01T10:00:00.000Z',
    deliveryAddress: '{"id":"529cf62a-54ba-47af-8c5e-7f6073209d48","userId":"7907d65a-35d1-4c44-b941-76fe92c9d551","name":"фівфів","isDefault":true,"street":"","city":"","postalCode":"","country":"Ukraine","npCityName":"Коцюбинське","npCityFullName":"смт Коцюбинське, Бучанський р-н, Київська обл.","npWarehouse":"Поштомат Нова Пошта №2631","useNovaPost":true,"createdAt":"2025-08-28T22:11:57.000Z","updatedAt":"2025-08-28T22:11:57.000Z"}',
    items: [
        {
            productName: 'Balance Botanica Golden Paste CBD',
            quantity: 1,
            price: 4000,
            total: 4000
        },
        {
            productName: 'Balance Botanica Golden Paste CBD',
            quantity: 1,
            price: 2800,
            total: 2800
        }
    ]
};

console.log('🧪 Testing Telegram bot address formatting...\n');

// Test the same logic as in formatOrderDetailedSummary
function formatAddress(order) {
    let summary = '';

    if (order.deliveryAddress) {
        summary += `🏠 Адреса: `;

        // Парсим JSON строку адреса если нужно
        let addressData = order.deliveryAddress;
        if (typeof order.deliveryAddress === 'string') {
            try {
                addressData = JSON.parse(order.deliveryAddress);
            } catch (e) {
                console.log('[TelegramBot] Failed to parse delivery address JSON:', order.deliveryAddress);
                summary += `Помилка формату адреси\n`;
                return summary;
            }
        }

        // Адрес всегда объект с полями Nova Poshta
        if (addressData.npCityName) {
            summary += `${addressData.npCityName}`;
        }
        if (addressData.npWarehouse) {
            summary += `${addressData.npCityName ? ', ' : ''}НП ${addressData.npWarehouse}`;
        }
        if (!addressData.npCityName && !addressData.npWarehouse) {
            summary += `Адреса не вказана`;
        }
        summary += `\n`;
    } else {
        summary += `🏠 Адреса: Адреса не вказана\n`;
    }

    return summary;
}

const formattedAddress = formatAddress(testOrder);
console.log('📋 Test order:', testOrder.id);
console.log('📍 Formatted address:');
console.log(formattedAddress);

if (formattedAddress.includes('Коцюбинське') && formattedAddress.includes('НП')) {
    console.log('✅ SUCCESS: Address contains city and warehouse!');
} else {
    console.log('❌ FAILED: Address formatting is incorrect');
}

console.log('\n🎉 Test completed!');
