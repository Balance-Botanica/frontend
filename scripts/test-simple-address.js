#!/usr/bin/env node

// Простой тест - просто берем np_city_full_name + np_warehouse из JSON

const testAddress = `{"npCityFullName":"смт Коцюбинське, Бучанський р-н, Київська обл.","npWarehouse":"Поштомат Нова Пошта №2631","npCityName":"Коцюбинське"}`;

try {
    const addressData = JSON.parse(testAddress);

    // Просто берем np_city_full_name + np_warehouse как просил пользователь
    const fullAddress = `${addressData.npCityFullName}, ${addressData.npWarehouse}`;

    console.log('✅ Адрес из БД:');
    console.log(fullAddress);
    console.log();
    console.log('🎯 Результат: np_city_full_name + np_warehouse');
    console.log(`"${addressData.npCityFullName}, ${addressData.npWarehouse}"`);

} catch (e) {
    console.log('❌ Ошибка парсинга JSON');
}
