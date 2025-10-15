import PocketBase from 'pocketbase/cjs';

const pb = new PocketBase('http://127.0.0.1:8090');

async function setupGoogleOAuth() {
	try {
		console.log('🔧 Setting up Google OAuth in PocketBase...');

		// Authenticate as admin
		await pb.admins.authWithPassword('balancebotanicaukraine@gmail.com', 'diaochan1994qQq');
		console.log('✅ Admin authenticated successfully');

		// Get current settings
		const settingsResponse = await fetch('http://127.0.0.1:8090/api/settings', {
			headers: {
				Authorization: `Bearer ${pb.authStore.token}`
			}
		});

		if (!settingsResponse.ok) {
			throw new Error(`Failed to get settings: ${settingsResponse.status}`);
		}

		const currentSettings = await settingsResponse.json();
		console.log('📋 Current auth providers:', currentSettings.authProviders || []);

		// Configure Google OAuth - try different formats
		const googleProvider1 = {
			name: 'google',
			enabled: true,
			clientId: process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
			clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'YOUR_GOOGLE_CLIENT_SECRET',
			displayName: 'Google',
			codeChallengeMethod: 'S256'
		};

		// Alternative format
		const googleProvider2 = {
			name: 'google',
			enabled: true,
			clientId: process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
			clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'YOUR_GOOGLE_CLIENT_SECRET',
			authUrl: 'https://accounts.google.com/o/oauth2/auth',
			tokenUrl: 'https://oauth2.googleapis.com/token',
			displayName: 'Google'
		};

		// Try different approaches to configure OAuth

		// Approach 1: Update settings with authProviders
		console.log('📡 Trying approach 1: Update settings with authProviders...');
		const updatedProviders = [...(currentSettings.authProviders || []), googleProvider1];

		let updateResponse = await fetch('http://127.0.0.1:8090/api/settings', {
			method: 'PATCH',
			headers: {
				Authorization: `Bearer ${pb.authStore.token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				authProviders: updatedProviders
			})
		});

		if (!updateResponse.ok) {
			console.log('❌ Approach 1 failed, trying approach 2...');

			// Approach 2: Try direct OAuth provider creation
			console.log('📡 Trying approach 2: Direct OAuth provider creation...');
			updateResponse = await fetch('http://127.0.0.1:8090/api/collections/_authProviders/records', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${pb.authStore.token}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(googleProvider1)
			});
		}

		if (!updateResponse.ok) {
			console.log('❌ Approach 2 failed, trying approach 3...');

			// Approach 3: Try creating auth provider collection if it doesn't exist
			console.log('📡 Trying approach 3: Create auth provider collection...');
			const collectionData = {
				name: '_authProviders',
				type: 'base',
				fields: [
					{ name: 'name', type: 'text', required: true },
					{ name: 'enabled', type: 'bool', required: true },
					{ name: 'clientId', type: 'text', required: true },
					{ name: 'clientSecret', type: 'text', required: true },
					{ name: 'displayName', type: 'text', required: true },
					{ name: 'codeChallengeMethod', type: 'text' }
				]
			};

			const collectionResponse = await fetch('http://127.0.0.1:8090/api/collections', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${pb.authStore.token}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(collectionData)
			});

			if (collectionResponse.ok) {
				console.log('✅ Created _authProviders collection');
				// Now try to add the Google provider
				updateResponse = await fetch(
					'http://127.0.0.1:8090/api/collections/_authProviders/records',
					{
						method: 'POST',
						headers: {
							Authorization: `Bearer ${pb.authStore.token}`,
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(googleProvider1)
					}
				);
			}
		}

		if (updateResponse.ok) {
			console.log('✅ Google OAuth configured successfully!');
			console.log('🔑 You need to set these environment variables:');
			console.log('   GOOGLE_CLIENT_ID=your_google_client_id');
			console.log('   GOOGLE_CLIENT_SECRET=your_google_client_secret');
			console.log('   VITE_PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090');
		} else {
			const error = await updateResponse.json();
			console.log('❌ Failed to configure Google OAuth:', error);
		}
	} catch (error) {
		console.error('❌ Error setting up Google OAuth:', error.message);
	}
}

setupGoogleOAuth();
