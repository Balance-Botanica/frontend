<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { supabaseAuthStore, isAuthenticated } from '$lib/auth/supabase-store';
	import LoginForm from '$lib/components/LoginForm.svelte';
	import { createPageTranslations } from '$lib/i18n/store';
	import SEO from '$lib/components/SEO.svelte';

	// Create page translations
	const pageTranslations = createPageTranslations();

	// Initialize auth store
	onMount(() => {
		supabaseAuthStore.initialize();
	});

	// Handle successful authentication
	function handleAuthSuccess(event: CustomEvent) {
		console.log('✅ Authentication successful:', event.detail);
		
		// Redirect to homepage
		goto('/');
	}

	// Handle authentication error
	function handleAuthError(event: CustomEvent) {
		console.error('❌ Authentication error:', event.detail);
		// Error is already displayed in the form component
	}

	// If user is already authenticated, redirect
	$: if ($isAuthenticated) {
		goto('/');
	}
</script>

{#if $pageTranslations}
<SEO
	title={$pageTranslations.t('login.meta.title')}
	description={$pageTranslations.t('login.meta.description')}
	locale={$pageTranslations.locale}
/>

<!-- Main Content -->
<main class="login-page">
	<div class="login-container">
		<LoginForm 
			on:success={handleAuthSuccess}
			on:error={handleAuthError}
		/>
	</div>
</main>

<style>
	.login-page {
		min-height: 100vh;
		background: #F8F7F6;
		padding: 40px 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.login-container {
		width: 100%;
		max-width: 540px;
	}


</style>
