<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
	<title>Login - Balance Botanica</title>
</svelte:head>

<div>
	<h2 class="mb-8 text-center text-3xl font-bold text-gray-900">Sign in to your account</h2>

	{#if form?.message}
		<div class="mb-4 rounded-md border border-red-200 bg-red-50 p-4">
			<p class="text-sm text-red-600">{form.message}</p>
		</div>
	{/if}

	<form method="post" action="?/login" use:enhance class="space-y-6">
		<div>
			<label for="username" class="block text-sm font-medium text-gray-700"> Username </label>
			<input
				id="username"
				name="username"
				type="text"
				required
				class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none"
				placeholder="Enter your username"
			/>
		</div>

		<div>
			<label for="password" class="block text-sm font-medium text-gray-700"> Password </label>
			<input
				id="password"
				name="password"
				type="password"
				required
				class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none"
				placeholder="Enter your password"
			/>
		</div>

		<div>
			<button
				type="submit"
				class="flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
			>
				Sign in
			</button>
		</div>
	</form>

	<div class="mt-6 text-center">
		<p class="text-sm text-gray-600">
			Don't have an account?
			<a href="/auth/register" class="font-medium text-green-600 hover:text-green-500">
				Sign up here
			</a>
		</p>
	</div>
</div>
