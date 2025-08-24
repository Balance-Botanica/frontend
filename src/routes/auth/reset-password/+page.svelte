<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	const { form, data }: { form: ActionData; data: PageData } = $props();
	
	// Password validation state
	let password = '';
	let confirmPassword = '';
	let isSubmitting = false;
	let showPasswordMatch = false;
	
	// Real-time password validation
	const passwordLength = $derived(password.length >= 8);
	const passwordHasUpper = $derived(/[A-Z]/.test(password));
	const passwordHasLower = $derived(/[a-z]/.test(password));
	const passwordHasNumber = $derived(/\d/.test(password));
	const passwordValid = $derived(passwordLength && passwordHasUpper && passwordHasLower && passwordHasNumber);
	const passwordsMatch = $derived(password === confirmPassword && password.length > 0);
	
	// Show password matching indicator when user starts typing confirm password
	function handleConfirmPasswordInput() {
		showPasswordMatch = confirmPassword.length > 0;
	}
</script>

<svelte:head>
	<title>Reset Password - Balance Botanica</title>
</svelte:head>

<div class="mx-auto max-w-md">
	<!-- Invalid Token / Error State -->
	{#if data?.error}
		<div class="text-center">
			<div class="mx-auto h-12 w-12 text-red-400">
				<svg fill="none" stroke="currentColor" viewBox="0 0 48 48">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
			</div>
			<h2 class="mt-4 text-xl font-bold text-gray-900">Invalid Reset Link</h2>
			<p class="mt-2 text-sm text-gray-600">{data.message}</p>
			<div class="mt-6">
				<a
					href="/auth/forgot-password"
					class="inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
				>
					Request New Reset Link
				</a>
			</div>
		</div>
	{:else if form?.success}
		<!-- Success State -->
		<div class="text-center">
			<div class="mx-auto h-12 w-12 text-green-400">
				<svg fill="currentColor" viewBox="0 0 48 48">
					<path fill-rule="evenodd" d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4 4 12.954 4 24s8.954 20 20 20zm9.707-23.293a1 1 0 00-1.414-1.414L23 28.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0l10-10z" clip-rule="evenodd" />
				</svg>
			</div>
			<h2 class="mt-4 text-xl font-bold text-gray-900">Password Updated</h2>
			<p class="mt-2 text-sm text-gray-600">{form.message}</p>
			<div class="mt-6">
				<a
					href="/auth/login"
					class="inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
				>
					Sign In Now
				</a>
			</div>
		</div>
	{:else}
		<!-- Reset Password Form -->
		<div class="text-center mb-8">
			<h2 class="text-3xl font-bold text-gray-900">Reset Your Password</h2>
			<p class="mt-2 text-sm text-gray-600">
				Enter your new password below.
			</p>
		</div>

		<!-- Error Message -->
		{#if form?.error && form?.message}
			<div class="mb-4 rounded-md border border-red-200 bg-red-50 p-4">
				<p class="text-sm text-red-600">{form.message}</p>
				{#if form?.sessionExpired}
					<div class="mt-3">
						<a
							href="/auth/forgot-password"
							class="text-sm font-medium text-red-600 underline hover:text-red-500"
						>
							Request a new password reset link
						</a>
					</div>
				{/if}
			</div>
		{/if}

		<form 
			method="post" 
			action="?/reset-password" 
			use:enhance={() => {
				isSubmitting = true;
				return async ({ update }) => {
					await update();
					isSubmitting = false;
				};
			}} 
			class="space-y-6"
		>
			<!-- New Password -->
			<div>
				<label for="password" class="block text-sm font-medium text-gray-700"> 
					New Password <span class="text-red-500">*</span>
				</label>
				<input
					id="password"
					name="password"
					type="password"
					bind:value={password}
					required
					autocomplete="new-password"
					disabled={isSubmitting}
					class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
					placeholder="Enter your new password"
				/>
				
				<!-- Password Requirements -->
				{#if password.length > 0}
					<div class="mt-2 space-y-1">
						<p class="text-xs font-medium text-gray-700">Password requirements:</p>
						<ul class="space-y-1 text-xs">
							<li class="flex items-center space-x-2">
								<span class="{passwordLength ? 'text-green-600' : 'text-gray-400'}">
									{passwordLength ? '✓' : '○'}
								</span>
								<span class="{passwordLength ? 'text-green-600' : 'text-gray-600'}">At least 8 characters</span>
							</li>
							<li class="flex items-center space-x-2">
								<span class="{passwordHasUpper ? 'text-green-600' : 'text-gray-400'}">
									{passwordHasUpper ? '✓' : '○'}
								</span>
								<span class="{passwordHasUpper ? 'text-green-600' : 'text-gray-600'}">One uppercase letter</span>
							</li>
							<li class="flex items-center space-x-2">
								<span class="{passwordHasLower ? 'text-green-600' : 'text-gray-400'}">
									{passwordHasLower ? '✓' : '○'}
								</span>
								<span class="{passwordHasLower ? 'text-green-600' : 'text-gray-600'}">One lowercase letter</span>
							</li>
							<li class="flex items-center space-x-2">
								<span class="{passwordHasNumber ? 'text-green-600' : 'text-gray-400'}">
									{passwordHasNumber ? '✓' : '○'}
								</span>
								<span class="{passwordHasNumber ? 'text-green-600' : 'text-gray-600'}">One number</span>
							</li>
						</ul>
					</div>
				{/if}
			</div>

			<!-- Confirm New Password -->
			<div>
				<label for="confirmPassword" class="block text-sm font-medium text-gray-700"> 
					Confirm New Password <span class="text-red-500">*</span>
				</label>
				<input
					id="confirmPassword"
					name="confirmPassword"
					type="password"
					bind:value={confirmPassword}
					on:input={handleConfirmPasswordInput}
					required
					autocomplete="new-password"
					disabled={isSubmitting}
					class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
					placeholder="Confirm your new password"
				/>
				
				<!-- Password Match Indicator -->
				{#if showPasswordMatch}
					<div class="mt-1 flex items-center space-x-2">
						<span class="{passwordsMatch ? 'text-green-600' : 'text-red-600'}">
							{passwordsMatch ? '✓' : '✗'}
						</span>
						<span class="text-xs {passwordsMatch ? 'text-green-600' : 'text-red-600'}">
							{passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
						</span>
					</div>
				{/if}
			</div>

			<!-- Submit Button -->
			<div>
				<button
					type="submit"
					disabled={isSubmitting || !passwordValid || !passwordsMatch}
					class="flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
				>
					{#if isSubmitting}
						<svg class="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						Updating password...
					{:else}
						Update Password
					{/if}
				</button>
			</div>
		</form>

		<div class="mt-6 text-center">
			<p class="text-sm text-gray-600">
				Remember your password?
				<a 
					href="/auth/login" 
					class="font-medium text-green-600 hover:text-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded"
				>
					Sign in here
				</a>
			</p>
		</div>
	{/if}
</div>