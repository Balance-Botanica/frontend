import PocketBase from 'pocketbase/cjs';

const pb = new PocketBase('http://127.0.0.1:8090');

async function testGoogleOAuth() {
	try {
		console.log('🔍 Testing Google OAuth configuration...');

		// Authenticate as admin first
		await pb.admins.authWithPassword('balancebotanicaukraine@gmail.com', 'diaochan1994qQq');
		console.log('✅ Admin authenticated');

		// Try to get OAuth providers from different endpoints
		console.log('1. Checking /api/settings...');
		const settingsResponse = await fetch('http://127.0.0.1:8090/api/settings', {
			headers: {
				Authorization: `Bearer ${pb.authStore.token}`
			}
		});
		if (settingsResponse.ok) {
			const settings = await settingsResponse.json();
			console.log('   Auth providers in settings:', settings.authProviders || 'None');
		} else {
			console.log('   Failed to get settings:', settingsResponse.status);
		}

		console.log('2. Checking /api/collections/_authProviders...');
		const collectionsResponse = await fetch('http://127.0.0.1:8090/api/collections');
		if (collectionsResponse.ok) {
			const collections = await collectionsResponse.json();
			const authProviders = collections.items?.find((c) => c.name === '_authProviders');
			if (authProviders) {
				console.log('   Found _authProviders collection');
				// Try to get records
				const recordsResponse = await fetch(
					'http://127.0.0.1:8090/api/collections/_authProviders/records'
				);
				if (recordsResponse.ok) {
					const records = await recordsResponse.json();
					console.log('   Auth provider records:', records.items || []);
				}
			} else {
				console.log('   No _authProviders collection found');
			}
		}

		console.log('3. Checking /api/auth-methods...');
		const authMethodsResponse = await fetch('http://127.0.0.1:8090/api/auth-methods');
		if (authMethodsResponse.ok) {
			const authMethods = await authMethodsResponse.json();
			console.log('   Auth methods:', authMethods);
		} else {
			console.log('   No auth-methods endpoint');
		}

		// Try to initiate Google OAuth flow
		console.log('4. Testing OAuth URL generation...');
		try {
			const authUrl = pb.collection('users').authWithOAuth2.getProviderUrl('google');
			console.log('   Google OAuth URL would be:', authUrl);
		} catch (e) {
			console.log('   Failed to get OAuth URL:', e.message);
		}
	} catch (error) {
		console.error('❌ Error testing Google OAuth:', error.message);
	}
}

testGoogleOAuth();
