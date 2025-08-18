import PocketBase from 'pocketbase';

// PocketBase client configuration
export const pb = new PocketBase(process.env.POCKETBASE_URL || 'http://127.0.0.1:8090');

// Export types for better TypeScript support
export type { Record, Admin, User } from 'pocketbase';

// Helper function to get authenticated client
export function getAuthenticatedClient(authToken?: string) {
	if (authToken) {
		pb.authStore.save(authToken, null);
	}
	return pb;
}

// Helper function to clear auth
export function clearAuth() {
	pb.authStore.clear();
}
