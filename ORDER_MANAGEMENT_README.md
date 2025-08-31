# 📦 Balance Botanica Order Management System

## 🚀 Быстрая настройка

### 1. Google Sheets - Настройка дропдауна статуса

#### Шаг 1: Откройте таблицу
Перейдите по ссылке: https://docs.google.com/spreadsheets/d/1DoSeIo_Isq9MBvXVnkdNNShmG5hde6c4hcUetEU04lM/edit

#### Шаг 2: Выберите колонку Status (I)
1. Кликните на заголовок колонки **I** (Status)
2. Выберите **Data** → **Data Validation**

#### Шаг 3: Настройте правила валидации
```
Criteria: List of items
Items: pending,confirmed,shipped,delivered,cancelled
Show dropdown: ✓
Show validation help text: ✓
```

#### Шаг 4: Примените к диапазону
```
Apply to range: I2:I1000
```

#### Шаг 5: Сохраните настройки
Нажмите **Save**

### 2. Telegram Bot - Запуск

```bash
# Установите зависимости
npm install

# Запустите бота
node scripts/run-telegram-bot.js
```

#### Первый запуск:
1. Напишите боту любое сообщение
2. В консоли появится: `👑 Setting admin chat ID: [ВАШ_ID]`
3. Теперь бот будет отправлять уведомления о новых заказах

## 📱 Команды Telegram бота

### Основные команды:
- `/start` - Приветствие и список команд
- `/help` - Подробная справка
- `/orders` - Показать все заказы
- `/pending` - Заказы в ожидании
- `/confirmed` - Подтвержденные заказы
- `/shipped` - Отправленные заказы
- `/delivered` - Доставленные заказы
- `/cancelled` - Отмененные заказы

### Управление статусами:
```
/status 123456 confirmed  # Подтвердить заказ
/status 123456 shipped    # Отметить как отправленный
/status 123456 delivered  # Отметить как доставленный
/status 123456 cancelled  # Отменить заказ
```

### Inline кнопки:
При просмотре деталей заказа доступны кнопки:
- ✅ **Підтвердити** - Подтвердить заказ
- 📦 **Відправити** - Отметить как отправленный
- 🚚 **Доставлено** - Отметить как доставленный
- ❌ **Скасувати** - Отменить заказ

## 🔧 Техническая настройка

### 1. Переменные окружения
Убедитесь, что в корне проекта есть файл `balance-botanica-d061b04ea697.json` с учетными данными Google Service Account.

### 2. Запуск бота в фоне
```bash
# Linux/Mac
nohup node scripts/run-telegram-bot.js &

# Windows (PowerShell)
Start-Job -ScriptBlock { node scripts/run-telegram-bot.js }
```

### 3. Настройка автозапуска
```bash
# Создать systemd service (Linux)
sudo nano /etc/systemd/system/balance-bot.service

[Unit]
Description=Balance Botanica Telegram Bot
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/balance-botanica
ExecStart=/usr/bin/node scripts/run-telegram-bot.js
Restart=always

[Install]
WantedBy=multi-user.target

# Включить и запустить
sudo systemctl enable balance-bot
sudo systemctl start balance-bot
```

## 📊 Структура Google Sheets

### Автоматические листы:
- **Січень 2024** - Заказы за январь
- **Лютий 2024** - Заказы за февраль
- **Березень 2024** - Заказы за март
- *и т.д. для каждого месяца*

### Колонки:
| Колонка | Название | Описание |
|---------|----------|----------|
| A | Order ID | 6-значный код заказа |
| B | Create Date | Дата создания |
| C | Client Name | Имя клиента |
| D | Phone Number | Номер телефона |
| E | Email | Email адрес |
| F | Delivery Address | Адрес доставки |
| G | Products Bought | Список товаров |
| H | Sum(Total) | Общая сумма |
| I | Status | **ДРОПДАУН** со статусами |
| J | ТТН Нова Пошта | Номер ТТН |
| K | Comments | Примечания |
| L | Update Date | Дата обновления |

## 🔄 Синхронизация данных

### При создании заказа:
1. ✅ Сохраняется в базу данных
2. 📊 Добавляется в Google Sheets
3. 📱 Отправляется уведомление в Telegram

### При обновлении статуса:
1. ✅ Обновляется в базе данных
2. 📊 Синхронизируется с Google Sheets
3. 📱 Можно управлять через Telegram бота

## 🎯 Статусы заказов

| Статус | Описание | Действия |
|--------|----------|----------|
| `pending` | Очікує підтвердження | Можно подтвердить или отменить |
| `confirmed` | Підтверджено | Можно отправить |
| `shipped` | Відправлено | Можно отметить доставленным |
| `delivered` | Доставлено | Заказ завершен |
| `cancelled` | Скасовано | Заказ отменен |

## 🐛 Устранение неполадок

### Бот не отвечает:
```bash
# Проверьте токен бота
echo $TELEGRAM_BOT_TOKEN

# Перезапустите бота
pkill -f "run-telegram-bot.js"
node scripts/run-telegram-bot.js
```

### Ошибки Google Sheets:
```bash
# Проверьте учетные данные
ls -la balance-botanica-d061b04ea697.json

# Проверьте права доступа к таблице
# Убедитесь, что email service account добавлен в таблицу
```

### Синхронизация не работает:
```bash
# Проверьте логи
tail -f /var/log/balance-bot.log

# Перезапустите сервисы
sudo systemctl restart balance-bot
```

## 📈 Мониторинг

### Логи бота:
```bash
# Посмотреть логи
journalctl -u balance-bot -f

# Или если запускаете вручную
node scripts/run-telegram-bot.js 2>&1 | tee bot.log
```

### Проверка синхронизации:
```bash
# Проверить заказы в БД
node scripts/test-db-connection.js

# Проверить Google Sheets API
node scripts/setup-google-sheets.js
```

## 🚀 Продвинутые возможности

### 1. Автоматические напоминания
Бот может автоматически напоминать о:
- Заказах в ожидании (>24 часов)
- Неотправленных заказах (>48 часов)

### 2. Статистика продаж
```javascript
// Добавить команды для статистики
/this_month - Заказы за текущий месяц
/last_month - Заказы за прошлый месяц
/revenue - Общая выручка
```

### 3. Интеграция с Новой Почтой
```javascript
// Автоматическое создание ТТН
// Отслеживание статуса доставки
// Уведомления клиентам
```

### 4. Email уведомления
```javascript
// Автоматические письма клиентам
// Уведомления об изменении статуса
// Чеки и накладные
```

## 📞 Поддержка

Если возникли проблемы:
1. Проверьте логи бота
2. Убедитесь в правильности токенов и учетных данных
3. Проверьте подключение к интернету
4. Перезапустите сервисы

**Удачи с управлением заказами! 🎉**
