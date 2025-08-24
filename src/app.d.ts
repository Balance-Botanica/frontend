// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user: import('$lib/server/auth').SessionValidationResult['user'];
			session: import('$lib/server/auth').SessionValidationResult['session'];
		}
		// interface Error {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

// Declare environment variables for TypeScript
declare module '$env/static/public' {
	export const VITE_PUBLIC_SUPABASE_URL: string;
	export const VITE_PUBLIC_SUPABASE_ANON_KEY: string;
}
export {};
