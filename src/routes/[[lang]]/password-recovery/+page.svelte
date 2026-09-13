<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { createEventDispatcher } from 'svelte';

	// Detect language from optional route parameter
	const lang = $derived($page.params?.lang || 'uk-ua');

	let email = '';
	let isLoading = false;
	let isSuccess = false;
	let error = '';

	const dispatch = createEventDispatcher();

	async function handleSubmit() {
		if (!email) {
			error = 'Введите email адрес';
			return;
		}

		if (!isValidEmail(email)) {
			error = 'Введите корректный email адрес';
			return;
		}

		isLoading = true;
		error = '';

		try {
			// Real reset email via Firebase Auth (identity lives in Firebase, not PB)
			const { sendPasswordReset } = await import('$lib/firebase/auth');
			await sendPasswordReset(email);
			isSuccess = true;

			// Автоматически перенаправляем через 3 секунды
			setTimeout(() => {
				goto('/login');
			}, 3000);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Ошибка отправки email';
		} finally {
			isLoading = false;
		}
	}

	function isValidEmail(email: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	function handleBackToLogin() {
		goto('/login');
	}
</script>

<svelte:head>
	<title>Відновлення паролю - Balance Botanica</title>
	<meta
		name="description"
		content="Відновіть пароль для доступу до свого аккаунту Balance Botanica"
	/>
</svelte:head>

<main class="recovery-page">
	<div class="recovery-container">
		{#if isSuccess}
			<!-- Success State -->
			<div class="recovery-form-container success">
				<div class="form-header">
					<h1 class="form-title">✅ Email надіслано</h1>
				</div>

				<div class="success-content">
					<p class="success-text">Ми надіслали інструкції для відновлення паролю на адресу:</p>
					<p class="success-email">{email}</p>
					<p class="success-hint">
						Перевірте свою пошту та перейдіть за посиланням для створення нового паролю.
					</p>
					<p class="success-redirect">Автоматичне перенаправлення через 3 секунди...</p>
				</div>

				<button type="button" class="back-button" on:click={handleBackToLogin}>
					Повернутися до входу
				</button>
			</div>
		{:else}
			<!-- Recovery Form -->
			<div class="recovery-form-container">
				<div class="form-header">
					<h1 class="form-title">Відновлення паролю</h1>
					<p class="form-subtitle">
						Введіть свій email адрес і ми надішлемо інструкції для відновлення паролю
					</p>
				</div>

				<form class="recovery-form" on:submit|preventDefault={handleSubmit}>
					<div class="form-group">
						<label for="email" class="form-label">Електронна пошта</label>
						<input
							id="email"
							type="email"
							class="form-input"
							placeholder="email@example.com"
							bind:value={email}
							disabled={isLoading}
							required
						/>
					</div>

					{#if error}
						<div class="error-message">
							❌ {error}
						</div>
					{/if}

					<button type="submit" class="submit-button" disabled={isLoading || !email}>
						{#if isLoading}
							<span class="loading-spinner"></span>
							Надсилаємо...
						{:else}
							Надіслати посилання
						{/if}
					</button>

					<div class="back-to-login">
						<p class="back-text">
							Згадали пароль?
							<button type="button" class="back-link" on:click={handleBackToLogin}> Увійти </button>
						</p>
					</div>
				</form>
			</div>
		{/if}
	</div>
</main>

<style>
	.recovery-page {
		min-height: 100vh;
		background: #f8f7f6;
		padding: 40px 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.recovery-container {
		width: 100%;
		max-width: 540px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	/* Form Container */
	.recovery-form-container {
		width: 540px;
		min-height: 500px;
		padding: 40px;
		background: #ffffff;
		border-radius: 20px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 40px;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
	}

	.recovery-form-container.success {
		min-height: 400px;
		text-align: center;
	}

	/* Form Header */
	.form-header {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 16px;
		width: 100%;
	}

	.form-title {
		font-family: 'Nunito', sans-serif;
		font-weight: 600;
		font-size: 36px;
		line-height: 140%;
		color: #222222;
		text-align: center;
		margin: 0;
	}

	.form-subtitle {
		font-family: 'Nunito', sans-serif;
		font-weight: 400;
		font-size: 16px;
		line-height: 140%;
		color: #666666;
		text-align: center;
		max-width: 400px;
		margin: 0;
	}

	/* Form */
	.recovery-form {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 24px;
		width: 100%;
		max-width: 460px;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 8px;
		width: 100%;
	}

	.form-label {
		font-family: 'Nunito', sans-serif;
		font-weight: 400;
		font-size: 16px;
		line-height: 140%;
		color: #000000;
	}

	.form-input {
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 12px 16px;
		width: 100%;
		height: 44px;
		border: 1px solid #9a9a9a;
		border-radius: 10px;
		font-family: 'Nunito', sans-serif;
		font-weight: 400;
		font-size: 14px;
		line-height: 140%;
		color: #222222;
		background: white;
	}

	.form-input:focus {
		outline: none;
		border-color: var(--color-main);
	}

	.form-input:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	/* Submit Button */
	.submit-button {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding: 16px 24px;
		gap: 8px;
		width: 100%;
		height: 46px;
		background: var(--color-main);
		border: none;
		border-radius: 12px;
		font-family: 'Nunito', sans-serif;
		font-weight: 500;
		font-size: 16px;
		line-height: 140%;
		color: #ffffff;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.submit-button:hover:not(:disabled) {
		background: #3a5d56;
		transform: translateY(-1px);
	}

	.submit-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		transform: none;
	}

	/* Loading Spinner */
	.loading-spinner {
		width: 16px;
		height: 16px;
		border: 2px solid transparent;
		border-top: 2px solid white;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	/* Error Message */
	.error-message {
		background: #fee;
		color: #c33;
		padding: 12px;
		border-radius: 8px;
		font-family: 'Nunito', sans-serif;
		font-size: 14px;
		width: 100%;
		text-align: center;
		border: 1px solid #fcc;
	}

	/* Success Content */
	.success-content {
		display: flex;
		flex-direction: column;
		gap: 16px;
		text-align: center;
	}

	.success-text {
		font-family: 'Nunito', sans-serif;
		font-size: 16px;
		color: #666666;
		margin: 0;
	}

	.success-email {
		font-family: 'Nunito', sans-serif;
		font-size: 18px;
		font-weight: 600;
		color: var(--color-main);
		margin: 0;
	}

	.success-hint {
		font-family: 'Nunito', sans-serif;
		font-size: 14px;
		color: #888888;
		margin: 0;
	}

	.success-redirect {
		font-family: 'Nunito', sans-serif;
		font-size: 12px;
		color: #999999;
		font-style: italic;
		margin: 0;
	}

	/* Back to Login */
	.back-to-login {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
	}

	.back-text {
		font-family: 'Nunito', sans-serif;
		font-size: 16px;
		line-height: 140%;
		color: #474747;
		margin: 0;
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.back-link {
		background: none;
		border: none;
		color: var(--color-main);
		font-family: 'Nunito', sans-serif;
		font-size: 16px;
		line-height: 140%;
		cursor: pointer;
		text-decoration: underline;
		transition: color 0.2s ease;
	}

	.back-link:hover {
		color: #3a5d56;
	}

	.back-button {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding: 12px 24px;
		background: transparent;
		border: 1px solid var(--color-main);
		border-radius: 12px;
		font-family: 'Nunito', sans-serif;
		font-weight: 500;
		font-size: 16px;
		color: var(--color-main);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.back-button:hover {
		background: var(--color-main);
		color: white;
	}

	/* Responsive */
	@media (max-width: 600px) {
		.recovery-container {
			max-width: 90%;
		}

		.recovery-form-container {
			width: 100%;
			padding: 30px 20px;
		}

		.form-title {
			font-size: 28px;
		}
	}
</style>
