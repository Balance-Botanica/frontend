import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import { VITE_PUBLIC_SUPABASE_URL, VITE_PUBLIC_SUPABASE_PUBLISHABLE_KEY } from '$env/static/public';

const supabaseUrl = VITE_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = VITE_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
	throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

// Singleton pattern to ensure only one Supabase client instance
let supabaseInstance: SupabaseClient | null = null;

function createSupabaseClient(): SupabaseClient {
	if (supabaseInstance) {
		console.log('🔄 Reusing existing Supabase client instance');
		return supabaseInstance;
	}

	console.log('🆕 Creating new Supabase client instance');
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
}

export const supabase = createSupabaseClient();
