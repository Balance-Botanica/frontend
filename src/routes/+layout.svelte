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

	// State for mobile navigation - properly declared with $state
	let isMobileMenuOpen = $state(false);
	let activeTab = $state('home');

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
		
		// Set active tab based on current route
		setActiveTabFromRoute();
	});
	
	// Set active tab based on current route
	function setActiveTabFromRoute() {
		const path = $page.url.pathname;
		if (path === '/') {
			activeTab = 'home';
		} else if (path.includes('/products')) {
			activeTab = 'products';
		} else if (path.includes('/cart')) {
			activeTab = 'cart';
		} else if (path.includes('/account') || path.includes('/login')) {
			activeTab = 'account';
		} else {
			activeTab = 'home';
		}
	}
	
	// Handle tab navigation
	function handleTabNavigation(tab: string) {
		activeTab = tab;
		isMobileMenuOpen = false;
		
		switch (tab) {
			case 'home':
				goto('/');
				break;
			case 'products':
				goto('/products');
				break;
			case 'cart':
				goto('/cart');
				break;
			case 'account':
				goto('/login');
				break;
		}
	}
	
	// Toggle mobile menu
	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
</svelte:head>

<div class="app-container">
	{#if $i18nReady}
		<!-- Desktop Header - Visible on medium screens and up -->
		<div class="hidden md:block">
			<SubHeader />
			<Header />
		</div>
		
		<!-- Mobile Header - Visible only on small screens -->
		<div class="md:hidden">
			<div class="sticky top-0 z-50 bg-white shadow-sm">
				<div class="flex flex-row items-center justify-between p-3">
					<button class="p-2" onclick={toggleMobileMenu} aria-label="Menu">
						<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
						</svg>
					</button>
					<h1 class="text-xl font-bold">Balance Botanica</h1>
					<button class="p-2" onclick={() => goto('/cart')} aria-label="Cart">
						<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8"></path>
						</svg>
					</button>
				</div>
			</div>
			
			<!-- Mobile Menu Overlay -->
			{#if isMobileMenuOpen}
				<div class="fixed inset-0 z-40 bg-black/50" onclick={toggleMobileMenu}></div>
				<div class="fixed left-0 top-0 z-50 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out">
					<div class="p-4 border-b">
						<h2 class="text-xl font-bold">Menu</h2>
						<button class="absolute top-4 right-4 p-2" onclick={toggleMobileMenu} aria-label="Close menu">
							<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
							</svg>
						</button>
					</div>
					<nav class="p-4">
						<ul class="space-y-4">
							<li>
								<button class="w-full text-left py-2 px-4 rounded-lg hover:bg-gray-100" onclick={() => handleTabNavigation('home')}>
									Home
								</button>
							</li>
							<li>
								<button class="w-full text-left py-2 px-4 rounded-lg hover:bg-gray-100" onclick={() => handleTabNavigation('products')}>
									Products
								</button>
							</li>
							<li>
								<button class="w-full text-left py-2 px-4 rounded-lg hover:bg-gray-100" onclick={() => handleTabNavigation('cart')}>
									Cart
								</button>
							</li>
							<li>
								<button class="w-full text-left py-2 px-4 rounded-lg hover:bg-gray-100" onclick={() => handleTabNavigation('account')}>
									Account
								</button>
							</li>
						</ul>
					</nav>
				</div>
			{/if}
		</div>
		
		<main class="flex-1">
			{@render children?.()}
		</main>
		
		{#if showFooter}
			<!-- Desktop Footer - Visible on medium screens and up -->
			<div class="hidden md:block">
				<Footer />
			</div>
		{/if}
		
		<!-- Mobile Bottom Navigation - Visible only on small screens -->
		<div class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex flex-row items-center justify-around p-2 z-50">
			<button 
				class="flex flex-col items-center justify-center p-2 {activeTab === 'home' ? 'text-[#4b766e]' : 'text-gray-500'}"
				onclick={() => handleTabNavigation('home')}
				aria-label="Home"
			>
				<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
				</svg>
				<span class="text-xs mt-1">Home</span>
			</button>
			
			<button 
				class="flex flex-col items-center justify-center p-2 {activeTab === 'products' ? 'text-[#4b766e]' : 'text-gray-500'}"
				onclick={() => handleTabNavigation('products')}
				aria-label="Products"
			>
				<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
				</svg>
				<span class="text-xs mt-1">Products</span>
			</button>
			
			<button 
				class="flex flex-col items-center justify-center p-2 {activeTab === 'cart' ? 'text-[#4b766e]' : 'text-gray-500'}"
				onclick={() => handleTabNavigation('cart')}
				aria-label="Cart"
			>
				<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8"></path>
				</svg>
				<span class="text-xs mt-1">Cart</span>
			</button>
			
			<button 
				class="flex flex-col items-center justify-center p-2 {activeTab === 'account' ? 'text-[#4b766e]' : 'text-gray-500'}"
				onclick={() => handleTabNavigation('account')}
				aria-label="Account"
			>
				<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
				</svg>
				<span class="text-xs mt-1">Account</span>
			</button>
		</div>
		
		<!-- Cookie Consent - now inside i18nReady block for proper translations -->
		<CookieConsent />
		
		<!-- Global Notification Container -->
		<NotificationContainer />
	{/if}
</div>

<style>
	/* Removed the media query for small screens padding */
</style>