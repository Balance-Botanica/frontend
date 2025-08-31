# 🗄️ Database Sync Architecture

## 🎯 Архитектура: БД как Source of Truth

### 📊 Текущая архитектура

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │────│   Database       │────│  Google Sheets  │
│   (SvelteKit)   │    │   (SQLite)       │    │   (Mirror)      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
        │                       │                        │
        │                       │                        │
        ▼                       ▼                        ▼
   Создание заказов        Единственный       Автоматическая
   через корзину           источник правды    синхронизация
```

### ✅ Что работает правильно

#### 1. **База данных - единственный source of truth**
- ✅ Все заказы создаются и хранятся в БД
- ✅ Все изменения статуса происходят в БД
- ✅ Все чтения данных идут из БД

#### 2. **Telegram бот работает только с БД**
- ✅ Получение заказов: `orderService.getAllOrders()`
- ✅ Обновление статуса: `orderService.updateOrderStatus()`
- ✅ Детали заказа: `orderService.getOrderById()`

#### 3. **Односторонняя синхронизация БД → Google Sheets**
- ✅ При создании заказа: `syncOrderToSheets()`
- ✅ При изменении статуса: `syncStatusUpdate()`
- ✅ При обновлении ТТН: `syncTTNUpdate()` (через Telegram бота)

#### 4. **Обратная синхронизация отключена**
- ❌ `Google Sheets → Database` синхронизация отключена
- ❌ Auto-creation заказов из Google Sheets отключено
- ❌ Sync на чтение отключено

### 🔄 Flow создания и синхронизации заказа

```
1. Frontend → API → OrderService.createOrder()
2. OrderService сохраняет в БД
3. OrderService.syncNewOrder():
   ├── syncOrderToSheets() → Google Sheets
   └── notifyTelegramBot() → Telegram
4. Telegram бот работает только с БД
5. Изменения в Telegram → OrderService.updateOrderStatus()
6. OrderService обновляет БД + синхронизирует с Google Sheets
```

### 🛠️ API Endpoints

#### Для администратора:
```bash
# Полная синхронизация всех заказов
POST /api/orders/sync-all
```

#### Для пользователей:
```bash
# Создание заказа (автоматическая синхронизация)
POST /api/orders

# Получение заказов (только из БД)
GET /api/orders
```

### 🧪 Тестирование системы

```bash
# Тест всей системы синхронизации
npm run test-db-sync

# Проверка безопасности
npm run security:check
```

### 📊 Мониторинг синхронизации

#### Логи синхронизации:
```
[OrderService] 🔄 Starting full orders sync to Google Sheets...
[OrderService] Found 5 orders in database
[OrderService] Syncing order abc123...
[OrderService] ✅ Synced order abc123
[OrderService] 🔄 Full sync completed:
  ✅ Synced: 5
  ❌ Errors: 0
  📊 Total: 5
```

#### Логи изменений:
```
[OrderService] Updating order status: abc123 -> confirmed
[OrderService] Repository updateOrderStatus result: true
[OrderService] Status update successful, syncing...
[OrderService] Status synced to Google Sheets successfully: abc123, confirmed
```

### 🔧 Ручная синхронизация

Если нужно пересинхронизировать все данные:

```javascript
// В коде
await orderService.syncAllOrdersToSheets();

// Через API
POST /api/orders/sync-all
```

### 📋 Google Sheets структура

Google Sheets используется только для чтения и бухгалтерии:

| Column | Data | Source |
|--------|------|--------|
| A | Order ID | Database |
| B | Date | Database |
| C | Customer Name | Database |
| D | Phone | Database |
| E | Email | Database |
| F | Delivery Address | Database |
| G | Items | Database |
| H | Total | Database |
| I | Status | Database |
| J | TTN | Database |

### ⚠️ Важные замечания

1. **Google Sheets - только для чтения** для системы
2. **Все изменения должны идти через БД**
3. **Ручные изменения в Google Sheets будут перезаписаны**
4. **БД всегда имеет приоритет**

### 🎯 Преимущества архитектуры

- ✅ **Надежность**: БД как единый источник правды
- ✅ **Производительность**: Быстрое чтение из БД
- ✅ **Масштабируемость**: Легко добавить новые интеграции
- ✅ **Отказоустойчивость**: Google Sheets API может падать, БД - нет
- ✅ **Аудит**: Все изменения логируются в БД

### 🚨 Troubleshooting

#### Проблема: Заказ не появился в Google Sheets
```bash
# Проверить логи
grep "syncOrderToSheets" logs/*.log

# Ручная синхронизация
POST /api/orders/sync-all
```

#### Проблема: Статус не обновился в Google Sheets
```bash
# Проверить логи
grep "syncStatusUpdate" logs/*.log

# Проверить API ключи Google Sheets
# Проверить права доступа к таблице
```

#### Проблема: Telegram бот показывает старые данные
```bash
# Бот всегда читает из БД
# Проверить orderService.getAllOrders()
# Проверить подключение к БД
```

### 📈 Мониторинг и метрики

Рекомендуется отслеживать:
- Количество заказов в БД vs Google Sheets
- Время синхронизации
- Ошибки синхронизации
- Использование API Google Sheets

---

## 🎉 **Архитектура готова к production!**

База данных является надежным источником правды, Google Sheets - удобным зеркалом для бухгалтерии, а Telegram бот работает быстро и эффективно! 🚀
