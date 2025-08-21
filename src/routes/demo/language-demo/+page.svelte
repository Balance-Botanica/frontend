<script lang="ts">
	import { localeStore } from '$lib/stores/locale.js';
</script>

<svelte:head>
	<title>Language Demo - Balance Botanica</title>
</svelte:head>

<div class="container mx-auto max-w-4xl px-4 py-8">
	<div class="mb-6">
		<a href="/demo" class="flex items-center text-blue-600 hover:text-blue-800">
			<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
			Back to Demo
		</a>
	</div>

	<h1 class="mb-8 text-3xl font-bold text-gray-900">Language Switching Demo</h1>

	<div class="mb-8 rounded-lg border border-gray-200 bg-white p-6">
		<h2 class="mb-4 text-xl font-semibold text-gray-900">Current Language</h2>
		<div class="mb-4 font-mono text-lg">
			Current: <span class="font-bold text-blue-600">{$localeStore}</span>
		</div>

		<div class="space-y-3">
			<button
				on:click={() => localeStore.set('uk-ua')}
				class="w-full rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
			>
				🇺🇦 Set to Ukrainian (uk-ua)
			</button>

			<button
				on:click={() => localeStore.set('en')}
				class="w-full rounded-md bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
			>
				🇬🇧 Set to English (en)
			</button>

			<button
				on:click={() => localeStore.toggle()}
				class="w-full rounded-md bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
			>
				🔄 Toggle Language
			</button>
		</div>
	</div>

	<!-- Info Box -->
	<div class="rounded-lg border border-blue-200 bg-blue-50 p-6">
		<h3 class="mb-2 text-lg font-semibold text-blue-800">How It Works</h3>
		<ul class="space-y-1 text-blue-700">
			<li>• Ukrainian (uk-ua) is now the default language</li>
			<li>• Language preference is stored in localStorage</li>
			<li>• Page reloads to apply new locale settings</li>
			<li>• All translations automatically update</li>
		</ul>
	</div>
</div>
