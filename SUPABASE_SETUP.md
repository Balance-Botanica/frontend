# 🚀 Настройка Supabase для умной системы авторизации

## 📋 Что нужно настроить в Supabase:

### **1. 🔐 Authentication Settings**
- Перейти в **Authentication > Settings**
- Включить **Google OAuth**
- Добавить **Google Client ID** и **Client Secret**
- Настроить **Site URL** и **Redirect URLs**

### **2. 🗄️ Database Setup**
- Выполнить SQL скрипт `supabase-schema.sql` в **SQL Editor**
- Это создаст все необходимые таблицы и триггеры

### **3. 🔒 Row Level Security (RLS)**
- RLS уже включен в SQL скрипте
- Политики безопасности настроены автоматически

### **4. 🌐 Environment Variables**
Создать `.env.local` файл:
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 🎯 Как работает умная линковка:

### **Сценарий 1: Email → Google**
1. Пользователь регистрируется с email: `test@example.com`
2. Потом заходит через Google с тем же email
3. Система автоматически линкует аккаунты
4. Теперь это **ОДИН пользователь** с двумя способами входа

### **Сценарий 2: Google → Email**
1. Пользователь заходит через Google: `test@example.com`
2. Потом регистрируется с email: `test@example.com`
3. Система автоматически линкует аккаунты
4. Снова **ОДИН пользователь**

## 🔄 Автоматические триггеры:

### **1. Создание профиля**
- При регистрации автоматически создается профиль в `user_profiles`
- Данные берутся из `raw_user_meta_data`

### **2. Автолинковка**
- При создании профиля проверяется существующий email
- Если найден - создается линковка в `linked_accounts`

## 📊 Структура базы данных:

```sql
user_profiles          -- Основные профили
├── id (UUID, PK)
├── email (TEXT, UNIQUE)
├── full_name (TEXT)
├── first_name (TEXT)
├── last_name (TEXT)
└── avatar_url (TEXT)

linked_accounts        -- Линкованные аккаунты
├── id (UUID, PK)
├── primary_user_id (UUID, FK)
├── linked_user_id (UUID, FK)
├── provider (TEXT)
└── linked_at (TIMESTAMP)

phone_numbers          -- Телефонные номера
├── id (UUID, PK)
├── user_id (UUID, FK)
├── phone_number (TEXT)
├── is_primary (BOOLEAN)
└── is_verified (BOOLEAN)

personal_info          -- Персональная информация
├── id (UUID, PK)
├── user_id (UUID, FK)
├── first_name (TEXT)
├── last_name (TEXT)
├── date_of_birth (DATE)
└── gender (TEXT)
```

## 🚧 TODO для Facebook OAuth:

1. Создать Facebook App
2. Получить Facebook Client ID и Secret
3. Добавить в Supabase Authentication
4. Раскомментировать Facebook код в `supabase-store.ts`

## 🔍 Тестирование:

1. Зарегистрироваться с email
2. Войти через Google с тем же email
3. Проверить что аккаунты линкованы
4. Проверить что данные синхронизированы

## 📚 Полезные ссылки:

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth Setup](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
