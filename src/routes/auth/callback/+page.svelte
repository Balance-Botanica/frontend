<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { supabase } from '$lib/supabase/client';
	import { supabaseAuthStore } from '$lib/auth/supabase-store';

	onMount(async () => {
		console.log('🔄 [OAuth] Client callback page mounted');

		// Проверяем URL на наличие OAuth параметров
		let currentUrl = '';
		page.subscribe(p => {
			currentUrl = p.url.toString();
			console.log('🔍 [OAuth] Current page URL:', currentUrl);
			console.log('🔍 [OAuth] Current page hash:', p.url.hash);
		});

		// Проверяем, есть ли OAuth токены в URL
		const hasOAuthTokens = currentUrl.includes('access_token=') ||
		                      currentUrl.includes('#access_token=') ||
		                      currentUrl.includes('?code=');

		console.log('🔍 [OAuth] OAuth tokens detected in URL:', hasOAuthTokens);

		// Если есть код авторизации, обмениваем его на токены
		if (currentUrl.includes('?code=')) {
			console.log('🔄 [OAuth] Found authorization code, exchanging for tokens...');

			try {
				const urlParams = new URL(currentUrl);
				const code = urlParams.searchParams.get('code');

				if (code) {
					console.log('🔄 [OAuth] Exchanging code for session...');
					const { data, error } = await supabase.auth.exchangeCodeForSession(code);

					if (error) {
						console.error('❌ [OAuth] Code exchange error:', error);
						goto('/login?error=Code exchange failed', { replaceState: true });
						return;
					}

					if (data.session) {
						console.log('✅ [OAuth] Code exchanged successfully');
						// Теперь у нас есть сессия, продолжаем обычную обработку
					} else {
						console.log('⚠️ [OAuth] Code exchange returned no session');
						goto('/login?error=No session after code exchange', { replaceState: true });
						return;
					}
				}
			} catch (error) {
				console.error('❌ [OAuth] Code exchange failed:', error);
				goto('/login?error=Code exchange error', { replaceState: true });
				return;
			}
		}

		if (hasOAuthTokens) {
			console.log('🔄 [OAuth] Processing OAuth tokens from URL...');

			try {
				// Даем Supabase время автоматически обработать токены
				await new Promise(resolve => setTimeout(resolve, 500));

				// Проверяем сессию
				const { data: sessionData } = await supabase.auth.getSession();
				console.log('🔍 [OAuth] Session after token processing:', {
					hasSession: !!sessionData.session,
					userEmail: sessionData.session?.user?.email
				});

				if (sessionData.session) {
					console.log('✅ [OAuth] Session found, initializing auth store...');

					// Также обновляем auth store вручную на всякий случай
					await supabaseAuthStore.initialize();

					// Если auth store не обновился автоматически, попробуем вручную
					setTimeout(async () => {
						const currentState = supabaseAuthStore.subscribe((s) => s)();
						if (!currentState.user || !currentState.session) {
							console.log('🔄 [OAuth] Auth store not updated, trying manual update...');

							// Создаем пользователя из сессии
							const session = sessionData.session;
							if (session?.user) {
								try {
									// Имитируем успешную аутентификацию
									await supabaseAuthStore.handleSuccessfulAuth?.(session);
									console.log('✅ [OAuth] Manual auth store update completed');
								} catch (error) {
									console.error('❌ [OAuth] Manual auth store update failed:', error);
								}
							}
						}
					}, 500);

					// Подписываемся на изменения состояния
					const unsubscribe = supabaseAuthStore.subscribe((state) => {
						console.log('🔍 [OAuth] Auth store state:', {
							isAuthenticated: !!state.user && !!state.session,
							hasUser: !!state.user,
							hasSession: !!state.session,
							userEmail: state.user?.email,
							isLoading: state.isLoading
						});

						if (state.user && state.session && !state.isLoading) {
							console.log('✅ [OAuth] Authentication successful, redirecting to home');
							unsubscribe();
							goto('/', { replaceState: true });
						}
					});

					// Таймаут на случай если состояние не изменится
					setTimeout(() => {
						console.log('⏰ [OAuth] Timeout reached, checking final state...');
						const currentState = supabaseAuthStore.getCurrentState?.() ||
							supabaseAuthStore.subscribe((s) => s)();
						if (currentState?.user && currentState?.session) {
							console.log('✅ [OAuth] Final state is authenticated');
							goto('/', { replaceState: true });
						} else {
							console.log('⚠️ [OAuth] Final state is not authenticated, redirecting to login');
							goto('/login?error=No authentication found', { replaceState: true });
						}
						unsubscribe();
					}, 3000);

				} else {
					console.log('⚠️ [OAuth] No session found after token processing');
					goto('/login?error=No session created', { replaceState: true });
				}

			} catch (error) {
				console.error('❌ [OAuth] Error processing OAuth tokens:', error);
				goto('/login?error=Token processing failed', { replaceState: true });
			}

		} else {
			console.log('⚠️ [OAuth] No OAuth tokens found in URL, redirecting to login');
			goto('/login?error=No OAuth data', { replaceState: true });
		}
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