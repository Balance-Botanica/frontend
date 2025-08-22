-- 🗄️ Supabase Database Schema для умной системы авторизации
-- Создаем таблицы для линковки аккаунтов и расширенных профилей

-- 👤 Основная таблица профилей пользователей
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    first_name TEXT,
    last_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 🔗 Линкованные аккаунты
CREATE TABLE IF NOT EXISTS linked_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    primary_user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    linked_user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    provider TEXT NOT NULL CHECK (provider IN ('google', 'facebook', 'email', 'auto_linked')),
    linked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB,
    UNIQUE(primary_user_id, linked_user_id, provider)
);

-- 📱 Телефонные номера
CREATE TABLE IF NOT EXISTS phone_numbers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    phone_number TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, phone_number)
);

-- 👤 Персональная информация
CREATE TABLE IF NOT EXISTS personal_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    first_name TEXT,
    last_name TEXT,
    date_of_birth DATE,
    gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
    nationality TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- 🔐 RLS (Row Level Security) политики
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE linked_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE phone_numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_info ENABLE ROW LEVEL SECURITY;

-- 👤 Пользователи могут читать только свой профиль
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

-- 👤 Пользователи могут обновлять только свой профиль
CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- 👤 Пользователи могут вставлять только свой профиль
CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 🔗 Пользователи могут видеть свои линкованные аккаунты
CREATE POLICY "Users can view own linked accounts" ON linked_accounts
    FOR SELECT USING (auth.uid() = primary_user_id OR auth.uid() = linked_user_id);

-- 🔗 Пользователи могут создавать линковки
CREATE POLICY "Users can create linked accounts" ON linked_accounts
    FOR INSERT WITH CHECK (auth.uid() = primary_user_id);

-- 📱 Пользователи могут управлять своими телефонами
CREATE POLICY "Users can manage own phone numbers" ON phone_numbers
    FOR ALL USING (auth.uid() = user_id);

-- 👤 Пользователи могут управлять своей персональной информацией
CREATE POLICY "Users can manage own personal info" ON personal_info
    FOR ALL USING (auth.uid() = user_id);

-- 🔄 Триггер для автоматического создания профиля при регистрации
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_profiles (id, email, full_name, first_name, last_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'first_name',
        NEW.raw_user_meta_data->>'last_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 🔄 Создаем триггер
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 🔄 Функция для автоматической линковки аккаунтов
CREATE OR REPLACE FUNCTION auto_link_accounts()
RETURNS TRIGGER AS $$
DECLARE
    existing_user_id UUID;
BEGIN
    -- Ищем существующий профиль с таким же email
    SELECT id INTO existing_user_id
    FROM user_profiles
    WHERE email = NEW.email AND id != NEW.id;
    
    -- Если найден, создаем линковку
    IF existing_user_id IS NOT NULL THEN
        INSERT INTO linked_accounts (primary_user_id, linked_user_id, provider)
        VALUES (existing_user_id, NEW.id, 'auto_linked')
        ON CONFLICT DO NOTHING;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 🔄 Создаем триггер для автоматической линковки
CREATE TRIGGER on_user_profile_created
    AFTER INSERT ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION auto_link_accounts();
