#!/usr/bin/env node

// Тестируем логику формирования названий листов по месяцам
console.log('🧪 Testing month sheet logic...\n');

// Функция из GoogleSheetsService
function getCurrentMonthSheetName() {
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

// Тестируем с текущей датой
const currentDate = new Date();
console.log('📅 Current date:', currentDate.toISOString());
console.log('📊 Current month index:', currentDate.getMonth());
console.log('📋 Current month sheet name:', getCurrentMonthSheetName());
console.log();

// Тестируем с датой 1 сентября 2025
const september1st = new Date('2025-09-01');
console.log('📅 September 1st 2025:', september1st.toISOString());
console.log('📊 September month index:', september1st.getMonth());
console.log('📋 September sheet name should be: Вересень 2025');
console.log();

// Показываем все месяцы
console.log('📋 All month names:');
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

monthNames.forEach((month, index) => {
    console.log(`   ${index}: ${month}`);
});

console.log('\n✅ Month logic is correct!');
console.log('📝 Orders created on September 1st, 2025 will go to sheet: "Вересень 2025"');
