<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { supabaseAuthStore } from '$lib/auth/supabase-store';

	onMount(async () => {
		console.log('🔄 [OAuth] Client callback page mounted');

		// Ждем небольшую задержку чтобы дать Supabase время обработать URL
		setTimeout(async () => {
			try {
				console.log('🔄 [OAuth] Attempting to initialize auth store...');
				await supabaseAuthStore.initialize();

				// Проверяем состояние после инициализации
				const state = supabaseAuthStore.subscribe((s) => {
					console.log('🔍 [OAuth] Auth state after init:', {
						isAuthenticated: !!s.user && !!s.session,
						hasUser: !!s.user,
						hasSession: !!s.session,
						userEmail: s.user?.email,
						isLoading: s.isLoading,
						hasError: !!s.error
					});

					if (s.user && s.session) {
						console.log('✅ [OAuth] User authenticated successfully, redirecting to home');
						goto('/', { replaceState: true });
					} else if (!s.isLoading && !s.error) {
						console.log('⚠️ [OAuth] No authentication found, redirecting to login');
						goto('/login', { replaceState: true });
					}
				});

				// Очищаем подписку через некоторое время
				setTimeout(() => {
					state();
				}, 3000);

			} catch (error) {
				console.error('❌ [OAuth] Error during client callback processing:', error);
				goto('/login?error=Authentication failed', { replaceState: true });
			}
		}, 100);
	});
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50">
	<div class="max-w-md w-full space-y-8">
		<div class="text-center">
			<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
			<h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
				Completing sign in...
			</h2>
			<p class="mt-2 text-center text-sm text-gray-600">
				Please wait while we finish setting up your account.
			</p>
		</div>
	</div>
</div>