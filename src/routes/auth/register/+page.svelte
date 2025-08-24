<script lang="ts">
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import { notificationStore } from '$lib/stores/notifications';
	import type { ActionData } from './$types';

	const { form }: { form: ActionData } = $props();
	
	// Preserve form values on error
	let email = form?.email || '';
	let firstName = form?.firstName || '';
	let lastName = form?.lastName || '';
	let age = form?.age || '';
	let isSubmitting = false;
	
	// Password validation state
	let password = '';
	let confirmPassword = '';
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
	
	// Handle successful registration notifications
	onMount(() => {
		if (form?.success && form?.confirmationRequired && email) {
			// Show notification for email confirmation
			notificationStore.success(`Please check ${email} for a confirmation link to activate your account.`, {
				title: 'Registration successful!',
				duration: 12000, // Give users time to read
				actions: [
					{
						label: 'Got it',
						action: () => {}, // Will auto-remove
						style: 'secondary'
					}
				]
			});
		}
	});
</script>

<svelte:head>
	<title>Sign Up - Balance Botanica</title>
</svelte:head>

<div class="mx-auto max-w-md">
	<h2 class="mb-8 text-center text-3xl font-bold text-gray-900">Create your account</h2>

	<!-- Success Message -->
	{#if form?.success}
		<div class="mb-4 rounded-md border border-green-200 bg-green-50 p-4">
			<div class="flex">
				<div class="flex-shrink-0">
					<svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
					</svg>
				</div>
				<div class="ml-3">
					<p class="text-sm font-medium text-green-800">{form.message}</p>
					{#if form.confirmationRequired}
						<p class="mt-2 text-sm text-green-700">You can close this page. Once you've confirmed your email, you can sign in.</p>
					{/if}
				</div>
			</div>
		</div>
	{/if}

	<!-- Error Message -->
	{#if form?.error && form?.message}
		<div class="mb-4 rounded-md border border-red-200 bg-red-50 p-4">
			<p class="text-sm text-red-600">{form.message}</p>
		</div>
	{/if}

	<form 
		method="post" 
		action="?/register" 
		use:enhance={() => {
			isSubmitting = true;
			return async ({ result, update }) => {
				await update();
				isSubmitting = false;
				
				// Show notification on successful registration
				if (result.type === 'success' && result.data?.success && result.data?.confirmationRequired && email) {
					notificationStore.success(`Please check ${email} for a confirmation link to activate your account.`, {
						title: 'Registration successful!',
						duration: 12000,
						actions: [
							{
								label: 'Got it',
								action: () => {},
								style: 'secondary'
							}
						]
					});
				}
			};
		}} 
		class="space-y-6"
	>
		<!-- Email -->
		<div>
			<label for="email" class="block text-sm font-medium text-gray-700"> 
				Email address <span class="text-red-500">*</span>
			</label>
			<input
				id="email"
				name="email"
				type="email"
				bind:value={email}
				required
				autocomplete="email"
				disabled={isSubmitting}
				class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
				placeholder="Enter your email address"
			/>
		</div>

		<!-- First Name and Last Name -->
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			<div>
				<label for="firstName" class="block text-sm font-medium text-gray-700"> 
					First name
				</label>
				<input
					id="firstName"
					name="firstName"
					type="text"
					bind:value={firstName}
					autocomplete="given-name"
					disabled={isSubmitting}
					class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
					placeholder="First name"
				/>
			</div>
			<div>
				<label for="lastName" class="block text-sm font-medium text-gray-700"> 
					Last name
				</label>
				<input
					id="lastName"
					name="lastName"
					type="text"
					bind:value={lastName}
					autocomplete="family-name"
					disabled={isSubmitting}
					class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
					placeholder="Last name"
				/>
			</div>
		</div>

		<!-- Age -->
		<div>
			<label for="age" class="block text-sm font-medium text-gray-700"> 
				Age <span class="text-red-500">*</span>
			</label>
			<input
				id="age"
				name="age"
				type="number"
				bind:value={age}
				min="18"
				max="120"
				required
				disabled={isSubmitting}
				class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
				placeholder="Enter your age"
			/>
			<p class="mt-1 text-xs text-gray-500">You must be at least 18 years old to register</p>
		</div>

		<!-- Password -->
		<div>
			<label for="password" class="block text-sm font-medium text-gray-700"> 
				Password <span class="text-red-500">*</span>
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
				placeholder="Create a strong password"
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

		<!-- Confirm Password -->
		<div>
			<label for="confirmPassword" class="block text-sm font-medium text-gray-700"> 
				Confirm password <span class="text-red-500">*</span>
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
				placeholder="Confirm your password"
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
					Creating account...
				{:else}
					Create Account
				{/if}
			</button>
		</div>
	</form>

	<div class="mt-6 text-center">
		<p class="text-sm text-gray-600">
			Already have an account?
			<a 
				href="/auth/login" 
				class="font-medium text-green-600 hover:text-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded"
			>
				Sign in here
			</a>
		</p>
	</div>
</div>
