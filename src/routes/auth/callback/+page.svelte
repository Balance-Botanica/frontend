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
		page.subscribe((p) => {
			currentUrl = p.url.toString();
		});

		// Проверяем, есть ли OAuth токены в URL
		const hasOAuthTokens =
			currentUrl.includes('access_token=') ||
			currentUrl.includes('#access_token=') ||
			currentUrl.includes('?code=');

		console.log('🔍 [OAuth] OAuth tokens detected:', hasOAuthTokens);

		if (hasOAuthTokens) {
			console.log('🔄 [OAuth] Processing OAuth tokens...');

			try {
				// Даем Supabase время автоматически обработать токены
				await new Promise((resolve) => setTimeout(resolve, 1000));

				// Проверяем сессию
				const { data: sessionData } = await supabase.auth.getSession();
				console.log('🔍 [OAuth] Session check result:', {
					hasSession: !!sessionData.session,
					userEmail: sessionData.session?.user?.email
				});

				if (sessionData.session) {
					console.log('✅ [OAuth] Session found, instant redirect to home...');

					// Моментальный редирект
					goto('/', { replaceState: true });
				} else {
					console.log('⚠️ [OAuth] No session found, instant redirect to login...');
					goto('/login?error=No session', { replaceState: true });
				}
			} catch (error) {
				console.error('❌ [OAuth] Error processing OAuth:', error);
				goto('/login?error=Processing error', { replaceState: true });
			}
		} else {
			console.log('⚠️ [OAuth] No OAuth tokens found, instant redirect to login...');
			goto('/login?error=No OAuth data', { replaceState: true });
		}
	});
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50">
	<div class="w-full max-w-md space-y-8">
		<div class="text-center">
			<div class="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-green-600"></div>
			<h2 class="mt-4 text-center text-xl font-semibold text-gray-900">Redirecting...</h2>
			<p class="mt-1 text-center text-xs text-gray-500">Completing authentication</p>
		</div>
	</div>
</div>
