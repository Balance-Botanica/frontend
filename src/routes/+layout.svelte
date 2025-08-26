<script lang="ts">
	// IMMEDIATE LOG - shows on every page refresh
	console.log('🔥 [LAYOUT] Layout script executed!', new Date().toISOString());
	
	// Environment check
	const isBrowser = typeof window !== 'undefined';
	console.log('🌍 [LAYOUT] Environment check:', {
		browser: isBrowser,
		location: isBrowser ? window.location.href : 'SSR',
		userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Node.js/24'
	});
	
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { i18nReady, initializeI18n } from '$lib/i18n/store';
	import Header from '$lib/components/Header.svelte';
	import SubHeader from '$lib/components/SubHeader.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import CookieConsent from '$lib/components/CookieConsent.svelte';
	import NotificationContainer from '$lib/components/NotificationContainer.svelte';
	import { supabaseAuthStore, user, isAuthenticated, isLoading } from '$lib/auth/supabase-store';

	const { children } = $props();

	const excludeFooterRoutes = ['/design-system', '/components'];
	const showFooter = $derived(!excludeFooterRoutes.includes($page.url.pathname));
	const isHome = $derived($page.url.pathname === '/');

	// Subscribe to auth store changes for comprehensive logging
	let authStateLog: string = 'Not initialized';
	let lastLoggedState: string = '';

	// Log auth store state on every change using $effect for Svelte 5
	$effect(() => {
		authStateLog = `Auth State: ${JSON.stringify({
			isAuthenticated: $isAuthenticated,
			isLoading: $isLoading,
			userEmail: $user?.email || null,
			userName: $user?.name || null,
			avatarUrl: $user?.avatarUrl || null,
			sessionExists: !!$supabaseAuthStore.session,
			error: $supabaseAuthStore.error || null
		}, null, 2)}`;
		
		// Only log if state actually changed to avoid spam
		if (authStateLog !== lastLoggedState) {
			console.log('🔍 [LAYOUT] Auth Store State Update:', {
				isAuthenticated: $isAuthenticated,
				isLoading: $isLoading,
				userEmail: $user?.email || null,
				userName: $user?.name || null,
				avatarUrl: $user?.avatarUrl || null,
				sessionExists: !!$supabaseAuthStore.session,
				sessionAccessToken: $supabaseAuthStore.session?.access_token ? 'Present' : 'Missing',
				error: $supabaseAuthStore.error || null,
				timestamp: new Date().toISOString()
			});
			lastLoggedState = authStateLog;
		}
	});

	// Initialize i18n and auth on mount - THIS SHOULD ALWAYS RUN IN BROWSER
	onMount(async () => {
		console.log('🚀 [LAYOUT] ✅ ON_MOUNT EXECUTING - WE ARE IN BROWSER!');
		console.log('🔄 [LAYOUT] Page refresh/navigation detected - checking auth state...');
		
		// Add explicit browser verification
		if (typeof window === 'undefined') {
			console.error('❌ [LAYOUT] CRITICAL: onMount running without window object!');
			return;
		}
		
		console.log('🎯 [LAYOUT] 🆔 BROWSER VERIFICATION PASSED!');
		console.log('📍 [LAYOUT] Window location:', window.location.href);
		console.log('🕐 [LAYOUT] Browser time:', new Date().toISOString());
		
		// IMMEDIATE AUTH CHECK ON PAGE REFRESH
		console.log('🎯 [LAYOUT] 🔍 IMMEDIATE AUTH STATE CHECK:', {
			isAuthenticated: $isAuthenticated,
			userEmail: $user?.email || null,
			userName: $user?.name || null,
			sessionExists: !!$supabaseAuthStore.session,
			error: $supabaseAuthStore.error || null,
			timestamp: new Date().toISOString(),
			pageUrl: window.location.href
		});
		
		try {
			// Auth store is already initialized by singleton pattern - no waiting needed
			console.log('🔍 [LAYOUT] Auth store initialized by singleton - proceeding immediately');
			
			console.log('🌍 [LAYOUT] Initializing i18n with Ukrainian locale...');
			await initializeI18n('uk-ua'); // Start with Ukrainian as default
			
			console.log('✅ [LAYOUT] App initialization completed successfully');
		} catch (error) {
			console.error('❌ [LAYOUT] Failed to initialize:', error);
			// Log auth state even on error
			console.log('🔍 [LAYOUT] Auth Store State (on error):', {
				isAuthenticated: $isAuthenticated,
				isLoading: $isLoading,
				userEmail: $user?.email || null,
				sessionExists: !!$supabaseAuthStore.session,
				error: $supabaseAuthStore.error || null,
				initError: error instanceof Error ? error.message : String(error)
			});
		}
		
		// IMMEDIATE FINAL AUTH CHECK - no delays
		console.log('🎯 [LAYOUT] 🔥 IMMEDIATE FINAL AUTH CHECK:', {
			isAuthenticated: $isAuthenticated,
			userEmail: $user?.email || null,
			userName: $user?.name || null,
			sessionExists: !!$supabaseAuthStore.session,
			sessionAccessToken: $supabaseAuthStore.session?.access_token ? 'Present' : 'Missing',
			error: $supabaseAuthStore.error || null,
			timestamp: new Date().toISOString()
		});

		// Add a success message if user is authenticated (immediate check)
		if ($isAuthenticated && $user?.email) {
			console.log('🎉 [LAYOUT] ✅ SESSION PERSISTENCE WORKING! User is logged in:', {
				userEmail: $user.email,
				userName: $user.name || null,
				avatarUrl: $user.avatarUrl || null,
				timestamp: new Date().toISOString()
			});
		} else {
			console.log('⚠️ [LAYOUT] User not authenticated at mount - auth may complete asynchronously');
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex min-h-screen flex-col">
	{#if $i18nReady}
		<SubHeader />
		<Header />
		<main class="flex-grow">
			{@render children?.()}
		</main>
		{#if showFooter}
			<Footer />
		{/if}
		
		<!-- Cookie Consent - now inside i18nReady block for proper translations -->
		<CookieConsent />
		
		<!-- Global Notification Container -->
		<NotificationContainer />
	{/if}
</div>

<style>
	/* Removed the media query for small screens padding */
</style>