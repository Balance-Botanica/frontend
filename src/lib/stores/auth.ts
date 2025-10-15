import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';
import { createClient } from '@supabase/supabase-js';
import type { AuthState, User, Session, LoginCredentials, AuthEvent } from '$lib/auth/types';

// Supabase client
let supabase: any = null;

function getSupabase() {
	if (!browser) return null;

	if (!supabase) {
		const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
		const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

		if (!supabaseUrl || !supabaseKey) {
			console.error('❌ Supabase credentials not configured');
			return null;
		}

		supabase = createClient(supabaseUrl, supabaseKey);
		console.log('🆕 Supabase client created');
	}

	return supabase;
}

function createAuthStore() {
	console.log('🎯 Creating Supabase Auth Store');

	let isInitialized = false;

	const { subscribe, set, update } = writable<AuthState>({
		user: null,
		session: null,
		isLoading: false,
		error: null
	});

	/**
	 * Initialize auth store
	 */
	async function initialize() {
		if (isInitialized || !browser) return;

		console.log('🔄 Initializing Supabase auth store...');

		const sb = getSupabase();
		if (!sb) {
			console.error('❌ Supabase not available');
			set({ user: null, session: null, isLoading: false, error: 'Supabase not configured' });
			isInitialized = true;
			return;
		}

		update((state) => ({ ...state, isLoading: true }));

		try {
			// Get initial session
			const {
				data: { session },
				error
			} = await sb.auth.getSession();

			if (error) {
				console.error('❌ Error getting session:', error);
				set({ user: null, session: null, isLoading: false, error: error.message });
			} else if (session) {
				const user = adaptSupabaseUser(session.user);
				const adaptedSession = adaptSupabaseSession(session);
				set({ user, session: adaptedSession, isLoading: false, error: null });
				console.log('✅ Session restored from Supabase');
			} else {
				set({ user: null, session: null, isLoading: false, error: null });
				console.log('⚠️ No active session');
			}

			// Listen for auth changes
			sb.auth.onAuthStateChange(async (event: string, session: any) => {
				console.log('🔄 Auth state change:', event, !!session);

				if (session) {
					const user = adaptSupabaseUser(session.user);
					const adaptedSession = adaptSupabaseSession(session);
					set({ user, session: adaptedSession, isLoading: false, error: null });
				} else {
					set({ user: null, session: null, isLoading: false, error: null });
				}
			});
		} catch (error) {
			console.error('❌ Auth initialization error:', error);
			set({ user: null, session: null, isLoading: false, error: 'Initialization failed' });
		}

		isInitialized = true;
	}

	/**
	 * Sign in with email/password
	 */
	async function signInWithEmail(credentials: LoginCredentials) {
		const sb = getSupabase();
		if (!sb) throw new Error('Supabase not available');

		try {
			update((state) => ({ ...state, isLoading: true, error: null }));

			const { data, error } = await sb.auth.signInWithPassword({
				email: credentials.email,
				password: credentials.password
			});

			if (error) throw error;

			const user = adaptSupabaseUser(data.user);
			const session = adaptSupabaseSession(data.session);

			set({ user, session, isLoading: false, error: null });
			return { user, session };
		} catch (error: any) {
			const errorMessage = error?.message || 'Sign in failed';
			set({ user: null, session: null, isLoading: false, error: errorMessage });
			throw error;
		}
	}

	/**
	 * Sign in with Google OAuth
	 */
	async function signInWithGoogle() {
		const sb = getSupabase();
		if (!sb || !browser) throw new Error('Supabase not available');

		try {
			update((state) => ({ ...state, isLoading: true, error: null }));

			console.log('🔗 Starting Google OAuth flow...');

			const { data, error } = await sb.auth.signInWithOAuth({
				provider: 'google',
				options: {
					redirectTo: `${window.location.origin}/auth/callback`
				}
			});

			if (error) throw error;

			// OAuth will redirect, so we don't return anything
			console.log('✅ OAuth redirect initiated');
		} catch (error: any) {
			const errorMessage = error?.message || 'Google sign in failed';
			console.error('❌ Google OAuth error:', error);
			set({ user: null, session: null, isLoading: false, error: errorMessage });
			throw error;
		}
	}

	/**
	 * Sign in with Facebook OAuth
	 */
	async function signInWithFacebook() {
		const sb = getSupabase();
		if (!sb || !browser) throw new Error('Supabase not available');

		try {
			update((state) => ({ ...state, isLoading: true, error: null }));

			const { data, error } = await sb.auth.signInWithOAuth({
				provider: 'facebook',
				options: {
					redirectTo: `${window.location.origin}/auth/callback`
				}
			});

			if (error) throw error;
		} catch (error: any) {
			const errorMessage = error?.message || 'Facebook sign in failed';
			set({ user: null, session: null, isLoading: false, error: errorMessage });
			throw error;
		}
	}

	/**
	 * Register with email
	 */
	async function registerWithEmail(credentials: {
		email: string;
		password: string;
		firstName?: string;
		lastName?: string;
	}) {
		const sb = getSupabase();
		if (!sb) throw new Error('Supabase not available');

		try {
			update((state) => ({ ...state, isLoading: true, error: null }));

			const { data, error } = await sb.auth.signUp({
				email: credentials.email,
				password: credentials.password,
				options: {
					data: {
						first_name: credentials.firstName,
						last_name: credentials.lastName
					}
				}
			});

			if (error) throw error;

			// For Supabase, registration usually requires email confirmation
			set({ user: null, session: null, isLoading: false, error: null });
			return { user: null, session: null, confirmationRequired: true };
		} catch (error: any) {
			const errorMessage = error?.message || 'Registration failed';
			set({ user: null, session: null, isLoading: false, error: errorMessage });
			throw error;
		}
	}

	/**
	 * Sign out
	 */
	async function signOut() {
		const sb = getSupabase();
		if (sb) {
			await sb.auth.signOut();
		}
		set({ user: null, session: null, isLoading: false, error: null });
		console.log('✅ Signed out');
	}

	/**
	 * Clear error
	 */
	function clearError() {
		update((state) => ({ ...state, error: null }));
	}

	return {
		subscribe,
		initialize,
		signInWithEmail,
		signInWithGoogle,
		signInWithFacebook,
		registerWithEmail,
		signOut,
		clearError
	};
}

/**
 * Singleton auth store
 */
export const authStore = createAuthStore();

// Initialize on creation
if (typeof window !== 'undefined') {
	authStore.initialize();
}

// Derived stores
export const user = derived(authStore, ($store) => $store.user);
export const session = derived(authStore, ($store) => $store.session);
export const isLoading = derived(authStore, ($store) => $store.isLoading);
export const error = derived(authStore, ($store) => $store.error);
export const isAuthenticated = derived(authStore, ($store) => !!$store.user && !!$store.session);

/**
 * Utility functions
 */
function adaptSupabaseUser(sbUser: any): User {
	return {
		id: sbUser.id,
		email: sbUser.email || '',
		name:
			sbUser.user_metadata?.full_name ||
			sbUser.user_metadata?.name ||
			`${sbUser.user_metadata?.first_name || ''} ${sbUser.user_metadata?.last_name || ''}`.trim() ||
			extractNameFromEmail(sbUser.email),
		firstName: sbUser.user_metadata?.first_name,
		lastName: sbUser.user_metadata?.last_name,
		avatarUrl: sbUser.user_metadata?.avatar_url,
		phone: sbUser.phone,
		dateOfBirth: undefined,
		linkedAccounts: [],
		createdAt: sbUser.created_at,
		updatedAt: sbUser.updated_at
	};
}

function adaptSupabaseSession(sbSession: any): Session {
	return {
		access_token: sbSession.access_token,
		refresh_token: sbSession.refresh_token,
		expires_at: sbSession.expires_at,
		user: adaptSupabaseUser(sbSession.user)
	};
}

function extractNameFromEmail(email?: string): string {
	if (!email) return 'User';
	return email.split('@')[0].replace(/[._-]/g, ' ');
}
