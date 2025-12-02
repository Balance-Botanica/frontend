import PocketBase from 'pocketbase';
import { browser } from '$app/environment';
import type { User } from '$lib/server/domain/interfaces/user.interface';

// PocketBase client configuration - use direct URL for OAuth and cookie sharing
const POCKETBASE_URL = import.meta.env.POCKETBASE_URL || 'http://127.0.0.1:8090';

// Singleton pattern to ensure only one PocketBase client instance
let pocketbaseInstance: PocketBase | null = null;

// Create a function that returns the client or null
export function getPocketBaseClient(): PocketBase | null {
	// Only create client in browser environment
	if (!browser) {
		console.log('🌍 [CLIENT] SSR environment detected - no client created');
		return null;
	}

	if (pocketbaseInstance) {
		console.log('♻️ [CLIENT] Returning existing PocketBase client instance');
		return pocketbaseInstance;
	}

	try {
		console.log('🆕 [CLIENT] Creating new PocketBase client instance');
		pocketbaseInstance = new PocketBase(POCKETBASE_URL);

		// Disable automatic cookie export in development
		// We'll handle authentication manually via localStorage and headers
		if (import.meta.env.DEV) {
			// Override the exportToCookie function to do nothing in development
			pocketbaseInstance.authStore.exportToCookie = () => '';
			console.log('🍪 [CLIENT] Disabled automatic cookie export for development');
		}

		// Listen to auth store changes
		pocketbaseInstance.authStore.onChange((token, model) => {
			console.log('🔄 [CLIENT] Auth store changed:', { token: !!token, model: !!model });
			if (model) {
				console.log('✅ [CLIENT] User authenticated:', model.email);
			}
		});

		return pocketbaseInstance;
	} catch (error) {
		console.error('Failed to create PocketBase client:', error);
		return null;
	}
}

// Export the client or null directly (SSR-safe)
export const pb = getPocketBaseClient();

// Auth state types
export interface AuthState {
	user: User | null;
	session: Session | null;
	isLoading: boolean;
	error: string | null;
}

export interface Session {
	access_token: string;
	refresh_token: string;
	expires_at: number;
	user: User;
}
