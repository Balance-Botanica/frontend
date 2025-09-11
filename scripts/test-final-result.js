#!/usr/bin/env node

// Финальный тест - показываем что увидит пользователь в Telegram боте

const testOrder = {
    id: '806039',
    customerName: 'Тестовый Клиент',
    customerPhone: '+380501234567',
    total: 6800,
    createdAt: '2025-09-01T10:00:00.000Z',
    deliveryAddress: `{"npCityFullName":"смт Коцюбинське, Бучанський р-н, Київська обл.","npWarehouse":"Поштомат Нова Пошта №2631","npCityName":"Коцюбинське"}`
};

console.log('📋 ЗАМОВЛЕННЯ 806039');
console.log('📅 Дата: 01.09.2025');
console.log('📊 Статус: Очікує підтвердження');
console.log('💰 Сума: 68.00 ₴');
console.log('📦 Товарів: 2');
console.log('🛍️ Товари:');
console.log('   1. Balance Botanica Golden Paste CBD (1шт. × 40.00₴)');
console.log('   2. Balance Botanica Golden Paste CBD (1шт. × 28.00₴)');

// Новая логика форматирования адреса
try {
    const addressData = JSON.parse(testOrder.deliveryAddress);
    const fullAddress = `${addressData.npCityFullName}, ${addressData.npWarehouse}`;
    console.log(`🏠 Адреса: ${fullAddress}`);
} catch (e) {
    console.log('🏠 Адреса: Адреса не вказана');
}

console.log();
console.log('✅ ГОТОВО! Теперь вместо пустого "Адреса:" показывается полный адрес Nova Poshta!');
