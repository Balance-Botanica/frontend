import PocketBase from 'pocketbase';

// PocketBase client configuration
export const pb = new PocketBase(process.env.POCKETBASE_URL || 'http://127.0.0.1:8090');

// Admin credentials (should be set in environment variables for security)
const ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL || 'balancebotanicaukraine@gmail.com';
const ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD || 'diaochan1994qQq';

// Flag to track if we're already authenticated
let isAuthenticated = false;

// Authenticate as admin
export async function authenticateAsAdmin() {
	// Skip if already authenticated
	if (isAuthenticated) {
		return true;
	}

	try {
		console.log('[PocketBase] Authenticating as admin...');
		await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
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
