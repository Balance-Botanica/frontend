<script lang="ts">
	import { enhance } from '$app/forms';
	import { notificationStore } from '$lib/stores/notifications';
	import type { ActionData } from './$types';

	const { form }: { form: ActionData } = $props();

	// Preserve form values on error
	let email = form?.email || '';
	let isSubmitting = false;
</script>

<svelte:head>
	<title>Forgot Password - Balance Botanica</title>
</svelte:head>

<div class="mx-auto max-w-md">
	<div class="text-center">
		<h2 class="mb-4 text-3xl font-bold text-gray-900">Forgot your password?</h2>
		<p class="mb-8 text-sm text-gray-600">
			Enter your email address and we'll send you a link to reset your password.
		</p>
	</div>

	<!-- Success Message -->
	{#if form?.success}
		<div class="mb-6 rounded-md border border-green-200 bg-green-50 p-4">
			<div class="flex">
				<div class="flex-shrink-0">
					<svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
							clip-rule="evenodd"
						/>
					</svg>
				</div>
				<div class="ml-3">
					<p class="text-sm font-medium text-green-800">{form.message}</p>
					<p class="mt-2 text-sm text-green-700">
						Please check your email and click the reset link to set a new password.
					</p>
					<p class="mt-2 text-sm text-green-700">
						If you don't receive an email within a few minutes, please check your spam folder.
					</p>
				</div>
			</div>
		</div>

		<!-- Additional actions after success -->
		<div class="space-y-3">
			<a
				href="/login"
				class="flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
			>
				Back to Sign In
			</a>
		</div>
	{:else}
		<!-- Error Message -->
		{#if form?.error && form?.message}
			<div class="mb-4 rounded-md border border-red-200 bg-red-50 p-4">
				<p class="text-sm text-red-600">{form.message}</p>
			</div>
		{/if}

		<form
			method="post"
			action="?/forgot-password"
			use:enhance={() => {
				isSubmitting = true;
				return async ({ result, update }) => {
					await update();
					isSubmitting = false;

					// Show notification on successful password reset email
					if (result.type === 'success' && result.data?.success && email) {
						notificationStore.info(
							`We've sent password reset instructions to ${email}. Please check your inbox and spam folder.`,
							{
								title: 'Password reset email sent!',
								duration: 10000,
								actions: [
									{
										label: 'Got it',
										action: () => {},
										style: 'secondary'
									}
								]
							}
						);
					}
				};
			}}
			class="space-y-6"
		>
			<div>
				<label for="email" class="block text-sm font-medium text-gray-700"> Email address </label>
				<input
					id="email"
					name="email"
					type="email"
					bind:value={email}
					required
					autocomplete="email"
					disabled={isSubmitting}
					class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
					placeholder="Enter your email address"
				/>
				<p class="mt-2 text-xs text-gray-500">
					We'll send a password reset link to this email address.
				</p>
			</div>

			<div>
				<button
					type="submit"
					disabled={isSubmitting}
					class="flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-400"
				>
					{#if isSubmitting}
						<svg class="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
							></circle>
							<path
								class="opacity-75"
								fill="currentColor"
								d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
						Sending reset link...
					{:else}
						Send Reset Link
					{/if}
				</button>
			</div>
		</form>

		<div class="mt-6 space-y-3 text-center">
			<p class="text-sm text-gray-600">
				Remember your password?
				<a
					href="/login"
					class="rounded font-medium text-green-600 hover:text-green-500 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
				>
					Sign in here
				</a>
			</p>
			<p class="text-sm text-gray-600">
				Don't have an account?
				<a
					href="/login"
					class="rounded font-medium text-green-600 hover:text-green-500 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
				>
					Sign up here
				</a>
			</p>
		</div>
	{/if}
</div>
