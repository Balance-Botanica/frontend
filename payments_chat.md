# Подключение платежной системы в Украине
_Exported on 9/9/2025 at 19:08:41 GMT+3 from Cursor (1.5.11)_

---

**User**

здарова, мне нужна твой консультация для начала по поводу подключения платежки.

мы находимся в Украине, если юзать стороннюю - то я смотрю на Fondy

но у меня вопрос - а можно ли подключить оплату картой самому без сторонних сервисов которые гребут процент? типа скрафтить форму для данных карты и сохранив их оплачивать? если да, то как? расскажи об это детально, или я не прав и нужно юзать только провайдеры платежные?

---

**Cursor**

Привет! Отличный вопрос по платежам. Давай разберёмся детально с технической и юридической стороны. Короткий ответ: **самостоятельно принимать платежи картой без провайдеров нельзя и крайне опасно**. Объясню почему и что делать вместо этого.

## Почему нельзя принимать платежи картой самостоятельно

### 1. **PCI DSS Compliance (Payment Card Industry Data Security Standard)**
Это международный стандарт безопасности для обработки платежей картой. Требует:
- Сертификации PCI DSS Level 1 (самый высокий уровень)
- Регулярные аудиты безопасности
- Специализированное оборудование и ПО
- Штрафы до $100,000 в месяц за нарушения

**В Украине это регулируется законом "О платежных системах"** и требованиями НБУ (Национального банка Украины).

### 2. **Технические ограничения**
Даже если бы можно было, то:
- Нужен банковский процессинг (Visa/Mastercard/Mir)
- Специализированные POS-терминалы или интеграция с банком
- Обработка 3D Secure
- Защита от фрода и chargebacks

### 3. **Юридические риски в Украине**
- **Лицензия на финансовую деятельность** от НБУ
- **Ответственность за утечку данных** (штрафы до 1 млн грн)
- **Блокировка счетов** банком за подозрительные операции
- **Уголовная ответственность** за нарушение законов о платежах

## Как правильно подключить платежи в Украине

### Рекомендуемые варианты:

#### 1. **Fondy (рекомендую для старта)**
```typescript
// Пример интеграции с Fondy
const fondyConfig = {
  merchant_id: process.env.FONDY_MERCHANT_ID,
  secret_key: process.env.FONDY_SECRET_KEY,
  currency: 'UAH',
  server_callback_url: '/api/payment/callback'
}
```

Плюсы:
- ✅ Поддержка всех украинских банков
- ✅ Низкие комиссии (1.8-2.5%)
- ✅ Готовые SDK для разных языков
- ✅ Поддержка Apple Pay, Google Pay
- ✅ PCI DSS compliant

#### 2. **Альтернативы Fondy:**
- **LiqPay** (ПриватБанк) - хорош для Украины
- **WayForPay** - тоже украинский
- **Stripe** - но с ограничениями для Украины
- **Portmone** - ещё один локальный вариант

### 3. **Банковские интеграции:**
- **ПриватБанк API**
- **Монобанк API**
- **Ощадбанк**

## Техническая реализация платежей

### Шаг 1: Выбор провайдера и регистрация
```typescript
// .env файл
FONDY_MERCHANT_ID=your_merchant_id
FONDY_SECRET_KEY=your_secret_key
FONDY_TEST_MODE=true // для тестов
```

### Шаг 2: Создание платежной формы
```typescript
// lib/payments/fondy.ts
export async function createPayment(orderData: OrderData) {
  const paymentData = {
    merchant_id: process.env.FONDY_MERCHANT_ID,
    amount: orderData.total * 100, // в копейках
    currency: 'UAH',
    order_id: orderData.id,
    order_desc: `Заказ #${orderData.id}`,
    response_url: `${process.env.APP_URL}/payment/success`,
    server_callback_url: `${process.env.APP_URL}/api/payment/callback`
  }

  // Создание подписи
  const signature = createFondySignature(paymentData, process.env.FONDY_SECRET_KEY)
  
  return { ...paymentData, signature }
}
```

### Шаг 3: Обработка callback'ов
```typescript
// routes/api/payment/callback/+server.ts
export async function POST({ request }) {
  const callbackData = await request.json()
  
  // Проверка подписи
  if (!verifyFondySignature(callbackData, process.env.FONDY_SECRET_KEY)) {
    return json({ error: 'Invalid signature' }, { status: 400 })
  }
  
  // Обработка статуса платежа
  if (callbackData.order_status === 'approved') {
    await updateOrderStatus(callbackData.order_id, 'paid')
  }
  
  return json({ success: true })
}
```

## Безопасность платежей

### Что нужно реализовать обязательно:

1. **3D Secure** - обязательная двухфакторная аутентификация
2. **Webhook verification** - проверка подлинности callback'ов
3. **Order validation** - проверка суммы и данных заказа
4. **Timeout handling** - обработка просроченных платежей
5. **Logging** - детальное логирование всех операций

### Защита от мошенничества:
- Лимиты на суммы платежей
- Blacklist подозрительных IP
- Проверка геолокации
- Мониторинг необычной активности

## Рекомендации по выбору

**Для стартапа/small бизнеса:**
1. **Fondy** - самый простой старт
2. **LiqPay** - если много клиентов ПриватБанка
3. **WayForPay** - хорошая техподдержка

**Для крупного бизнеса:**
- **Stripe** (если пройдёт верификацию)
- **Прямая интеграция с банком**
- **Мultiple провайдеров** для резервирования

## Итоговый совет

**НЕ пытайся обрабатывать платежи картой самостоятельно** - это незаконно, небезопасно и приведёт к огромным проблемам. Используй лицензированных провайдеров вроде Fondy.

Начни с Fondy - у них хорошая документация, тестовый режим и разумные комиссии. Если нужно, могу помочь с конкретной интеграцией в твой проект.

Что думаешь, какой вариант тебе больше подходит? Или есть дополнительные требования к платежам?

```typescript
// Пример интеграции с Fondy
const fondyConfig = {
  merchant_id: process.env.FONDY_MERCHANT_ID,
  secret_key: process.env.FONDY_SECRET_KEY,
  currency: 'UAH',
  server_callback_url: '/api/payment/callback'
}
```

```typescript
// .env файл
FONDY_MERCHANT_ID=your_merchant_id
FONDY_SECRET_KEY=your_secret_key
FONDY_TEST_MODE=true // для тестов
```

```typescript
// lib/payments/fondy.ts
export async function createPayment(orderData: OrderData) {
  const paymentData = {
    merchant_id: process.env.FONDY_MERCHANT_ID,
    amount: orderData.total * 100, // в копейках
    currency: 'UAH',
    order_id: orderData.id,
    order_desc: `Заказ #${orderData.id}`,
    response_url: `${process.env.APP_URL}/payment/success`,
    server_callback_url: `${process.env.APP_URL}/api/payment/callback`
  }

  // Создание подписи
  const signature = createFondySignature(paymentData, process.env.FONDY_SECRET_KEY)
  
  return { ...paymentData, signature }
}
```

```typescript
// routes/api/payment/callback/+server.ts
export async function POST({ request }) {
  const callbackData = await request.json()
  
  // Проверка подписи
  if (!verifyFondySignature(callbackData, process.env.FONDY_SECRET_KEY)) {
    return json({ error: 'Invalid signature' }, { status: 400 })
  }
  
  // Обработка статуса платежа
  if (callbackData.order_status === 'approved') {
    await updateOrderStatus(callbackData.order_id, 'paid')
  }
  
  return json({ success: true })
}
```

