<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { supabaseAuthStore } from '$lib/auth/supabase-store';
	import type { OAuthProvider } from '$lib/auth/types';

	const dispatch = createEventDispatcher<{
		success: { user: any; session: any };
		error: string;
	}>();

	// Form state
	let email = '';
	let password = '';
	let name = '';
	let isSignUp = false;
	let isLoading = false;
	let errorMessage = '';
	let showPassword = false;

	// Toggle password visibility
	function togglePasswordVisibility() {
		showPassword = !showPassword;
	}

	// OAuth providers - including both Google and Facebook
	const oauthProviders: OAuthProvider[] = [
		{
			name: 'google',
			icon: '/src/lib/assets/icons/g.svg',
			label: 'Увійти за допомогою Google'
		},
		{
			name: 'facebook',
			icon: '/src/lib/assets/icons/f.svg',
			label: 'Увійти за допомогою Facebook'
		}
	];

	// Handle OAuth login
	async function handleOAuthSignIn(provider: 'google' | 'facebook') {
		try {
			isLoading = true;
			errorMessage = '';

			if (provider === 'google') {
				// Google OAuth will redirect, so we don't get a result here
				await supabaseAuthStore.signInWithGoogle();
				// The success will be handled by the auth state change listener
			} else if (provider === 'facebook') {
				// Facebook OAuth will redirect, so we don't get a result here
				await supabaseAuthStore.signInWithFacebook();
				// The success will be handled by the auth state change listener
			} else {
				errorMessage = `${provider} authentication not supported yet`;
			}
		} catch (error) {
			errorMessage = error instanceof Error ? error.message : `Failed to sign in with ${provider}`;
			dispatch('error', errorMessage);
		} finally {
			isLoading = false;
		}
	}

	// Handle email/password authentication
	async function handleEmailSignIn() {
		if (!email || !password) {
			errorMessage = 'Please fill in all required fields';
			return;
		}

		if (isSignUp && !name) {
			errorMessage = 'Please enter your full name';
			return;
		}

		try {
			isLoading = true;
			errorMessage = '';

			let result;
			if (isSignUp) {
				// For sign up, we use the same signInWithEmail function
				// Supabase will automatically create account if it doesn't exist
				result = await supabaseAuthStore.signInWithEmail({ email, password });
			} else {
				result = await supabaseAuthStore.signInWithEmail({ email, password });
			}

			if (result.user) {
				// Create session token for server-side authentication
				await createSessionToken(result.user.id);
				dispatch('success', result);
			}
		} catch (error) {
			errorMessage = error instanceof Error ? error.message : 'Authentication failed';
			dispatch('error', errorMessage);
		} finally {
			isLoading = false;
		}
	}

	// Create session token for server-side authentication
	async function createSessionToken(userId: string) {
		try {
			const response = await fetch('/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ userId, email })
			});

			const data = await response.json();
			if (!data.success) {
				console.error('Failed to create session token:', data.error);
			}
		} catch (error) {
			console.error('Error creating session token:', error);
		}
	}

	// Toggle between sign in and sign up
	function toggleMode() {
		isSignUp = !isSignUp;
		errorMessage = '';
		email = '';
		password = '';
		name = '';
	}

	// Clear error when fields change
	$: if (email || password || name) {
		errorMessage = '';
	}

	// Listen to auth state changes
	$: {
		const unsubscribe = supabaseAuthStore.subscribe((state) => {
			if (state.user && state.session) {
				// Create session token for server-side authentication
				createSessionToken(state.user.id);
				dispatch('success', { user: state.user, session: state.session });
			}
			if (state.error) {
				errorMessage = state.error;
				dispatch('error', state.error);
			}
			isLoading = state.isLoading;
		});
	}
</script>

<div class="login-form-container">
	<!-- Заголовок -->
	<div class="form-header">
		<h2 class="form-title">
			{isSignUp ? 'Реєстрація' : 'Вхід'}
		</h2>
	</div>

	<!-- OAuth кнопки -->
	<div class="oauth-section">
		{#each oauthProviders as provider}
			<button
				class="oauth-button"
				class:google={provider.name === 'google'}
				class:facebook={provider.name === 'facebook'}
				on:click={() => handleOAuthSignIn(provider.name)}
				disabled={isLoading}
				aria-label="{provider.label}"
			>
				<img src={provider.icon} alt="{provider.name} icon" class="oauth-icon" />
				<span class="oauth-label">{provider.label}</span>
			</button>
		{/each}
	</div>

	<!-- Разделитель -->
	<div class="divider">
		<div class="divider-line"></div>
		<span class="divider-text">або</span>
		<div class="divider-line"></div>
	</div>

	<!-- Email/Password форма -->
	<form class="email-form" on:submit|preventDefault={handleEmailSignIn}>
		{#if isSignUp}
			<div class="form-group">
				<label for="name" class="form-label">Full Name</label>
				<input
					id="name"
					type="text"
					bind:value={name}
					class="form-input"
					placeholder="Enter your full name"
					required={isSignUp}
					disabled={isLoading}
				/>
			</div>
		{/if}

		<div class="form-group">
			<label for="email" class="form-label">Електронна пошта</label>
			<input
				id="email"
				type="email"
				bind:value={email}
				class="form-input"
				placeholder="email@example.com"
				required
				disabled={isLoading}
			/>
		</div>

		<div class="form-group">
			<label for="password" class="form-label">Пароль</label>
			<div class="password-input-container">
				<input
					id="password"
					type={showPassword ? 'text' : 'password'}
					bind:value={password}
					class="form-input password-input"
					placeholder="23SDSDS3dsj"
					required
					disabled={isLoading}
				/>
				<button
					type="button"
					class="password-toggle"
					on:click={togglePasswordVisibility}
					disabled={isLoading}
					aria-label={showPassword ? 'Сховати пароль' : 'Показати пароль'}
				>
					{#if showPassword}
						<!-- Eye closed icon -->
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
							<path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
							<path d="M3 3l18 18" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					{:else}
						<!-- Eye open icon -->
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
							<path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					{/if}
				</button>
			</div>
		</div>

		<!-- Забыли пароль (только для входа) -->
		{#if !isSignUp}
			<div class="forgot-password">
				<a href="/password-recovery" class="forgot-link">
					Забули пароль?
				</a>
			</div>
		{/if}

		<!-- Ошибка -->
		{#if errorMessage}
			<div class="error-message" role="alert">
				{errorMessage}
			</div>
		{/if}

		<!-- Кнопка отправки -->
		<button
			type="submit"
			class="submit-button"
			disabled={isLoading}
			aria-label="{isSignUp ? 'Create account' : 'Sign in'}"
		>
			{#if isLoading}
				<div class="loading-spinner"></div>
			{/if}
			<span>{isSignUp ? 'Зареєструватись' : 'Увійти'}</span>
		</button>
	</form>

	<!-- Переключение режима -->
	<div class="mode-toggle">
		<p class="toggle-text">
			{isSignUp ? 'Вже є обліковий запис?' : "Немає облікового запису?"}
			<button
				type="button"
				class="toggle-button"
				on:click={toggleMode}
				disabled={isLoading}
			>
				{isSignUp ? 'Увійти' : 'Зареєструватись'}
			</button>
		</p>
	</div>


</div>

<style>
	.login-form-container {
		width: 540px;
		min-height: 695px;
		margin: 0 auto;
		padding: 40px 40px 60px;
		background: #FFFFFF;
		border-radius: 20px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 40px;
	}

	.form-header {
		text-align: center;
		margin-bottom: 0;
	}

	.form-title {
		font-family: 'Nunito', sans-serif;
		font-style: normal;
		font-weight: 600;
		font-size: 36px;
		line-height: 140%;
		color: #222222;
		margin: 0;
		width: 80px;
		height: 50px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.oauth-section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 0px;
		gap: 16px;
		width: 460px;
		min-height: 108px;
		align-self: stretch;
	}

	.oauth-button {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding: 16px 48px;
		gap: 10px;
		width: 460px;
		min-height: 46px;
		border: 1px solid #4B766E;
		border-radius: 100px;
		background: white;
		color: #4B766E;
		font-family: 'Nunito', sans-serif;
		font-style: normal;
		font-weight: 500;
		font-size: 17px;
		line-height: 140%;
		cursor: pointer;
		transition: all 0.2s ease;
		align-self: stretch;
	}

	.oauth-button:hover:not(:disabled) {
		opacity: 0.8;
	}

	.oauth-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.oauth-icon {
		width: 24px;
		height: 24px;
	}

	.oauth-label {
		width: 258px;
		min-height: 25px;
		font-family: 'Nunito', sans-serif;
		font-style: normal;
		font-weight: 500;
		font-size: 17px;
		line-height: 140%;
		display: flex;
		align-items: center;
		text-align: center;
		color: #4B766E;
	}

	.divider {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding: 0px;
		gap: 16px;
		width: 460px;
		height: 22px;
		align-self: stretch;
	}

	.divider-line {
		width: 199.5px;
		height: 1px;
		background: #B4B4B4;
		flex: 1;
	}

	.divider-text {
		width: 29px;
		height: 22px;
		font-family: 'Nunito', sans-serif;
		font-style: normal;
		font-weight: 400;
		font-size: 16px;
		line-height: 140%;
		display: flex;
		align-items: center;
		text-align: center;
		color: #B4B4B4;
	}

	.email-form {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		padding: 0px;
		gap: 20px;
		width: 460px;
		min-height: 201px;
		align-self: stretch;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		padding: 0px;
		gap: 8px;
		width: 460px;
		height: 74px;
		align-self: stretch;
	}

	.form-label {
		width: 148px;
		height: 22px;
		font-family: 'Nunito', sans-serif;
		font-style: normal;
		font-weight: 400;
		font-size: 16px;
		line-height: 140%;
		display: flex;
		align-items: center;
		color: #000000;
	}

	.form-input {
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 12px 16px;
		width: 460px;
		height: 44px;
		border: 1px solid #9A9A9A;
		border-radius: 10px;
		font-family: 'Nunito', sans-serif;
		font-style: normal;
		font-weight: 400;
		font-size: 14px;
		line-height: 140%;
		color: #787878;
		background: white;
		align-self: stretch;
	}

	.password-input-container {
		position: relative;
		width: 100%;
	}

	.password-input {
		padding-right: 48px; /* Space for the toggle button */
	}

	.password-toggle {
		position: absolute;
		right: 12px;
		top: 50%;
		transform: translateY(-50%);
		background: none;
		border: none;
		cursor: pointer;
		padding: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		transition: opacity 0.2s ease;
	}

	.password-toggle:hover:not(:disabled) {
		opacity: 0.7;
	}

	.password-toggle:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.form-input:focus {
		outline: none;
		border-color: #4B766E;
	}

	.form-input:disabled {
		background: #f9fafb;
		cursor: not-allowed;
	}

	.error-message {
		padding: 0.75rem 1rem;
		background: #fef2f2;
		border: 1px solid #fecaca;
		border-radius: 8px;
		color: #dc2626;
		font-size: 0.875rem;
		text-align: center;
	}

	.submit-button {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding: 16px 24px;
		gap: 8px;
		width: 460px;
		height: 46px;
		background: #52796F;
		border: none;
		border-radius: 12px;
		font-family: 'Nunito', sans-serif;
		font-style: normal;
		font-weight: 600;
		font-size: 16px;
		line-height: 140%;
		color: #FFFFFF;
		cursor: pointer;
		transition: all 0.2s ease;
		align-self: stretch;
	}

	.submit-button:hover:not(:disabled) {
		background: #3e5d56;
	}

	.submit-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.loading-spinner {
		width: 16px;
		height: 16px;
		border: 2px solid transparent;
		border-top: 2px solid currentColor;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.mode-toggle {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		padding: 0px;
		gap: 6px;
		width: 460px;
		height: auto;
		margin-top: 20px;
		align-self: stretch;
	}

	.toggle-text {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 0px;
		gap: 6px;
		width: auto;
		height: 22px;
		margin: 0;
		color: #474747;
		font-family: 'Nunito', sans-serif;
		font-style: normal;
		font-weight: 400;
		font-size: 16px;
		line-height: 140%;
		display: flex;
		align-items: center;
		text-align: center;
	}

	.toggle-button {
		background: none;
		border: none;
		color: #4B766E;
		font-family: 'Nunito', sans-serif;
		font-style: normal;
		font-weight: 400;
		font-size: 16px;
		line-height: 140%;
		cursor: pointer;
		text-decoration-line: underline;
		margin: 0;
		width: auto;
		height: 22px;
		display: flex;
		align-items: center;
		text-align: center;
	}

	.toggle-button:hover:not(:disabled) {
		color: #3a5d56;
	}

	.toggle-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	/* Forgot Password */
	.forgot-password {
		display: flex;
		justify-content: flex-end;
		width: 100%;
		margin-top: -8px;
	}

	.forgot-link {
		font-family: 'Nunito', sans-serif;
		font-size: 14px;
		font-weight: 500;
		color: #4B766E;
		text-decoration: underline;
		transition: color 0.2s ease;
	}

	.forgot-link:hover {
		color: #3a5d56;
	}
</style>
