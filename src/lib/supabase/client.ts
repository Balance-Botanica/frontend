import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import { browser } from '$app/environment';

// Singleton pattern to ensure only one Supabase client instance
let supabaseInstance: SupabaseClient | null = null;
let isClientInitialized = false;

// Create a function that returns the client or null
export function getSupabaseClient(): SupabaseClient | null {
	// Only create client in browser environment
	if (!browser) {
		console.log('🌍 [CLIENT] SSR environment detected - no client created');
		return null;
	}

	if (supabaseInstance && isClientInitialized) {
		console.log('♻️ [CLIENT] Returning existing Supabase client instance');
		return supabaseInstance;
	}

	// Import environment variables only in browser context
	if (typeof window !== 'undefined') {
		try {
			// Access Vite's environment variables
			const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
			const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

			if (!supabaseUrl || !supabaseAnonKey) {
				console.error('Missing Supabase environment variables. Please check your .env.local file.');
				return null;
			}

			console.log('🆕 [CLIENT] Creating new Supabase client instance');

			// Check if there's an existing session in localStorage before creating client
			try {
				const existingSession = localStorage.getItem(
					`sb-${supabaseUrl.split('//')[1].split('.')[0]}-auth-token`
				);
				console.log(
					'🔍 [CLIENT] Checking for existing session in localStorage:',
					!!existingSession
				);
			} catch (error) {
				console.log('⚠️ [CLIENT] Could not check localStorage for existing session');
			}

			supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
				auth: {
					// Enable automatic token refresh
					autoRefreshToken: true,
					// Enable persistent sessions
					persistSession: true,
					// Enable URL hash detection for OAuth callbacks
					detectSessionInUrl: true
				}
			});

			return supabaseInstance;
		} catch (error) {
			console.error('Failed to create Supabase client:', error);
			return null;
		}
	}

	return null;
}

// Export the client or null directly (SSR-safe)
export const supabase = getSupabaseClient();
