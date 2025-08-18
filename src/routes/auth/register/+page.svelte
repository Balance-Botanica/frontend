<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	
	let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
	<title>Register - Balance Botanica</title>
</svelte:head>

<div>
	<h2 class="text-3xl font-bold text-gray-900 text-center mb-8">
		Create your account
	</h2>
	
	{#if form?.message}
		<div class="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
			<p class="text-sm text-red-600">{form.message}</p>
		</div>
	{/if}
	
	<form method="post" action="?/register" use:enhance class="space-y-6">
		<div>
			<label for="username" class="block text-sm font-medium text-gray-700">
				Username
			</label>
			<input
				id="username"
				name="username"
				type="text"
				required
				minlength="3"
				class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
				placeholder="Choose a username"
			/>
		</div>
		
		<div>
			<label for="age" class="block text-sm font-medium text-gray-700">
				Age
			</label>
			<input
				id="age"
				name="age"
				type="number"
				min="18"
				required
				class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
				placeholder="Enter your age"
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
				minlength="8"
				class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
				placeholder="Create a password"
			/>
		</div>
		
		<div>
			<button
				type="submit"
				class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
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
