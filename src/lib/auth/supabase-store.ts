import { writable, derived } from 'svelte/store';
import { get } from 'svelte/store';
import { browser } from '$app/environment';
import { replaceState } from '$app/navigation';
import { supabase } from '$lib/supabase/client';
import {
	AuthEvent,
	AuthEventUtils,
	type User,
	type Session,
	type AuthState,
	type LoginCredentials,
	type OAuthProvider
} from './types';

/**
 * 🧠 Singleton Auth Store с линковкой аккаунтов
 *
 * Принципы:
 * - Singleton pattern для предотвращения множественных экземпляров
 * - GRASP: High Cohesion, Low Coupling
 * - SOLID: Single Responsibility, Open/Closed, Dependency Inversion
 * - DRY: Don't Repeat Yourself
 * - WET: Write Everything Twice (для критических операций)
 */

// Singleton instance
let authStoreInstance: ReturnType<typeof createSupabaseAuthStore> | null = null;

function createSupabaseAuthStore() {
	console.log('🎯 [AUTH] Creating Supabase Auth Store!', new Date().toISOString());

	// Initialization state tracking
	let isInitialized = false;
	let isInitializing = false;

	const { subscribe, set, update } = writable<AuthState>({
		user: null,
		session: null,
		isLoading: false,
		error: null
	});

	/**
	 * 🔐 Initialize and restore session
	 * Automatically restores session on load with enhanced OAuth support
	 */
	async function initialize() {
		// Prevent multiple simultaneous initializations
		if (isInitialized) {
			console.log('ℹ️ [AUTH] Auth store already initialized - skipping');
			return;
		}

		if (isInitializing) {
			console.log('⏳ [AUTH] Auth store initialization already in progress - waiting...');
			return;
		}

		isInitializing = true;
		console.log('🔄 [AUTH] Initializing auth store...');
		console.log('🔍 [AUTH] Current store state before init:', {
			user: null,
			session: null,
			isLoading: false,
			error: null,
			browserAvailable: browser,
			supabaseAvailable: !!supabase,
			timestamp: new Date().toISOString()
		});

		// Only in browser environment
		if (!browser || !supabase) {
			console.log('⚠️ [AUTH] Not in browser environment or Supabase not available:', {
				browser,
				supabaseAvailable: !!supabase
			});
			set({ user: null, session: null, isLoading: false, error: null });
			// Reset flags and return
			isInitializing = false;
			isInitialized = true; // Mark as initialized even if no auth is available
			return;
		}

		console.log('🚀 [AUTH] Browser environment detected, starting initialization...');
		update((state) => ({ ...state, isLoading: true }));

		try {
			// Handle OAuth tokens in URL hash - let Supabase process first, then clean
			const hash = window.location.hash;
			let tokensDetected = false;

			if (hash.includes('access_token=')) {
				console.log('🔒 [AUTH] OAuth tokens detected in URL - processing with Supabase first');
				tokensDetected = true;
			} else {
				console.log('ℹ️ [AUTH] No OAuth tokens in URL hash');
			}

			console.log('🔍 [AUTH] Getting current session...');

			// Debug session restoration
			console.log('🔍 [AUTH] Attempting session restoration with enhanced debugging...');
			if (typeof window !== 'undefined') {
				try {
					// Check localStorage directly for session data
					const keys = Object.keys(localStorage).filter(
						(key) => key.includes('supabase') || key.includes('sb-')
					);
					console.log('🔑 [AUTH] Found localStorage keys related to Supabase:', keys);

					// Check if any session-like data exists
					keys.forEach((key) => {
						try {
							const data = localStorage.getItem(key);
							if (data && (data.includes('access_token') || data.includes('refresh_token'))) {
								console.log(
									`🔑 [AUTH] Session data found in ${key}:`,
									data.substring(0, 100) + '...'
								);
							}
						} catch (e) {
							console.log(`🔑 [AUTH] Could not read ${key}:`, e);
						}
					});
				} catch (error) {
					console.log('⚠️ [AUTH] Could not check localStorage:', error);
				}
			}

			// Get current session - Supabase will automatically handle OAuth tokens
			const {
				data: { session },
				error
			} = await supabase.auth.getSession();

			if (error) {
				console.error('❌ [AUTH] Error getting session:', error);
				throw error;
			}

			// Clean URL hash AFTER Supabase has processed the tokens
			if (tokensDetected) {
				console.log('🧹 [AUTH] Cleaning OAuth tokens from URL after processing');
				try {
					// Use a small delay to ensure Supabase processing is complete
					setTimeout(() => {
						if (window.history && window.history.replaceState) {
							const cleanUrl = window.location.pathname + window.location.search;
							window.history.replaceState({}, document.title, cleanUrl);
							console.log('✅ [AUTH] URL hash cleaned successfully after processing');
						}
					}, 100); // Small delay to ensure Supabase processes tokens first
				} catch (error) {
					console.warn('⚠️ [AUTH] Could not clean URL hash:', error);
				}
			}

			if (session) {
				console.log('✅ [AUTH] Session found during initialization:', {
					userId: session.user.id,
					email: session.user.email,
					provider: session.user.app_metadata?.provider,
					expiresAt: session.expires_at
						? new Date(session.expires_at * 1000).toISOString()
						: 'No expiration',
					accessTokenPresent: !!session.access_token,
					refreshTokenPresent: !!session.refresh_token,
					sessionSource: 'Page refresh session restoration'
				});

				// Get extended user profile
				console.log('👤 [AUTH] Getting extended user profile...');
				// TEMPORARILY DISABLED: Database profile fetching due to CORS/schema issues
				// let user = await getExtendedUserProfile(session.user.id);
				let user = null; // Skip database fetching for now

				// If no extended profile exists, create one from OAuth data
				if (!user) {
					console.log(
						'🆕 [AUTH] No database profile found, creating from OAuth data for session restoration'
					);
					user = createUserFromOAuthData(session.user);
					console.log('✅ [AUTH] Created user from OAuth data for session restoration:', {
						id: user.id,
						email: user.email,
						name: user.name,
						avatarUrl: user.avatarUrl
					});
				}

				// Adapt Supabase Session to our type
				const adaptedSession = adaptSupabaseSession(session);

				set({ user, session: adaptedSession, isLoading: false, error: null });
				console.log('✅ [AUTH] Session restored successfully:', {
					userEmail: user?.email,
					userName: user?.name,
					avatarUrl: user?.avatarUrl,
					sessionExpiresAt: adaptedSession?.expires_at
						? new Date(adaptedSession.expires_at * 1000).toISOString()
						: 'No expiration',
					accessTokenPresent: !!adaptedSession?.access_token,
					refreshTokenPresent: !!adaptedSession?.refresh_token,
					timestamp: new Date().toISOString()
				});
			} else {
				console.log(
					'⚠️ [AUTH] No existing session found during page refresh - user needs to re-authenticate'
				);
				console.log('🔍 [AUTH] This could indicate:');
				console.log('  1. User never logged in');
				console.log('  2. Session expired');
				console.log('  3. localStorage was cleared');
				console.log('  4. Different browser/incognito mode');
				console.log('  5. Supabase client configuration issue');
				set({ user: null, session: null, isLoading: false, error: null });
				console.log('🔍 [AUTH] Auth store set to unauthenticated state:', {
					user: null,
					session: null,
					isLoading: false,
					error: null,
					timestamp: new Date().toISOString()
				});
			}
		} catch (error) {
			console.error('❌ [AUTH] Auth initialization error:', error);
			set({ user: null, session: null, isLoading: false, error: 'Failed to initialize auth' });
			console.log('🔍 [AUTH] Auth store set to error state:', {
				user: null,
				session: null,
				isLoading: false,
				error: 'Failed to initialize auth',
				errorMessage: error instanceof Error ? error.message : String(error),
				errorStack: error instanceof Error ? error.stack : 'No stack trace',
				timestamp: new Date().toISOString()
			});
			// Reset initialization flags on error
			isInitializing = false;
			// Don't set isInitialized = true on error, allow retry
		}

		console.log('🏁 [AUTH] Initialization complete');
		isInitializing = false;
		isInitialized = true;
	}

	/**
	 * 🔗 Get extended user profile
	 * Includes linked accounts and additional information
	 */
	async function getExtendedUserProfile(userId: string): Promise<User | null> {
		console.log('👤 [AUTH] ⭐ GETTING EXTENDED PROFILE FOR:', userId);

		if (!browser || !supabase) {
			console.log('⚠️ [AUTH] Browser or Supabase not available for profile fetch');
			return null;
		}

		try {
			console.log('🔍 [AUTH] Querying user_profiles table...');

			// Add timeout to prevent hanging
			const profilePromise = supabase
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

			// Add 5-second timeout to prevent hanging
			const timeoutPromise = new Promise((_, reject) =>
				setTimeout(() => reject(new Error('Profile query timeout')), 5000)
			);

			const { data: profile, error } = (await Promise.race([
				profilePromise,
				timeoutPromise
			])) as any;

			if (error) {
				console.log(
					'⚠️ [AUTH] No profile found in database (this is normal for new OAuth users):',
					error.message
				);
				return null;
			}

			console.log('✅ [AUTH] Profile found in database:', {
				id: profile.id,
				email: profile.email,
				full_name: profile.full_name,
				linkedAccounts: profile.linked_accounts?.length || 0
			});

			// Map to our User interface
			return mapProfileToUser(profile);
		} catch (error) {
			console.log(
				'⚠️ [AUTH] Profile query failed (normal for new users):',
				error instanceof Error ? error.message : String(error)
			);
			return null;
		}
	}

	/**
	 * 🎯 Google OAuth авторизация
	 * Автоматически линкует с существующим email аккаунтом
	 */
	async function signInWithGoogle() {
		if (!browser || !supabase) {
			throw new Error('Supabase not available');
		}

		try {
			update((state) => ({ ...state, isLoading: true, error: null }));

			const { data, error } = await supabase!.auth.signInWithOAuth({
				provider: 'google',
				options: {
					redirectTo: `http://localhost:5173/auth/callback`, // Фиксированный URL для разработки
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
		if (!browser || !supabase) {
			throw new Error('Supabase not available');
		}

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
			let { data, error } = await supabase!.auth.signInWithPassword({
				email: credentials.email,
				password: credentials.password
			});

			// If пользователь не найден, регистрируем
			if (error && error.message.includes('Invalid login credentials')) {
				const signUpResult = await supabase!.auth.signUp({
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
	 * 📧 Email Registration
	 * Register a new user with email and password
	 */
	async function registerWithEmail(credentials: {
		email: string;
		password: string;
		firstName?: string;
		lastName?: string;
	}) {
		if (!browser || !supabase) {
			throw new Error('Supabase not available');
		}

		try {
			update((state) => ({ ...state, isLoading: true, error: null }));

			const { data, error } = await supabase.auth.signUp({
				email: credentials.email,
				password: credentials.password,
				options: {
					emailRedirectTo: `${window.location.origin}/auth/callback`,
					data: {
						first_name: credentials.firstName,
						last_name: credentials.lastName
					}
				}
			});

			if (error) throw error;

			console.log('✅ [AUTH] Registration successful:', {
				userEmail: data.user?.email,
				confirmationSent: !data.session
			});

			// If user needs to confirm email, return without setting session
			if (!data.session) {
				update((state) => ({ ...state, isLoading: false, error: null }));
				return {
					user: null,
					session: null,
					confirmationRequired: true,
					message: 'Please check your email to confirm your account'
				};
			}

			// If auto-confirmed, handle successful auth
			await handleSuccessfulAuth(data.session);

			const user = createUserFromOAuthData(data.user!);
			const session = adaptSupabaseSession(data.session!);

			return { user, session, confirmationRequired: false };
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Failed to register with email';
			set({ user: null, session: null, isLoading: false, error: errorMessage });
			throw error;
		}
	}

	/**
	 * 📧 Sign In with Email (login only)
	 * Updated to only handle login, not registration
	 */
	async function signInWithEmailOnly(credentials: LoginCredentials) {
		if (!browser || !supabase) {
			throw new Error('Supabase not available');
		}

		try {
			update((state) => ({ ...state, isLoading: true, error: null }));

			const { data, error } = await supabase.auth.signInWithPassword({
				email: credentials.email,
				password: credentials.password
			});

			if (error) throw error;

			if (!data.user || !data.session) {
				throw new Error('No user data received');
			}

			console.log('✅ [AUTH] Email sign-in successful:', {
				userEmail: data.user.email,
				userId: data.user.id
			});

			await handleSuccessfulAuth(data.session);

			const user =
				(await getExtendedUserProfile(data.user.id)) || createUserFromOAuthData(data.user);
			const session = adaptSupabaseSession(data.session);

			return { user, session };
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Failed to sign in with email';
			set({ user: null, session: null, isLoading: false, error: errorMessage });
			throw error;
		}
	}

	/**
	 * 🔑 Forgot Password
	 * Send password reset email
	 */
	async function sendPasswordResetEmail(email: string) {
		if (!browser || !supabase) {
			throw new Error('Supabase not available');
		}

		try {
			update((state) => ({ ...state, isLoading: true, error: null }));

			const { error } = await supabase.auth.resetPasswordForEmail(email, {
				redirectTo: `${window.location.origin}/auth/reset-password`
			});

			if (error) throw error;

			console.log('✅ [AUTH] Password reset email sent:', { email });
			update((state) => ({ ...state, isLoading: false, error: null }));

			return { success: true, message: 'Password reset email sent successfully' };
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'Failed to send password reset email';
			update((state) => ({ ...state, isLoading: false, error: errorMessage }));
			throw error;
		}
	}

	/**
	 * 🔒 Reset Password
	 * Update password using reset token
	 */
	async function updatePassword(newPassword: string) {
		if (!browser || !supabase) {
			throw new Error('Supabase not available');
		}

		try {
			update((state) => ({ ...state, isLoading: true, error: null }));

			const { error } = await supabase.auth.updateUser({
				password: newPassword
			});

			if (error) throw error;

			console.log('✅ [AUTH] Password updated successfully');
			update((state) => ({ ...state, isLoading: false, error: null }));

			return { success: true, message: 'Password updated successfully' };
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Failed to update password';
			update((state) => ({ ...state, isLoading: false, error: errorMessage }));
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
			} = await supabase!.auth.getUser();
			if (!user) throw new Error('No authenticated user');

			// Обновляем профиль в базе
			const { error } = await supabase!.from('user_profiles').upsert({
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
	 * 🔄 Handle successful authentication
	 * Automatically links accounts and updates state with enhanced OAuth data
	 */
	async function handleSuccessfulAuth(sessionParam?: any) {
		try {
			console.log('🔥 [AUTH] ⭐ HANDLE_SUCCESSFUL_AUTH STARTING...');
			update((state) => ({ ...state, isLoading: true }));

			let session = sessionParam;
			if (!session) {
				console.log('🔍 [AUTH] No session param provided, getting current session...');
				const {
					data: { session: currentSession }
				} = await supabase!.auth.getSession();
				session = currentSession;
			} else {
				console.log('🔍 [AUTH] Using provided session parameter');
			}

			if (!session) {
				console.warn('⚠️ [AUTH] No session found in handleSuccessfulAuth');
				return;
			}

			console.log('🔍 [AUTH] Session found, processing immediately...');
			console.log('🔍 [AUTH] Session details:', {
				userEmail: session.user.email,
				userId: session.user.id,
				userMetadata: session.user.user_metadata,
				accessTokenPresent: !!session.access_token,
				refreshTokenPresent: !!session.refresh_token
			});

			// IMMEDIATE: Create user from OAuth data (no database dependency)
			console.log('🆕 [AUTH] ⭐ CREATING USER FROM OAUTH DATA IMMEDIATELY...');
			console.log('🔍 [AUTH] Raw session.user object:', session.user);
			const user = createUserFromOAuthData(session.user);
			console.log('✅ [AUTH] ⭐ USER CREATED FROM OAUTH:', {
				id: user.id,
				email: user.email,
				name: user.name,
				firstName: user.firstName,
				lastName: user.lastName,
				avatarUrl: user.avatarUrl
			});

			// Adapt Supabase Session to our type
			console.log('🔄 [AUTH] ⭐ ADAPTING SESSION TO OUR FORMAT...');
			const adaptedSession = adaptSupabaseSession(session);
			console.log('✅ [AUTH] ⭐ SESSION ADAPTED SUCCESSFULLY');

			// CRITICAL: Update the store state IMMEDIATELY with OAuth data
			console.log('💾 [AUTH] ⭐⭐⭐ SETTING STORE STATE IMMEDIATELY:');
			console.log('   👤 User:', {
				id: user?.id,
				email: user?.email,
				name: user?.name,
				avatarUrl: user?.avatarUrl
			});
			console.log('   🔑 Session:', {
				accessTokenPresent: !!adaptedSession?.access_token,
				refreshTokenPresent: !!adaptedSession?.refresh_token,
				expiresAt: adaptedSession?.expires_at
			});
			console.log('   📊 State flags: { isLoading: false, error: null }');

			set({ user, session: adaptedSession, isLoading: false, error: null });

			// Create session token for server-side authentication
			await createSessionToken(user.id);

			console.log('🎉 [AUTH] ⭐⭐⭐ AUTH STATE UPDATED SUCCESSFULLY! Store should now show:');
			console.log('   🔐 isAuthenticated: true');
			console.log('   👤 user.email:', user?.email);
			console.log('   📛 user.name:', user?.name);
			console.log('   🖼️ user.avatarUrl:', user?.avatarUrl);

			// Background operations (completely non-blocking)
			console.log('🔄 [AUTH] Starting background operations (non-blocking)...');

			// Try database operations in background (don't wait, don't block)
			// TEMPORARILY DISABLED: Database schema issues
			// setTimeout(() => {
			// 	Promise.resolve().then(async () => {
			// 		try {
			// 			console.log('💾 [AUTH] Background: Attempting to save profile to database...');
			// 			await updateUserProfile(user);
			// 			console.log('✅ [AUTH] Background: Profile saved to database');
			// 		} catch (error) {
			// 			console.warn('⚠️ [AUTH] Background: Could not save profile to database:', error);
			// 		}
			// 	});
			// }, 0);

			// Auto-link accounts in background (don't wait, don't block)
			// TEMPORARILY DISABLED: Database schema issues
			// setTimeout(() => {
			// 	Promise.resolve().then(async () => {
			// 		try {
			// 			console.log('🔗 [AUTH] Background: Attempting to auto-link accounts...');
			// 			await autoLinkAccounts(session.user);
			// 			console.log('✅ [AUTH] Background: Auto-link completed');
			// 		} catch (error) {
			// 			console.warn('⚠️ [AUTH] Background: Auto-link failed:', error);
			// 		}
			// 	});
			// }, 0);

			console.log('🎆 [AUTH] ⭐ AUTHENTICATION FLOW COMPLETED SUCCESSFULLY!');
		} catch (error) {
			console.error('❌ [AUTH] ⚠️ FAILED TO HANDLE SUCCESSFUL AUTH:', error);
			console.error('   📊 Error details:', {
				message: error instanceof Error ? error.message : String(error),
				stack: error instanceof Error ? error.stack : 'No stack trace'
			});
			set({
				user: null,
				session: null,
				isLoading: false,
				error: 'Failed to process authentication'
			});
		}
	}

	// Create session token for server-side authentication
	async function createSessionToken(userId: string) {
		try {
			console.log('🔐 [SESSION] Creating session token for user:', userId);

			// Get user email from state
			const currentState = get(supabaseAuthStore);
			const email = currentState.user?.email || '';
			console.log('🔐 [SESSION] User email:', email);

			console.log('🔐 [SESSION] Making request to /auth/login...');
			const response = await fetch('/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ userId, email })
			});

			console.log('🔐 [SESSION] Response status:', response.status);
			console.log('🔐 [SESSION] Response ok:', response.ok);

			const data = await response.json();
			console.log('🔐 [SESSION] Response data:', data);

			if (!data.success) {
				console.error('❌ [SESSION] Failed to create session token:', data.error);
				// Показываем пользователю уведомление об ошибке
				console.error(
					'🔴 [SESSION] Server-side authentication failed! Profile access may not work.'
				);
			} else {
				console.log('✅ [SESSION] Session token created successfully!');
			}
		} catch (error) {
			console.error('❌ [SESSION] Error creating session token:', error);
			console.error('🔴 [SESSION] Server-side authentication failed! Profile access may not work.');
			// Не выбрасываем ошибку, чтобы не ломать основной flow аутентификации
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
			const { data: existingProfile } = await supabase!
				.from('user_profiles')
				.select('id, linked_accounts')
				.eq('email', currentUser.email)
				.single();

			if (existingProfile && existingProfile.id !== currentUser.id) {
				// Линкуем аккаунты
				await supabase!.from('linked_accounts').insert({
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
	 * 🚪 Sign out from system
	 */
	async function signOut() {
		console.log('🚪 [AUTH] Starting sign out process...');

		try {
			update((state) => ({ ...state, isLoading: true }));
			console.log('⏳ [AUTH] Setting loading state...');

			const { error } = await supabase!.auth.signOut();
			if (error) {
				console.error('❌ [AUTH] Supabase sign out error:', error);
				throw error;
			}

			console.log('✅ [AUTH] Successfully signed out from Supabase');
			set({ user: null, session: null, isLoading: false, error: null });
			console.log('🏁 [AUTH] Auth state cleared successfully');
		} catch (error) {
			console.error('❌ [AUTH] Sign out error:', error);
			// Clear state anyway to ensure user is logged out locally
			set({ user: null, session: null, isLoading: false, error: null });
			console.log('⚠️ [AUTH] Auth state cleared despite error');
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
			const { data, error } = await supabase!.auth.setSession({
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
			} = await supabase!.auth.getUser();
			if (!user) return null;

			const { data, error } = await supabase!
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

	/**
	 * 🔄 Authentication Event Handler
	 * Handles all auth state changes using proper enum-based events
	 */
	async function handleAuthStateChange(event: string, session: any): Promise<void> {
		console.log('🔄 [AUTH] Auth state change detected:', {
			event,
			hasSession: !!session,
			userEmail: session?.user?.email
		});

		const authEvent = AuthEventUtils.toAuthEvent(event);

		if (!authEvent) {
			console.warn('⚠️ [AUTH] Unknown auth event received:', event);
			return;
		}

		console.log(
			'🔄 [AUTH] Processing auth event:',
			authEvent,
			AuthEventUtils.getEventDescription(authEvent),
			'User:',
			session?.user?.email
		);

		switch (authEvent) {
			case AuthEvent.INITIAL_SESSION:
				if (session) {
					console.log('🏁 [AUTH] Initial session loaded, checking if already authenticated...');
					// Check if we're already authenticated to prevent overriding SIGNED_IN state
					const currentState = get(supabaseAuthStore);
					if (
						currentState.user &&
						currentState.session &&
						currentState.user.email === session.user.email
					) {
						console.log(
							'✅ [AUTH] Already authenticated with same user, skipping INITIAL_SESSION processing'
						);
						return;
					}
					console.log('🏁 [AUTH] Processing initial session...');
					await handleSuccessfulAuth(session);
				} else {
					console.log('ℹ️ [AUTH] No initial session found');
					set({ user: null, session: null, isLoading: false, error: null });
				}
				break;

			case AuthEvent.SIGNED_IN:
				if (session) {
					console.log('✅ [AUTH] User signed in, updating auth state...');
					await handleSuccessfulAuth(session);
				} else {
					console.warn('⚠️ [AUTH] SIGNED_IN event but no session provided');
				}
				break;

			case AuthEvent.SIGNED_OUT:
				console.log('💪 [AUTH] User signed out, clearing auth state');
				set({ user: null, session: null, isLoading: false, error: null });
				break;

			case AuthEvent.TOKEN_REFRESHED:
				if (session) {
					console.log('🔄 [AUTH] Token refreshed, updating session');
					// Update session when token is refreshed
					const user = await getExtendedUserProfile(session.user.id);
					const adaptedSession = adaptSupabaseSession(session);
					set({ user, session: adaptedSession, isLoading: false, error: null });
					console.log('✅ [AUTH] Session updated after token refresh');
				} else {
					console.warn('⚠️ [AUTH] TOKEN_REFRESHED event but no session provided');
				}
				break;

			case AuthEvent.USER_UPDATED:
				if (session) {
					console.log('👤 [AUTH] User data updated, refreshing profile');
					// Refresh user profile when user data is updated
					const user = await getExtendedUserProfile(session.user.id);
					if (user) {
						update((state) => ({ ...state, user }));
						console.log('✅ [AUTH] User profile refreshed');
					}
				} else {
					console.warn('⚠️ [AUTH] USER_UPDATED event but no session provided');
				}
				break;

			case AuthEvent.PASSWORD_RECOVERY:
				// Handle password recovery flow
				console.log('🔑 [AUTH] Password recovery initiated');
				break;

			default:
				// This should never happen due to validation above, but keeping for safety
				console.warn('⚠️ [AUTH] Unhandled auth event:', authEvent);
				break;
		}

		console.log('🏁 [AUTH] Auth state change processing complete');
	}

	// Setup auth state listener only in browser
	if (
		browser &&
		supabase &&
		supabase.auth &&
		typeof supabase.auth.onAuthStateChange === 'function'
	) {
		try {
			supabase.auth.onAuthStateChange(handleAuthStateChange);
		} catch (error) {
			console.error('❌ Failed to setup auth state listener:', error);
		}
	}

	return {
		subscribe,
		initialize,
		signInWithGoogle,
		signInWithFacebook,
		signInWithEmail,
		registerWithEmail,
		signInWithEmailOnly,
		sendPasswordResetEmail,
		updatePassword,
		linkAccount,
		updateUserProfile,
		signOut,
		setSession,
		clearError,
		getLinkedAccountsStats
	};
}

/**
 * 🔒 Singleton function to get or create the auth store instance
 * Prevents multiple auth store instances that cause state conflicts
 */
function getSupabaseAuthStore() {
	if (!authStoreInstance) {
		console.log('🆕 [AUTH] Creating new singleton auth store instance');
		authStoreInstance = createSupabaseAuthStore();

		// Auto-initialize only once when the singleton is first created
		if (typeof window !== 'undefined') {
			console.log('🚀 [AUTH] Auto-initializing singleton auth store');
			authStoreInstance.initialize();
		}
	} else {
		console.log('♻️ [AUTH] Returning existing singleton auth store instance');
	}
	return authStoreInstance;
}

export const supabaseAuthStore = getSupabaseAuthStore();

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
 * 🔧 Utilities for data mapping
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
 * 🆕 Create user data from OAuth metadata
 * Used when database profile doesn't exist yet
 */
function createUserFromOAuthData(supabaseUser: any): User {
	const metadata = supabaseUser.user_metadata || {};
	console.log('🔍 Creating user from OAuth metadata:', metadata);

	return {
		id: supabaseUser.id,
		email: supabaseUser.email || '',
		name: metadata.full_name || metadata.name || extractNameFromEmail(supabaseUser.email),
		firstName: metadata.first_name,
		lastName: metadata.last_name,
		phone: undefined,
		dateOfBirth: undefined,
		avatarUrl: metadata.avatar_url || metadata.picture,
		linkedAccounts: [],
		createdAt: supabaseUser.created_at,
		updatedAt: supabaseUser.updated_at || new Date().toISOString()
	};
}

/**
 * 📎 Extract name from email address
 */
function extractNameFromEmail(email?: string): string {
	if (!email) return 'User';
	return email.split('@')[0].replace(/[._-]/g, ' ');
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
