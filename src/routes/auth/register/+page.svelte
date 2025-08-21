<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
	<title>Register - Balance Botanica</title>
</svelte:head>

<div>
	<h2 class="mb-8 text-center text-3xl font-bold text-gray-900">Create your account</h2>

	{#if form?.message}
		<div class="mb-4 rounded-md border border-red-200 bg-red-50 p-4">
			<p class="text-sm text-red-600">{form.message}</p>
		</div>
	{/if}

	<form method="post" action="?/register" use:enhance class="space-y-6">
		<div>
			<label for="username" class="block text-sm font-medium text-gray-700"> Username </label>
			<input
				id="username"
				name="username"
				type="text"
				required
				minlength="3"
				class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none"
				placeholder="Choose a username"
			/>
		</div>

		<div>
			<label for="age" class="block text-sm font-medium text-gray-700"> Age </label>
			<input
				id="age"
				name="age"
				type="number"
				min="18"
				required
				class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none"
				placeholder="Enter your age"
			/>
		</div>

		<div>
			<label for="password" class="block text-sm font-medium text-gray-700"> Password </label>
			<input
				id="password"
				name="password"
				type="password"
				required
				minlength="8"
				class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none"
				placeholder="Create a password"
			/>
		</div>

		<div>
			<button
				type="submit"
				class="flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
			>
				Create Account
			</button>
		</div>
	</form>

	<div class="mt-6 text-center">
		<p class="text-sm text-gray-600">
			Already have an account?
			<a href="/auth/login" class="font-medium text-green-600 hover:text-green-500">
				Sign in here
			</a>
		</p>
	</div>
</div>
