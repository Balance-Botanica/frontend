import { writable, derived } from 'svelte/store';
import { get } from 'svelte/store';
import { browser } from '$app/environment';
import { pb } from '$lib/pocketbase/client';
import type { AuthState, Session } from '$lib/pocketbase/client';
import type { User } from '$lib/server/domain/interfaces/user.interface';

/**
 * 🧠 PocketBase Auth Store
 *
 * Replaces Supabase authentication with PocketBase authentication
 */

// Singleton instance
let authStoreInstance: ReturnType<typeof createPocketBaseAuthStore> | null = null;

function createPocketBaseAuthStore() {
	console.log('🎯 [AUTH] Creating PocketBase Auth Store!', new Date().toISOString());

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
	 * Automatically restores session on load
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
		console.log('🔄 [AUTH] Initializing PocketBase auth store...');
		console.log('🔍 [AUTH] Current store state before init:', {
			user: null,
			isLoading: false,
			error: null,
			browserAvailable: browser,
			pocketbaseAvailable: !!pb,
			timestamp: new Date().toISOString()
		});

		// Only in browser environment
		if (!browser || !pb) {
			console.log('⚠️ [AUTH] Not in browser environment or PocketBase not available:', {
				browser,
				pocketbaseAvailable: !!pb
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
			// Check if we have an existing auth record
			console.log('[AUTH] 🔍 Checking for existing session during initialization');
			console.log('[AUTH] 🔑 Auth store state:', {
				isValid: pb.authStore.isValid,
				token: !!pb.authStore.token,
				tokenLength: pb.authStore.token?.length,
				model: !!pb.authStore.model
			});

			if (pb.authStore.isValid) {
				console.log('✅ [AUTH] Valid session found during initialization');

				// Get user from PocketBase auth record
				const pbUser = pb.authStore.model;
				console.log('[AUTH] 🔍 Auth store model check:', {
					hasModel: !!pbUser,
					modelKeys: pbUser ? Object.keys(pbUser) : null,
					modelId: pbUser?.id,
					modelEmail: pbUser?.email
				});

				if (pbUser) {
					// Use PocketBase user data directly
					const user = createUserFromPBData(pbUser);

					set({
						user,
						session: adaptPocketBaseSession(pb.authStore),
						isLoading: false,
						error: null
					});

					// Ensure auth state is saved to cookies
					console.log('[AUTH] 💾 Ensuring auth state is saved to cookies on restore');
					pb.authStore.save();

					console.log('✅ [AUTH] Session restored successfully:', {
						userEmail: user?.email,
						userId: user?.id,
						timestamp: new Date().toISOString()
					});
				} else {
					console.log('[AUTH] ⚠️ Valid token but no user model - attempting refresh');
					// Try to refresh the auth token to get user data
					try {
						await pb.collection('users').authRefresh();
						console.log('[AUTH] ✅ Auth refresh successful');

						const refreshedUser = pb.authStore.model;
						if (refreshedUser) {
							const user = createUserFromPBData(refreshedUser);
							set({
								user,
								session: adaptPocketBaseSession(pb.authStore),
								isLoading: false,
								error: null
							});
							pb.authStore.save();
							console.log('✅ [AUTH] Session restored via refresh:', {
								userEmail: user?.email,
								userId: user?.id
							});
						} else {
							set({ user: null, session: null, isLoading: false, error: null });
						}
					} catch (refreshError) {
						console.log('[AUTH] ❌ Auth refresh failed:', refreshError);
						// Clear invalid token
						pb.authStore.clear();
						set({ user: null, session: null, isLoading: false, error: null });
					}
				}
			} else {
				console.log('⚠️ [AUTH] No existing session found during initialization');
				set({ user: null, session: null, isLoading: false, error: null });
			}
		} catch (error) {
			console.error('❌ [AUTH] Auth initialization error:', error);
			set({ user: null, session: null, isLoading: false, error: 'Failed to initialize auth' });
			console.log('🔍 [AUTH] Auth store set to error state:', {
				user: null,
				isLoading: false,
				error: 'Failed to initialize auth',
				errorMessage: error instanceof Error ? error.message : String(error),
				timestamp: new Date().toISOString()
			});
		}

		console.log('🏁 [AUTH] Initialization complete');
		isInitializing = false;
		isInitialized = true;
	}

	/**
	 * 🎯 Google OAuth authorization
	 */
	async function signInWithGoogle() {
		if (!browser || !pb) {
			throw new Error('PocketBase not available');
		}

		try {
			update((state) => ({ ...state, isLoading: true, error: null }));

			console.log('🔗 [AUTH] Starting Google OAuth flow...');

			// PocketBase OAuth flow
			const authData = await pb.collection('users').authWithOAuth2({
				provider: 'google'
			});

			// After successful OAuth, update our auth state
			await handleSuccessfulAuth(authData.record);

			return authData;
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Failed to sign in with Google';
			set({ user: null, session: null, isLoading: false, error: errorMessage });
			throw error;
		}
	}

	/**
	 * 📘 Facebook OAuth authorization
	 */
	async function signInWithFacebook() {
		if (!browser || !pb) {
			throw new Error('PocketBase not available');
		}

		try {
			update((state) => ({ ...state, isLoading: true, error: null }));

			console.log('🔗 [AUTH] Starting Facebook OAuth flow...');

			// PocketBase OAuth flow
			const authData = await pb.collection('users').authWithOAuth2({
				provider: 'facebook'
			});

			// After successful OAuth, update our auth state
			await handleSuccessfulAuth(authData.record);

			return authData;
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'Failed to sign in with Facebook';
			set({ user: null, session: null, isLoading: false, error: errorMessage });
			throw error;
		}
	}

	/**
	 * 📧 Email/Password authorization
	 */
	async function signInWithEmail(email: string, password: string) {
		try {
			update((state) => ({ ...state, isLoading: true, error: null }));

			// Check if PocketBase client is available
			if (!pb) {
				throw new Error('PocketBase not available');
			}

			// Authenticate with PocketBase
			const authData = await pb.collection('users').authWithPassword(email, password);

			// After successful auth, update our state
			await handleSuccessfulAuth(authData.record);

			const user = createUserFromPBData(authData.record);

			return { user };
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Failed to sign in with email';
			set({ user: null, session: null, isLoading: false, error: errorMessage });
			throw error;
		}
	}

	/**
	 * 📧 Email Registration
	 */
	async function registerWithEmail(credentials: {
		email: string;
		password: string;
		firstName?: string;
		lastName?: string;
	}) {
		if (!browser || !pb) {
			throw new Error('PocketBase not available');
		}

		try {
			update((state) => ({ ...state, isLoading: true, error: null }));

			// Create user in PocketBase
			const userRecord = await pb.collection('users').create({
				email: credentials.email,
				password: credentials.password,
				passwordConfirm: credentials.password,
				first_name: credentials.firstName,
				last_name: credentials.lastName
			});

			// Authenticate the user immediately after creation
			const authData = await pb
				.collection('users')
				.authWithPassword(credentials.email, credentials.password);

			console.log('✅ [AUTH] Registration successful:', {
				userEmail: userRecord.email,
				userId: userRecord.id
			});

			await handleSuccessfulAuth(authData.record);

			const user = createUserFromPBData(authData.record);

			return { user };
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Failed to register with email';
			set({ user: null, session: null, isLoading: false, error: errorMessage });
			throw error;
		}
	}

	/**
	 * 🔑 Forgot Password
	 */
	async function sendPasswordResetEmail(email: string) {
		if (!browser || !pb) {
			throw new Error('PocketBase not available');
		}

		try {
			update((state) => ({ ...state, isLoading: true, error: null }));

			await pb.collection('users').requestPasswordReset(email);

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
	 */
	async function updatePassword(newPassword: string, newPasswordConfirm: string) {
		if (!browser || !pb) {
			throw new Error('PocketBase not available');
		}

		try {
			update((state) => ({ ...state, isLoading: true, error: null }));

			// Check if user is authenticated
			if (!pb.authStore.model?.id) {
				throw new Error('User not authenticated');
			}

			// Update password for currently authenticated user
			await pb.collection('users').update(pb.authStore.model.id, {
				password: newPassword,
				passwordConfirm: newPasswordConfirm
			});

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
	 * 🔒 Handle successful authentication
	 */
	async function handleSuccessfulAuth(pbUser: any) {
		try {
			console.log('🔥 [AUTH] Handling successful authentication...');
			update((state) => ({ ...state, isLoading: true }));

			// Create user from PocketBase data
			const user = createUserFromPBData(pbUser);
			console.log('✅ [AUTH] User created from PocketBase data:', {
				id: user.id,
				email: user.email
				// Note: The User interface doesn't have a name property
			});

			// Update the store state
			set({
				user,
				session: pb ? adaptPocketBaseSession(pb.authStore) : null,
				isLoading: false,
				error: null
			});

			// Force save auth state to cookies to ensure persistence
			if (pb && pb.authStore.isValid) {
				console.log('[AUTH] 🔄 Force saving auth state to cookies');
				console.log('[AUTH] 🔍 Auth store before save:', {
					isValid: pb.authStore.isValid,
					token: !!pb.authStore.token,
					tokenLength: pb.authStore.token?.length,
					model: !!pb.authStore.model
				});
				pb.authStore.save(pb.authStore.exportToCookie());
				console.log('[AUTH] ✅ Auth state saved to cookies');
			}

			console.log('🎉 [AUTH] Authentication flow completed successfully!');
		} catch (error) {
			console.error('❌ [AUTH] Failed to handle successful auth:', error);
			set({
				user: null,
				session: null,
				isLoading: false,
				error: 'Failed to process authentication'
			});
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

			// Sign out from PocketBase
			if (pb) {
				pb.authStore.clear();
			}

			console.log('✅ [AUTH] Successfully signed out from PocketBase');
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
	 * 🧹 Clear errors
	 */
	function clearError() {
		update((state) => ({ ...state, error: null }));
	}

	// Setup auth state listener only in browser
	if (browser && pb) {
		try {
			pb.authStore.onChange((token, model) => {
				console.log('🔄 [AUTH] Auth store changed:', { token, model });
				if (model) {
					handleSuccessfulAuth(model);
				} else {
					set({ user: null, session: null, isLoading: false, error: null });
				}
			});
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
		sendPasswordResetEmail,
		updatePassword,
		signOut,
		clearError
	};
}

/**
 * 🔒 Singleton function to get or create the auth store instance
 */
function getPocketBaseAuthStore() {
	if (!authStoreInstance) {
		console.log('🆕 [AUTH] Creating new singleton auth store instance');
		authStoreInstance = createPocketBaseAuthStore();

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

/**
 * 🧹 Utility functions
 */

/**
 * 🆕 Create user data from PocketBase metadata
 */
function createUserFromPBData(pbUser: any): User {
	console.log('🔍 Creating user from PocketBase data:', pbUser);

	// Create the user object without the name property since it doesn't exist in the interface
	const user: User = {
		id: pbUser.id,
		email: pbUser.email || '',
		firstName: pbUser.first_name,
		lastName: pbUser.last_name,
		phoneNumber: pbUser.phone_number,
		createdAt: pbUser.created ? new Date(pbUser.created) : new Date()
	};

	return user;
}

function adaptPocketBaseSession(pbAuthStore: any): Session | null {
	if (!pbAuthStore?.token || !pbAuthStore?.model) return null;

	return {
		access_token: pbAuthStore.token,
		refresh_token: pbAuthStore.model.refreshToken || '',
		expires_at: pbAuthStore.model.exp || null,
		user: createUserFromPBData(pbAuthStore.model)
	};
}

export const pocketbaseAuthStore = getPocketBaseAuthStore();

// Derived stores for convenience
export const user = derived(pocketbaseAuthStore, ($store) => $store.user);
export const session = derived(pocketbaseAuthStore, ($store) => $store.session);
export const isLoading = derived(pocketbaseAuthStore, ($store) => $store.isLoading);
export const error = derived(pocketbaseAuthStore, ($store) => $store.error);
export const isAuthenticated = derived(pocketbaseAuthStore, ($store) => !!$store.user);
