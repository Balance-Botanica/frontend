<script lang="ts">
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>Authentication - Balance Botanica</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-md">
		<div class="text-center">
			<a href="/" class="text-3xl font-bold text-green-600 hover:text-green-700">
				Balance Botanica
			</a>
		</div>
	</div>
	
	<div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
		<div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
			<slot />
		</div>
	</div>
</div>
