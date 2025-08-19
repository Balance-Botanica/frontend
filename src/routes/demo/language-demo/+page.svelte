<script lang="ts">
	import { localeStore } from '$lib/stores/locale.js';
</script>

<svelte:head>
	<title>Language Demo - Balance Botanica</title>
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-4xl">
	<div class="mb-6">
		<a href="/demo" class="text-blue-600 hover:text-blue-800 flex items-center">
			<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
			Back to Demo
		</a>
	</div>

	<h1 class="text-3xl font-bold text-gray-900 mb-8">Language Switching Demo</h1>

	<div class="bg-white border border-gray-200 rounded-lg p-6 mb-8">
		<h2 class="text-xl font-semibold text-gray-900 mb-4">Current Language</h2>
		<div class="text-lg font-mono mb-4">
			Current: <span class="font-bold text-blue-600">{$localeStore}</span>
		</div>
		
		<div class="space-y-3">
			<button
				on:click={() => localeStore.set('uk-ua')}
				class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
			>
				🇺🇦 Set to Ukrainian (uk-ua)
			</button>
			
			<button
				on:click={() => localeStore.set('en')}
				class="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
			>
				🇬🇧 Set to English (en)
			</button>
			
			<button
				on:click={() => localeStore.toggle()}
				class="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
			>
				🔄 Toggle Language
			</button>
		</div>
	</div>

	<!-- Info Box -->
	<div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
		<h3 class="text-lg font-semibold text-blue-800 mb-2">How It Works</h3>
		<ul class="text-blue-700 space-y-1">
			<li>• Ukrainian (uk-ua) is now the default language</li>
			<li>• Language preference is stored in localStorage</li>
			<li>• Page reloads to apply new locale settings</li>
			<li>• All translations automatically update</li>
		</ul>
	</div>
</div>
