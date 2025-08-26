<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { createPageTranslations } from '$lib/i18n/store';
	import { colors } from '$lib/colors';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';

	// Create page translations
	const pageTranslations = createPageTranslations();

	// Props
	export let searchTerm: string = '';
	export let selectedCategory: string = '';
	export let selectedSize: string = '';
	export let selectedFlavor: string = '';
	export let minPrice: number | null = null;
	export let maxPrice: number | null = null;
	export let categories: string[] = [];
	export let sizes: string[] = [];
	export let flavors: string[] = [];

	// Event dispatcher
	const dispatch = createEventDispatcher<{
		search: {
			searchTerm: string;
			category: string;
			size: string;
			flavor: string;
			minPrice: number | null;
			maxPrice: number | null;
		};
		reset: void;
	}>();

	// Handle search
	function handleSearch() {
		dispatch('search', {
			searchTerm,
			category: selectedCategory,
			size: selectedSize,
			flavor: selectedFlavor,
			minPrice,
			maxPrice
		});
	}

	// Handle reset
	function handleReset() {
		searchTerm = '';
		selectedCategory = '';
		selectedSize = '';
		selectedFlavor = '';
		minPrice = null;
		maxPrice = null;
		dispatch('reset');
	}

	// Handle enter key in search input
	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			handleSearch();
		}
	}
</script>

<div class="bg-white rounded-xl shadow-md p-6 mb-8">
	{#if $pageTranslations}
		<h2 class="text-2xl font-bold text-gray-800 mb-6">{$pageTranslations.t('products.search.title')}</h2>
		
		<!-- Search Input -->
		<div class="mb-6">
			<label for="search-input" class="block text-sm font-medium text-gray-700 mb-2">
				{$pageTranslations.t('products.search.search_label')}
			</label>
			<div class="relative">
				<Input
					id="search-input"
					type="text"
					value={searchTerm}
					placeholder="{$pageTranslations.t('products.search.search_placeholder')}"
					on:input={(e) => (searchTerm = e.target.value)}
					on:keypress={handleKeyPress}
				/>
				{#if searchTerm}
					<button
						type="button"
						on:click={() => (searchTerm = '')}
						class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				{/if}
			</div>
		</div>

		<!-- Filters Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
			<!-- Category Filter -->
			<div>
				<label for="category-select" class="block text-sm font-medium text-gray-700 mb-2">
					{$pageTranslations.t('products.search.category_label')}
				</label>
				<select
					id="category-select"
					bind:value={selectedCategory}
					class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4b766e] focus:border-[#4b766e] transition-colors"
					style="border-color: {colors.stroke}; background-color: {colors.optional}; color: {colors.text};"
				>
					<option value="">{$pageTranslations.t('products.search.all_categories')}</option>
					{#each categories as category}
						<option value={category}>{category}</option>
					{/each}
				</select>
			</div>

			<!-- Size Filter -->
			<div>
				<label for="size-select" class="block text-sm font-medium text-gray-700 mb-2">
					{$pageTranslations.t('products.search.size_label')}
				</label>
				<select
					id="size-select"
					bind:value={selectedSize}
					class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4b766e] focus:border-[#4b766e] transition-colors"
					style="border-color: {colors.stroke}; background-color: {colors.optional}; color: {colors.text};"
				>
					<option value="">{$pageTranslations.t('products.search.all_sizes')}</option>
					{#each sizes as size}
						<option value={size}>{size}</option>
					{/each}
				</select>
			</div>

			<!-- Flavor Filter -->
			<div>
				<label for="flavor-select" class="block text-sm font-medium text-gray-700 mb-2">
					{$pageTranslations.t('products.search.flavor_label')}
				</label>
				<select
					id="flavor-select"
					bind:value={selectedFlavor}
					class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4b766e] focus:border-[#4b766e] transition-colors"
					style="border-color: {colors.stroke}; background-color: {colors.optional}; color: {colors.text};"
				>
					<option value="">{$pageTranslations.t('products.search.all_flavors')}</option>
					{#each flavors as flavor}
						<option value={flavor}>{flavor}</option>
					{/each}
				</select>
			</div>

			<!-- Price Range -->
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-2">
					{$pageTranslations.t('products.search.price_label')}
				</label>
				<div class="flex space-x-2">
					<Input
						type="number"
						value={minPrice ?? ''}
						placeholder="{$pageTranslations.t('products.search.min_price')}"
						on:input={(e) => (minPrice = e.target.value ? parseFloat(e.target.value) : null)}
					/>
					<Input
						type="number"
						value={maxPrice ?? ''}
						placeholder="{$pageTranslations.t('products.search.max_price')}"
						on:input={(e) => (maxPrice = e.target.value ? parseFloat(e.target.value) : null)}
					/>
				</div>
			</div>
		</div>

		<!-- Action Buttons -->
		<div class="flex flex-wrap gap-4">
			<Button on:click={handleSearch} variant="primary">
				{$pageTranslations.t('products.search.search_button')}
			</Button>
			<Button on:click={handleReset} variant="ghost">
				{$pageTranslations.t('products.search.reset_button')}
			</Button>
		</div>
	{:else}
		<!-- Fallback content while translations are loading -->
		<h2 class="text-2xl font-bold text-gray-800 mb-6">Search Products</h2>
		
		<!-- Search Input -->
		<div class="mb-6">
			<label for="search-input" class="block text-sm font-medium text-gray-700 mb-2">
				Search
			</label>
			<div class="relative">
				<Input
					id="search-input"
					type="text"
					value={searchTerm}
					placeholder="Search products..."
					on:input={(e) => (searchTerm = e.target.value)}
					on:keypress={handleKeyPress}
				/>
				{#if searchTerm}
					<button
						type="button"
						on:click={() => (searchTerm = '')}
						class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				{/if}
			</div>
		</div>

		<!-- Filters Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
			<!-- Category Filter -->
			<div>
				<label for="category-select" class="block text-sm font-medium text-gray-700 mb-2">
					Category
				</label>
				<select
					id="category-select"
					bind:value={selectedCategory}
					class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4b766e] focus:border-[#4b766e] transition-colors"
					style="border-color: {colors.stroke}; background-color: {colors.optional}; color: {colors.text};"
				>
					<option value="">All Categories</option>
					{#each categories as category}
						<option value={category}>{category}</option>
					{/each}
				</select>
			</div>

			<!-- Size Filter -->
			<div>
				<label for="size-select" class="block text-sm font-medium text-gray-700 mb-2">
					Size
				</label>
				<select
					id="size-select"
					bind:value={selectedSize}
					class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4b766e] focus:border-[#4b766e] transition-colors"
					style="border-color: {colors.stroke}; background-color: {colors.optional}; color: {colors.text};"
				>
					<option value="">All Sizes</option>
					{#each sizes as size}
						<option value={size}>{size}</option>
					{/each}
				</select>
			</div>

			<!-- Flavor Filter -->
			<div>
				<label for="flavor-select" class="block text-sm font-medium text-gray-700 mb-2">
					Flavor
				</label>
				<select
					id="flavor-select"
					bind:value={selectedFlavor}
					class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4b766e] focus:border-[#4b766e] transition-colors"
					style="border-color: {colors.stroke}; background-color: {colors.optional}; color: {colors.text};"
				>
					<option value="">All Flavors</option>
					{#each flavors as flavor}
						<option value={flavor}>{flavor}</option>
					{/each}
				</select>
			</div>

			<!-- Price Range -->
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-2">
					Price Range (UAH)
				</label>
				<div class="flex space-x-2">
					<Input
						type="number"
						value={minPrice ?? ''}
						placeholder="Min"
						on:input={(e) => (minPrice = e.target.value ? parseFloat(e.target.value) : null)}
					/>
					<Input
						type="number"
						value={maxPrice ?? ''}
						placeholder="Max"
						on:input={(e) => (maxPrice = e.target.value ? parseFloat(e.target.value) : null)}
					/>
				</div>
			</div>
		</div>

		<!-- Action Buttons -->
		<div class="flex flex-wrap gap-4">
			<Button on:click={handleSearch} variant="primary">
				Search
			</Button>
			<Button on:click={handleReset} variant="ghost">
				Reset Filters
			</Button>
		</div>
	{/if}
</div>

<style>
	/* Add any additional styles here if needed */
</style>