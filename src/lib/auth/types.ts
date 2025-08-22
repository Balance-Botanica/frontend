/**
 * 🧠 Типы для умной системы авторизации
 * Поддерживает линковку аккаунтов и расширенные профили
 */

export interface User {
	id: string;
	email: string;
	name?: string;
	firstName?: string;
	lastName?: string;
	phone?: string;
	dateOfBirth?: string;
	avatarUrl?: string;
	linkedAccounts: LinkedAccount[];
	createdAt: string;
	updatedAt: string;
}

export interface Session {
	access_token: string;
	refresh_token: string;
	expires_at?: number;
	user: User;
}

export interface AuthState {
	user: User | null;
	session: Session | null;
	isLoading: boolean;
	error: string | null;
}

export interface LoginCredentials {
	email: string;
	password: string;
}

export interface OAuthProvider {
	name: 'google' | 'facebook';
	icon: string;
	label: string;
}

export interface AuthError {
	message: string;
	status?: number;
}

/**
 * 🔗 Линкованные аккаунты
 */
export interface LinkedAccount {
	id: string;
	primary_user_id: string;
	linked_user_id: string;
	provider: 'google' | 'facebook' | 'email' | 'auto_linked';
	linked_at: string;
	metadata?: Record<string, any>;
}

/**
 * 📱 Телефонные номера
 */
export interface PhoneNumber {
	id: string;
	user_id: string;
	phone_number: string;
	is_primary: boolean;
	is_verified: boolean;
	created_at: string;
}

/**
 * 👤 Персональная информация
 */
export interface PersonalInfo {
	id: string;
	user_id: string;
	first_name?: string;
	last_name?: string;
	date_of_birth?: string;
	gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
	nationality?: string;
	created_at: string;
	updated_at: string;
}

/**
 * 🔐 Расширенный профиль пользователя
 */
export interface UserProfile {
	id: string;
	email: string;
	full_name?: string;
	avatar_url?: string;
	phone_numbers: PhoneNumber[];
	personal_info: PersonalInfo;
	linked_accounts: LinkedAccount[];
	created_at: string;
	updated_at: string;
}

/**
 * 📊 Статистика линкованных аккаунтов
 */
export interface LinkedAccountsStats {
	total_accounts: number;
	providers: {
		google: number;
		facebook: number;
		email: number;
	};
	last_linked: string;
	primary_provider: 'google' | 'facebook' | 'email';
}
