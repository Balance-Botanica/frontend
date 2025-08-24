/**
 * 🧠 Types for smart authentication system
 * Supports account linking and extended profiles
 */

/**
 * 🔄 Authentication Events Enum
 * Defines all possible authentication state changes
 * Following Supabase AuthChangeEvent standard
 *
 * Benefits of using enum over string literals:
 * - Type safety: Prevents typos and invalid event names
 * - IDE support: Autocomplete and refactoring
 * - Maintainability: Centralized event definitions
 * - Documentation: Clear contract for all possible events
 *
 * Example usage:
 * ```typescript
 * // Bad (old way)
 * if (event === 'TOKEN_REFRESHED') { ... }
 *
 * // Good (new way)
 * if (event === AuthEvent.TOKEN_REFRESHED) { ... }
 * ```
 */
export enum AuthEvent {
	/** Initial session loaded on app start */
	INITIAL_SESSION = 'INITIAL_SESSION',
	/** User successfully authenticated */
	SIGNED_IN = 'SIGNED_IN',
	/** User logged out or session expired */
	SIGNED_OUT = 'SIGNED_OUT',
	/** Access token was automatically refreshed */
	TOKEN_REFRESHED = 'TOKEN_REFRESHED',
	/** User profile information was updated */
	USER_UPDATED = 'USER_UPDATED',
	/** Password recovery process initiated */
	PASSWORD_RECOVERY = 'PASSWORD_RECOVERY'
}

/**
 * 🎯 Authentication Event Handler Function Type
 */
export type AuthEventHandler = (event: AuthEvent, session: Session | null) => void | Promise<void>;

/**
 * 🔍 Auth Event Utilities
 */
export class AuthEventUtils {
	/**
	 * Validates if a string is a valid auth event
	 */
	static isValidEvent(event: string): event is keyof typeof AuthEvent {
		return Object.values(AuthEvent).includes(event as AuthEvent);
	}

	/**
	 * Converts string to AuthEvent enum with validation
	 */
	static toAuthEvent(event: string): AuthEvent | null {
		return this.isValidEvent(event) ? (event as AuthEvent) : null;
	}

	/**
	 * Gets human-readable event description
	 */
	static getEventDescription(event: AuthEvent): string {
		switch (event) {
			case AuthEvent.INITIAL_SESSION:
				return 'Initial session loaded';
			case AuthEvent.SIGNED_IN:
				return 'User successfully signed in';
			case AuthEvent.SIGNED_OUT:
				return 'User signed out';
			case AuthEvent.TOKEN_REFRESHED:
				return 'Access token refreshed';
			case AuthEvent.USER_UPDATED:
				return 'User profile updated';
			case AuthEvent.PASSWORD_RECOVERY:
				return 'Password recovery initiated';
			default:
				return 'Unknown authentication event';
		}
	}
}

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
