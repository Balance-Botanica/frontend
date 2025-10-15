import PocketBase from 'pocketbase/cjs';

const pb = new PocketBase('http://127.0.0.1:8090');

async function checkOAuth() {
	try {
		console.log('🔍 Checking OAuth providers in PocketBase...');

		// Try to authenticate as admin
		await pb.admins.authWithPassword('balancebotanicaukraine@gmail.com', 'diaochan1994qQq');
		console.log('✅ Admin authenticated successfully');

		// Try to get settings via direct request
		const settingsResponse = await fetch('http://127.0.0.1:8090/api/settings', {
			headers: {
				Authorization: pb.authStore.token ? `Bearer ${pb.authStore.token}` : ''
			}
		});

		if (settingsResponse.ok) {
			const settings = await settingsResponse.json();
			console.log('🔧 Current OAuth providers:', settings.authProviders || 'None configured');

			if (settings.authProviders && settings.authProviders.length > 0) {
				console.log('📋 Configured providers:');
				settings.authProviders.forEach((provider) => {
					console.log(`  - ${provider.name}: ${provider.enabled ? '✅ Enabled' : '❌ Disabled'}`);
					if (provider.enabled) {
						console.log(`    Client ID: ${provider.clientId ? 'Set' : 'Not set'}`);
						console.log(`    Client Secret: ${provider.clientSecret ? 'Set' : 'Not set'}`);
					}
				});
			} else {
				console.log('⚠️ No OAuth providers configured');
				console.log('💡 You need to configure OAuth providers in PocketBase admin panel:');
				console.log('   1. Open http://127.0.0.1:8090/_/');
				console.log('   2. Go to Settings → Auth Providers');
				console.log('   3. Enable Google OAuth and add your credentials');
			}
		} else {
			console.log('❌ Failed to get settings:', settingsResponse.status);
		}
	} catch (error) {
		console.error('❌ Error checking OAuth:', error.message);
	}
}

checkOAuth();
