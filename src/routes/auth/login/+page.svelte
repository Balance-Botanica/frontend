<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	const { form }: { form: ActionData } = $props();
	
	// Preserve form values on error
	let email = form?.email || '';
	let isSubmitting = false;
</script>

<svelte:head>
	<title>Sign In - Balance Botanica</title>
</svelte:head>

<div class="mx-auto max-w-md">
	<h2 class="mb-8 text-center text-3xl font-bold text-gray-900">Sign in to your account</h2>

	<!-- Error Message -->
	{#if form?.error && form?.message}
		<div class="mb-4 rounded-md border border-red-200 bg-red-50 p-4">
			<p class="text-sm text-red-600">{form.message}</p>
		</div>
	{/if}

	<form 
		method="post" 
		action="?/login" 
		use:enhance={() => {
			isSubmitting = true;
			return async ({ update }) => {
				await update();
				isSubmitting = false;
			};
		}} 
		class="space-y-6"
	>
		<div>
			<label for="email" class="block text-sm font-medium text-gray-700"> 
				Email address 
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

		<div>
			<label for="password" class="block text-sm font-medium text-gray-700"> 
				Password 
			</label>
			<input
				id="password"
				name="password"
				type="password"
				required
				autocomplete="current-password"
				disabled={isSubmitting}
				class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
				placeholder="Enter your password"
			/>
		</div>

		<!-- Forgot Password Link -->
		<div class="flex items-center justify-between">
			<div></div> <!-- Spacer -->
			<div class="text-sm">
				<a 
					href="/auth/forgot-password" 
					class="font-medium text-green-600 hover:text-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded"
				>
					Forgot your password?
				</a>
			</div>
		</div>

		<div>
			<button
				type="submit"
				disabled={isSubmitting}
				class="flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
			>
				{#if isSubmitting}
					<svg class="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
						<path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
					</svg>
					Signing in...
				{:else}
					Sign in
				{/if}
			</button>
		</div>
	</form>

	<div class="mt-6 text-center">
		<p class="text-sm text-gray-600">
			Don't have an account?
			<a 
				href="/auth/register" 
				class="font-medium text-green-600 hover:text-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded"
			>
				Sign up here
			</a>
		</p>
	</div>
</div>
