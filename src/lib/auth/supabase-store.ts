import { writable, derived } from 'svelte/store';
import { supabase } from '$lib/supabase/client';
import type { User, Session, AuthState, LoginCredentials, OAuthProvider } from './types';

/**
 * 🧠 Умный Auth Store с линковкой аккаунтов
 *
 * Принципы:
 * - GRASP: High Cohesion, Low Coupling
 * - SOLID: Single Responsibility, Open/Closed, Dependency Inversion
 * - DRY: Don't Repeat Yourself
 * - WET: Write Everything Twice (для критических операций)
 */

function createSupabaseAuthStore() {
	const { subscribe, set, update } = writable<AuthState>({
		user: null,
		session: null,
		isLoading: false,
		error: null
	});

	/**
	 * 🔐 Инициализация и восстановление сессии
	 * Автоматически восстанавливает сессию при загрузке
	 */
	async function initialize() {
		update((state) => ({ ...state, isLoading: true }));

		try {
			// Получаем текущую сессию
			const {
				data: { session },
				error
			} = await supabase.auth.getSession();

			if (error) throw error;

			if (session) {
				// Получаем расширенную информацию о пользователе
				const user = await getExtendedUserProfile(session.user.id);
				// Адаптируем Supabase Session к нашему типу
				const adaptedSession = adaptSupabaseSession(session);
				set({ user, session: adaptedSession, isLoading: false, error: null });
			} else {
				set({ user: null, session: null, isLoading: false, error: null });
			}
		} catch (error) {
			console.error('❌ Auth initialization error:', error);
			set({ user: null, session: null, isLoading: false, error: 'Failed to initialize auth' });
		}
	}

	/**
	 * 🔗 Получение расширенного профиля пользователя
	 * Включает линкованные аккаунты и дополнительную информацию
	 */
	async function getExtendedUserProfile(userId: string): Promise<User | null> {
		try {
			// Получаем основной профиль
			const { data: profile, error } = await supabase
				.from('user_profiles')
				.select(
					`
					*,
					linked_accounts(*),
					phone_numbers(*),
					personal_info(*)
				`
				)
				.eq('id', userId)
				.single();

			if (error) throw error;

			// Маппим в наш User интерфейс
			return mapProfileToUser(profile);
		} catch (error) {
			console.error('❌ Failed to get extended profile:', error);
			return null;
		}
	}

	/**
	 * 🎯 Google OAuth авторизация
	 * Автоматически линкует с существующим email аккаунтом
	 */
	async function signInWithGoogle() {
		try {
			update((state) => ({ ...state, isLoading: true, error: null }));

			const { data, error } = await supabase.auth.signInWithOAuth({
				provider: 'google',
				options: {
					redirectTo: `${window.location.origin}/auth/callback`,
					// Use PKCE flow for better security (as per Supabase docs)
					skipBrowserRedirect: false,
					queryParams: {
						access_type: 'offline',
						prompt: 'consent'
						// Removed response_type to let Supabase handle the flow type
					}
				}
			});

			if (error) throw error;

			// For OAuth, the actual authentication happens in the callback
			// This just redirects to Google
			return data;
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Failed to sign in with Google';
			set({ user: null, session: null, isLoading: false, error: errorMessage });
			throw error;
		}
	}

	/**
	 * 📘 Facebook OAuth авторизация
	 * Автоматически линкует с существующим email аккаунтом
	 */
	async function signInWithFacebook() {
		try {
			update((state) => ({ ...state, isLoading: true, error: null }));

			const { data, error } = await supabase.auth.signInWithOAuth({
				provider: 'facebook',
				options: {
					redirectTo: `${window.location.origin}/auth/callback`,
					skipBrowserRedirect: false,
					queryParams: {
						access_type: 'offline',
						prompt: 'consent'
					}
				}
			});

			if (error) throw error;

			// For OAuth, the actual authentication happens in the callback
			// This just redirects to Facebook
			return data;
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'Failed to sign in with Facebook';
			set({ user: null, session: null, isLoading: false, error: errorMessage });
			throw error;
		}
	}

	/**
	 * 📧 Email/Password авторизация
	 * Поддерживает как вход, так и регистрацию
	 */
	async function signInWithEmail(credentials: LoginCredentials) {
		try {
			update((state) => ({ ...state, isLoading: true, error: null }));

			// Сначала пробуем войти
			let { data, error } = await supabase.auth.signInWithPassword({
				email: credentials.email,
				password: credentials.password
			});

			// Если пользователь не найден, регистрируем
			if (error && error.message.includes('Invalid login credentials')) {
				const signUpResult = await supabase.auth.signUp({
					email: credentials.email,
					password: credentials.password,
					options: {
						emailRedirectTo: `${window.location.origin}/auth/callback`
					}
				});
				// Type assertion to match expected structure
				data = signUpResult.data as any;
				error = signUpResult.error;
			}

			if (error) throw error;

			// После успешной авторизации обновляем состояние
			await handleSuccessfulAuth();

			// Возвращаем адаптированные данные для email авторизации
			if (!data.user) {
				throw new Error('No user data received');
			}

			const user = await getExtendedUserProfile(data.user.id);
			const session = data.session ? adaptSupabaseSession(data.session) : null;

			if (!user || !session) {
				return { user: null, session: null };
			}

			return { user, session };
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Failed to sign in with email';
			set({ user: null, session: null, isLoading: false, error: errorMessage });
			throw error;
		}
	}

	/**
	 * 🔗 Линковка дополнительных аккаунтов
	 * Позволяет связать Google/Facebook с email аккаунтом
	 *
	 * TODO: Supabase не поддерживает linkAccount напрямую
	 * Нужно использовать OAuth flow для линковки
	 */
	async function linkAccount(provider: 'google' | 'facebook') {
		try {
			// TODO: Реализовать линковку через OAuth flow
			// Пока просто логируем попытку линковки
			console.log(`🔗 Attempting to link ${provider} account`);

			// Обновляем профиль пользователя
			await updateUserProfile();

			return { success: true, message: `${provider} account linking not implemented yet` };
		} catch (error) {
			console.error(`❌ Failed to link ${provider} account:`, error);
			throw error;
		}
	}

	/**
	 * 📱 Обновление профиля пользователя
	 * Включает телефон, имя, фамилию, дату рождения
	 */
	async function updateUserProfile(updates: Partial<User> = {}) {
		try {
			const {
				data: { user }
			} = await supabase.auth.getUser();
			if (!user) throw new Error('No authenticated user');

			// Обновляем профиль в базе
			const { error } = await supabase.from('user_profiles').upsert({
				id: user.id,
				email: user.email,
				...updates,
				updated_at: new Date().toISOString()
			});

			if (error) throw error;

			// Обновляем локальное состояние
			const updatedUser = await getExtendedUserProfile(user.id);
			if (updatedUser) {
				update((state) => ({ ...state, user: updatedUser }));
			}
		} catch (error) {
			console.error('❌ Failed to update profile:', error);
			throw error;
		}
	}

	/**
	 * 🔄 Обработка успешной авторизации
	 * Автоматически линкует аккаунты и обновляет состояние
	 */
	async function handleSuccessfulAuth() {
		try {
			const {
				data: { session }
			} = await supabase.auth.getSession();
			if (!session) return;

			// Получаем расширенный профиль
			const user = await getExtendedUserProfile(session.user.id);

			// Автоматически линкуем аккаунты если email совпадает
			await autoLinkAccounts(session.user);

			// Адаптируем Supabase Session к нашему типу
			const adaptedSession = adaptSupabaseSession(session);
			set({ user, session: adaptedSession, isLoading: false, error: null });
		} catch (error) {
			console.error('❌ Failed to handle successful auth:', error);
		}
	}

	/**
	 * 🔗 Автоматическая линковка аккаунтов
	 * Если email совпадает, связываем аккаунты
	 */
	async function autoLinkAccounts(currentUser: any) {
		try {
			if (!currentUser.email) return;

			// Ищем существующий профиль с таким email
			const { data: existingProfile } = await supabase
				.from('user_profiles')
				.select('id, linked_accounts')
				.eq('email', currentUser.email)
				.single();

			if (existingProfile && existingProfile.id !== currentUser.id) {
				// Линкуем аккаунты
				await supabase.from('linked_accounts').insert({
					primary_user_id: existingProfile.id,
					linked_user_id: currentUser.id,
					provider: 'auto_linked',
					linked_at: new Date().toISOString()
				});
			}
		} catch (error) {
			console.error('❌ Failed to auto-link accounts:', error);
		}
	}

	/**
	 * 🚪 Выход из системы
	 */
	async function signOut() {
		try {
			update((state) => ({ ...state, isLoading: true }));

			const { error } = await supabase.auth.signOut();
			if (error) throw error;

			set({ user: null, session: null, isLoading: false, error: null });
		} catch (error) {
			console.error('❌ Sign out error:', error);
			set({ user: null, session: null, isLoading: false, error: null });
		}
	}

	/**
	 * 🔑 Set session from OAuth callback
	 * Handles tokens received from URL fragments (implicit flow)
	 */
	async function setSession(sessionData: any) {
		try {
			update((state) => ({ ...state, isLoading: true, error: null }));

			// Set the session in Supabase auth
			const { data, error } = await supabase.auth.setSession({
				access_token: sessionData.access_token,
				refresh_token: sessionData.refresh_token
			});

			if (error) throw error;

			// Update the store with user and session data
			if (data.session && data.user) {
				const user = await getExtendedUserProfile(data.user.id);
				const adaptedSession = adaptSupabaseSession(data.session);
				set({ user, session: adaptedSession, isLoading: false, error: null });
			} else {
				throw new Error('No session data received');
			}

			return { user: data.user, session: data.session };
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Failed to set session';
			set({ user: null, session: null, isLoading: false, error: errorMessage });
			throw error;
		}
	}

	/**
	 * 🧹 Очистка ошибок
	 */
	function clearError() {
		update((state) => ({ ...state, error: null }));
	}

	/**
	 * 📊 Получение статистики линкованных аккаунтов
	 */
	async function getLinkedAccountsStats() {
		try {
			const {
				data: { user }
			} = await supabase.auth.getUser();
			if (!user) return null;

			const { data, error } = await supabase
				.from('linked_accounts')
				.select('*')
				.or(`primary_user_id.eq.${user.id},linked_user_id.eq.${user.id}`);

			if (error) throw error;
			return data;
		} catch (error) {
			console.error('❌ Failed to get linked accounts stats:', error);
			return null;
		}
	}

	// Слушаем изменения авторизации
	supabase.auth.onAuthStateChange(async (event, session) => {
		console.log('🔄 Auth state changed:', event, session?.user?.email);

		if (event === 'SIGNED_IN' && session) {
			await handleSuccessfulAuth();
		} else if (event === 'SIGNED_OUT') {
			set({ user: null, session: null, isLoading: false, error: null });
		} else if (event === 'TOKEN_REFRESHED' && session) {
			// Update session when token is refreshed
			const user = await getExtendedUserProfile(session.user.id);
			const adaptedSession = adaptSupabaseSession(session);
			set({ user, session: adaptedSession, isLoading: false, error: null });
		}
	});

	return {
		subscribe,
		initialize,
		signInWithGoogle,
		signInWithFacebook,
		signInWithEmail,
		linkAccount,
		updateUserProfile,
		signOut,
		setSession,
		clearError,
		getLinkedAccountsStats
	};
}

export const supabaseAuthStore = createSupabaseAuthStore();

// Auto-initialize the auth store when it's created
if (typeof window !== 'undefined') {
	supabaseAuthStore.initialize();
}

// Derived stores для удобства
export const user = derived(supabaseAuthStore, ($store) => $store.user);
export const session = derived(supabaseAuthStore, ($store) => $store.session);
export const isLoading = derived(supabaseAuthStore, ($store) => $store.isLoading);
export const error = derived(supabaseAuthStore, ($store) => $store.error);
export const isAuthenticated = derived(
	supabaseAuthStore,
	($store) => !!$store.user && !!$store.session
);

/**
 * 🔧 Утилиты для маппинга данных
 */
function mapProfileToUser(profile: any): User {
	return {
		id: profile.id,
		email: profile.email,
		name: profile.full_name || profile.first_name + ' ' + profile.last_name,
		firstName: profile.first_name,
		lastName: profile.last_name,
		phone: profile.phone_numbers?.[0]?.phone_number,
		dateOfBirth: profile.personal_info?.date_of_birth,
		avatarUrl: profile.avatar_url,
		linkedAccounts: profile.linked_accounts || [],
		createdAt: profile.created_at,
		updatedAt: profile.updated_at
	};
}

/**
 * 🔄 Adapter for Supabase Session
 * Converts Supabase Session to our Session type with enhanced Google data extraction
 */
function adaptSupabaseSession(supabaseSession: any): Session {
	const userMetadata = supabaseSession.user.user_metadata || {};

	// Debug: Log Google profile data
	console.log('🔍 Google user metadata:', userMetadata);

	return {
		access_token: supabaseSession.access_token,
		refresh_token: supabaseSession.refresh_token,
		expires_at: supabaseSession.expires_at,
		user: {
			id: supabaseSession.user.id,
			email: supabaseSession.user.email || '',
			// Prioritize Google's full_name over individual names
			name: userMetadata.full_name || userMetadata.name,
			firstName: userMetadata.first_name,
			lastName: userMetadata.last_name,
			phone: undefined,
			dateOfBirth: undefined,
			// Get Google profile picture (avatar_url or picture)
			avatarUrl: userMetadata.avatar_url || userMetadata.picture,
			linkedAccounts: [],
			createdAt: supabaseSession.user.created_at,
			updatedAt: supabaseSession.user.updated_at
		}
	};
}

/**
 * 🚧 TODO: Facebook OAuth (пока закомментировано)
 *
 * Для Facebook нужно:
 * 1. Настроить Facebook App в Supabase
 * 2. Получить Facebook Client ID и Secret
 * 3. Добавить Facebook provider в signInWithOAuth
 */
/*
async function signInWithFacebook() {
	// TODO: Implement Facebook OAuth
	// const { data, error } = await supabase.auth.signInWithOAuth({
	// 	provider: 'facebook',
	// 	options: {
	// 		redirectTo: `${window.location.origin}/auth/callback`
	// 	}
	// });
}
*/
