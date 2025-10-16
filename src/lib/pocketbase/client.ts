import PocketBase from 'pocketbase';
import { browser } from '$app/environment';
import type { User } from '$lib/server/domain/interfaces/user.interface';

// PocketBase client configuration
const POCKETBASE_URL = import.meta.env.POCKETBASE_URL || 'http://localhost:8090';

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

		// Enable persistent sessions
		pocketbaseInstance.authStore.save(
			JSON.stringify(pocketbaseInstance.authStore.exportToCookie())
		);

		// Listen to auth store changes
		pocketbaseInstance.authStore.onChange(() => {
			console.log('🔄 [CLIENT] Auth store changed');
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
