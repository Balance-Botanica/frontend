<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { supabase } from '$lib/supabase/client';
	import { supabaseAuthStore } from '$lib/auth/supabase-store';

	let redirectTimer;

	onMount(async () => {
		console.log('🔄 [OAuth] Client callback page mounted');

		// Проверяем URL на наличие OAuth параметров
		let currentUrl = '';
		page.subscribe(p => {
			currentUrl = p.url.toString();
		});

		// Проверяем, есть ли OAuth токены в URL
		const hasOAuthTokens = currentUrl.includes('access_token=') ||
		                      currentUrl.includes('#access_token=') ||
		                      currentUrl.includes('?code=');

		console.log('🔍 [OAuth] OAuth tokens detected:', hasOAuthTokens);

		if (hasOAuthTokens) {
			console.log('🔄 [OAuth] Processing OAuth tokens...');

			try {
				// Даем Supabase время автоматически обработать токены
				await new Promise(resolve => setTimeout(resolve, 1000));

				// Проверяем сессию
				const { data: sessionData } = await supabase.auth.getSession();
				console.log('🔍 [OAuth] Session check result:', {
					hasSession: !!sessionData.session,
					userEmail: sessionData.session?.user?.email
				});

				if (sessionData.session) {
					console.log('✅ [OAuth] Session found, redirecting to home in 2 seconds...');

					// Показываем сообщение пользователю
					setTimeout(() => {
						console.log('🚀 [OAuth] Redirecting to home page...');
						goto('/', { replaceState: true });
					}, 2000);

				} else {
					console.log('⚠️ [OAuth] No session found, redirecting to login...');
					setTimeout(() => {
						goto('/login?error=No session', { replaceState: true });
					}, 2000);
				}

			} catch (error) {
				console.error('❌ [OAuth] Error processing OAuth:', error);
				setTimeout(() => {
					goto('/login?error=Processing error', { replaceState: true });
				}, 2000);
			}

		} else {
			console.log('⚠️ [OAuth] No OAuth tokens found, redirecting to login...');
			setTimeout(() => {
				goto('/login?error=No OAuth data', { replaceState: true });
			}, 2000);
		}
	});
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50">
	<div class="max-w-md w-full space-y-8">
		<div class="text-center">
			<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
			<h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
				Authentication Successful!
			</h2>
			<p class="mt-2 text-center text-sm text-gray-600">
				Redirecting you to the home page...
			</p>
			<div class="mt-4 text-center">
				<p class="text-xs text-gray-500">
					If you are not redirected automatically, <a href="/" class="text-blue-600 hover:text-blue-500">click here</a>
				</p>
			</div>
		</div>
	</div>
</div>