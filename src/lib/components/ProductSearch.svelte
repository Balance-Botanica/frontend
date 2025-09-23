<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { createPageTranslations } from '$lib/i18n/store';
	import { colors } from '$lib/colors';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';

	// Create page translations (reactive to global locale changes)
	const pageTranslations = createPageTranslations();

	// Props
	export let searchTerm = '';
	export let selectedCategory = '';
	export let selectedSize = '';
	export let selectedFlavor = '';
	export let minPrice: number | null = null;
	export let maxPrice: number | null = null;
	export let categories: string[] = [];
	export let sizes: string[] = [];
	export let flavors: string[] = [];

	// Note: Props are used directly as local state since this component modifies them

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
		console.log('ProductSearch: handleSearch called with searchTerm:', searchTerm);
		console.log('ProductSearch: searchTerm type:', typeof searchTerm, 'length:', searchTerm.length);
		console.log('ProductSearch: filters:', {
			selectedCategory,
			selectedSize,
			selectedFlavor,
			minPrice,
			maxPrice
		});
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
		console.log('ProductSearch: handleReset called');
		searchTerm = '';
		selectedCategory = '';
		selectedSize = '';
		selectedFlavor = '';
		minPrice = null;
		maxPrice = null;
		dispatch('reset');
	}

	// Handle enter key in search input
	function handleKeyPress(event: CustomEvent<{ key: string }>) {
		if (event.detail && event.detail.key === 'Enter') {
			console.log('ProductSearch: Enter key pressed, triggering search');
			handleSearch();
		}
	}

	// Type-safe event handlers
	function handleSearchInput(event: Event) {
		const target = event.target as HTMLInputElement;
		searchTerm = target.value;
	}

	function handleMinPriceInput(value: string) {
		minPrice = value ? parseFloat(value) : null;
	}

	function handleMaxPriceInput(value: string) {
		maxPrice = value ? parseFloat(value) : null;
	}
</script>

<div class="mb-8 rounded-xl bg-white p-6 shadow-md">
	{#if $pageTranslations}
		<h2 class="mb-6 text-2xl font-bold text-gray-800">
			{$pageTranslations.t('products.search.title')}
		</h2>

		<!-- Search Form -->
		<form
			on:submit|preventDefault={(event) => {
				console.log('Form submit event triggered');
				handleSearch();
			}}
		>
			<!-- Search Input -->
			<div class="mb-6">
				<label
					for="search-input"
					class="mb-2 block cursor-pointer text-sm font-medium text-gray-700"
				>
					{$pageTranslations.t('products.search.search_label')}
				</label>
				<div class="relative">
					<input
						id="search-input"
						type="text"
						bind:value={searchTerm}
						placeholder={String($pageTranslations.t('products.search.search_placeholder'))}
						on:keypress={(e) => {
							if (e.key === 'Enter') {
								console.log('ProductSearch: Enter key pressed, triggering search');
								handleSearch();
							}
						}}
						class="w-full rounded-lg border-2 px-4 py-3 transition-all duration-200 ease-in-out focus:ring-2 focus:ring-offset-2 focus:outline-none"
						style="
							border-color: {colors.stroke};
							background-color: {colors.optional};
							color: {colors.text};
							focus-ring-color: {colors.main};
						"
					/>
					{#if searchTerm}
						<button
							type="button"
							on:click={() => {
								console.log('Clear search button clicked');
								searchTerm = '';
							}}
							class="absolute top-1/2 right-3 -translate-y-1/2 transform cursor-pointer text-gray-400 hover:text-gray-600"
						>
							<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					{/if}
				</div>
			</div>

			<!-- Filters Grid -->
			<div class="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
				<!-- Category Filter -->
				<div>
					<label
						for="category-select"
						class="mb-2 block cursor-pointer text-sm font-medium text-gray-700"
					>
						{$pageTranslations.t('products.search.category_label')}
					</label>
					<select
						id="category-select"
						bind:value={selectedCategory}
						class="w-full cursor-pointer rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-[#4b766e] focus:ring-2 focus:ring-[#4b766e]"
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
					<label
						for="size-select"
						class="mb-2 block cursor-pointer text-sm font-medium text-gray-700"
					>
						{$pageTranslations.t('products.search.size_label')}
					</label>
					<select
						id="size-select"
						bind:value={selectedSize}
						class="w-full cursor-pointer rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-[#4b766e] focus:ring-2 focus:ring-[#4b766e]"
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
					<label
						for="flavor-select"
						class="mb-2 block cursor-pointer text-sm font-medium text-gray-700"
					>
						{$pageTranslations.t('products.search.flavor_label')}
					</label>
					<select
						id="flavor-select"
						bind:value={selectedFlavor}
						class="w-full cursor-pointer rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-[#4b766e] focus:ring-2 focus:ring-[#4b766e]"
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
					<label class="mb-2 block cursor-pointer text-sm font-medium text-gray-700">
						{$pageTranslations?.t('products.search.price_label') || 'Price Range'}
					</label>
					<div class="flex space-x-2">
						<input
							type="number"
							bind:value={minPrice}
							placeholder="Min"
							class="w-full rounded-lg border-2 px-4 py-3 transition-all duration-200 ease-in-out focus:ring-2 focus:ring-offset-2 focus:outline-none"
							style="
								border-color: {colors.stroke};
								background-color: {colors.optional};
								color: {colors.text};
								focus-ring-color: {colors.main};
							"
						/>
						<input
							type="number"
							bind:value={maxPrice}
							placeholder="Max"
							class="w-full rounded-lg border-2 px-4 py-3 transition-all duration-200 ease-in-out focus:ring-2 focus:ring-offset-2 focus:outline-none"
							style="
								border-color: {colors.stroke};
								background-color: {colors.optional};
								color: {colors.text};
								focus-ring-color: {colors.main};
							"
						/>
					</div>
				</div>
			</div>

			<!-- Action Buttons -->
			<div class="flex flex-wrap gap-4">
				<Button
					type="submit"
					variant="primary"
					on:click={(event) => {
						console.log('Search button clicked');
					}}
				>
					{$pageTranslations.t('products.search.search_button')}
				</Button>
				<Button
					type="button"
					variant="ghost"
					on:click={(event) => {
						console.log('Reset button clicked');
						handleReset();
					}}
				>
					{$pageTranslations.t('products.search.reset_button')}
				</Button>
			</div>
		</form>
	{:else}
		<!-- Fallback content while translations are loading -->
		<h2 class="mb-6 text-2xl font-bold text-gray-800">Search Products</h2>

		<!-- Search Form -->
		<form
			on:submit|preventDefault={(event) => {
				console.log('Form submit event triggered');
				handleSearch();
			}}
		>
			<!-- Search Input -->
			<div class="mb-6">
				<label
					for="search-input"
					class="mb-2 block cursor-pointer text-sm font-medium text-gray-700"
				>
					Search
				</label>
				<div class="relative">
					<input
						id="search-input"
						type="text"
						bind:value={searchTerm}
						placeholder="Search products..."
						on:keypress={(e) => {
							if (e.key === 'Enter') {
								console.log('ProductSearch: Enter key pressed, triggering search');
								handleSearch();
							}
						}}
						class="w-full rounded-lg border-2 px-4 py-3 transition-all duration-200 ease-in-out focus:ring-2 focus:ring-offset-2 focus:outline-none"
						style="
							border-color: {colors.stroke};
							background-color: {colors.optional};
							color: {colors.text};
							focus-ring-color: {colors.main};
						"
					/>
					{#if searchTerm}
						<button
							type="button"
							on:click={() => {
								console.log('Clear search button clicked');
								searchTerm = '';
							}}
							class="absolute top-1/2 right-3 -translate-y-1/2 transform cursor-pointer text-gray-400 hover:text-gray-600"
						>
							<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					{/if}
				</div>
			</div>

			<!-- Filters Grid -->
			<div class="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
				<!-- Category Filter -->
				<div>
					<label
						for="category-select"
						class="mb-2 block cursor-pointer text-sm font-medium text-gray-700"
					>
						Category
					</label>
					<select
						id="category-select"
						bind:value={selectedCategory}
						class="w-full cursor-pointer rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-[#4b766e] focus:ring-2 focus:ring-[#4b766e]"
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
					<label
						for="size-select"
						class="mb-2 block cursor-pointer text-sm font-medium text-gray-700"
					>
						Size
					</label>
					<select
						id="size-select"
						bind:value={selectedSize}
						class="w-full cursor-pointer rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-[#4b766e] focus:ring-2 focus:ring-[#4b766e]"
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
					<label
						for="flavor-select"
						class="mb-2 block cursor-pointer text-sm font-medium text-gray-700"
					>
						Flavor
					</label>
					<select
						id="flavor-select"
						bind:value={selectedFlavor}
						class="w-full cursor-pointer rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-[#4b766e] focus:ring-2 focus:ring-[#4b766e]"
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
					<label
						for="min-price-input"
						class="mb-2 block cursor-pointer text-sm font-medium text-gray-700"
					>
						{$pageTranslations!.t('products.search.price_label')}
					</label>
					<div class="flex space-x-2">
						<Input
							id="min-price-input"
							type="number"
							value={minPrice !== null ? minPrice.toString() : ''}
							placeholder="Min"
							onChange={handleMinPriceInput}
						/>
						<Input
							type="number"
							value={maxPrice !== null ? maxPrice.toString() : ''}
							placeholder="Max"
							onChange={handleMaxPriceInput}
						/>
					</div>
				</div>
			</div>

			<!-- Action Buttons -->
			<div class="flex flex-wrap gap-4">
				<Button on:click={handleSearch} variant="primary" type="submit">Search</Button>
				<Button on:click={handleReset} variant="ghost" type="button">Reset Filters</Button>
			</div>
		</form>
	{/if}
</div>

<style>
	/* Add any additional styles here if needed */
	select:focus {
		cursor: pointer;
	}

	input[type='number']:focus {
		cursor: text;
	}
</style>
