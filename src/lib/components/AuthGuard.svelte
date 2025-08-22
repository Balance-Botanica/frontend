<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authStore, isAuthenticated, isLoading } from '$lib/auth/store';

	export let redirectTo = '/login';
	export let fallback: any = null;

	onMount(() => {
		authStore.initialize();
	});

	// Если пользователь не авторизован и загрузка завершена, перенаправляем
	$: if (!$isLoading && !$isAuthenticated) {
		goto(redirectTo);
	}
</script>

{#if $isLoading}
	<!-- Показываем загрузку -->
	<div class="auth-loading">
		<div class="loading-spinner"></div>
		<p>Checking authentication...</p>
	</div>
{:else if $isAuthenticated}
	<!-- Показываем защищенный контент -->
	<slot />
{:else if fallback}
	<!-- Показываем fallback контент -->
	{@html fallback}
{/if}

<style>
	.auth-loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		min-height: 200px;
	}

	.loading-spinner {
		width: 32px;
		height: 32px;
		border: 3px solid #e5e7eb;
		border-top: 3px solid #10b981;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin-bottom: 1rem;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	p {
		color: #6b7280;
		font-size: 0.875rem;
		margin: 0;
	}
</style>
