<script lang="ts">
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>Authentication - Balance Botanica</title>
</svelte:head>

<div
	class="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8"
	style="background-color: #F8F7F6;"
>
	<div class="sm:mx-auto sm:w-full sm:max-w-md">
		<div class="text-center">
			<a
				href="/"
				class="text-3xl font-bold transition-opacity hover:opacity-80"
				style="color: #4B766E;"
			>
				Balance Botanica
			</a>
		</div>
	</div>

	<div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
		<div
			class="bg-white px-4 py-8 shadow-lg sm:rounded-lg sm:px-10"
			style="border: 1px solid #E0E0E0;"
		>
			<slot />
		</div>
	</div>
</div>
