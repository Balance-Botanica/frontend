import PocketBase from 'pocketbase';
import { env } from '$env/dynamic/private';

// PocketBase client configuration (server-side only — never ships secrets to the browser)
function getPbUrl(): string {
	return env.POCKETBASE_URL || 'http://127.0.0.1:8090';
}

export const pb = new PocketBase(getPbUrl());

// Admin credentials come from .env via SvelteKit private env (never hardcoded)
const ADMIN_EMAIL = env.POCKETBASE_ADMIN_EMAIL || 'balancebotanicaukraine@gmail.com';

// Flag to track if we're already authenticated
let isAuthenticated = false;

// Authenticate as admin
export async function authenticateAsAdmin() {
	// Skip if already authenticated
	if (isAuthenticated) {
		return true;
	}

	const adminPassword = env.POCKETBASE_ADMIN_PASSWORD;
	if (!adminPassword) {
		throw new Error('POCKETBASE_ADMIN_PASSWORD is not set (see .env)');
	}

	try {
		console.log('[PocketBase] Authenticating as admin...');
		await pb.collection('_superusers').authWithPassword(ADMIN_EMAIL, adminPassword);
		isAuthenticated = true;
		console.log('[PocketBase] Admin authentication successful');
		return true;
	} catch (error: any) {
		console.error('[PocketBase] Admin authentication failed:', error.message);
		return false;
	}
}

// Helper function to get authenticated client
export async function getAuthenticatedClient() {
	await authenticateAsAdmin();
	return pb;
}

// Helper function to clear auth
export function clearAuth() {
	pb.authStore.clear();
	isAuthenticated = false;
}
