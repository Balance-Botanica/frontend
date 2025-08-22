<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { authStore, isAuthenticated } from '$lib/auth/store';
	import LoginForm from '$lib/components/LoginForm.svelte';

	// Инициализируем auth store
	onMount(() => {
		authStore.initialize();
	});

	// Обработка успешной авторизации
	function handleAuthSuccess(event: CustomEvent) {
		console.log('✅ Авторизация успешна:', event.detail);
		
		// Перенаправляем на главную страницу
		goto('/');
	}

	// Обработка ошибки авторизации
	function handleAuthError(event: CustomEvent) {
		console.error('❌ Ошибка авторизации:', event.detail);
		// Ошибка уже отображается в компоненте формы
	}

	// Если пользователь уже авторизован, перенаправляем
	$: if ($isAuthenticated) {
		goto('/');
	}
</script>

<svelte:head>
	<title>Вход - Balance Botanica</title>
	<meta name="description" content="Войдите в свой аккаунт Balance Botanica для доступа к эксклюзивным CBD продуктам" />
</svelte:head>

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
