<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { advancedLocaleStore, currentLocale } from '$lib/i18n/store.js';
	import { SUPPORTED_LOCALES, getLocalesByPriority } from '$lib/i18n/config.js';
	
	const dispatch = createEventDispatcher<{
		localeChange: { from: string; to: string };
	}>();

	let isOpen = false;
	let searchQuery = '';
	let dropdownElement: HTMLDivElement;

	// Get current locale
	$: currentLocaleCode = $currentLocale;
	$: currentLocaleConfig = SUPPORTED_LOCALES[currentLocaleCode];

	// Get available locales for dropdown
	$: availableLocales = getLocalesByPriority();
	$: filteredLocales = availableLocales.filter(locale => 
		locale.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
		locale.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
		locale.code.toLowerCase().includes(searchQuery.toLowerCase())
	);

	// Toggle dropdown
	function toggleDropdown() {
		isOpen = !isOpen;
		if (isOpen) {
			searchQuery = '';
			// Focus search input after dropdown opens
			setTimeout(() => {
				const searchInput = dropdownElement?.querySelector('input');
				searchInput?.focus();
			}, 100);
		}
	}

	// Close dropdown
	function closeDropdown() {
		isOpen = false;
		searchQuery = '';
	}

	// Handle locale selection
	async function selectLocale(localeCode: string) {
		if (localeCode === currentLocaleCode) return;

		const previousLocale = currentLocaleCode;
		const success = await advancedLocaleStore.setLocale(localeCode, { reason: 'user' });
		
		if (success) {
			dispatch('localeChange', { from: previousLocale, to: localeCode });
			closeDropdown();
		}
	}

	// Handle keyboard navigation
	function handleKeyDown(event: KeyboardEvent) {
		switch (event.key) {
			case 'Escape':
				closeDropdown();
				break;
			case 'Enter':
			case ' ':
				event.preventDefault();
				toggleDropdown();
				break;
		}
	}

	// Handle click outside
	function handleClickOutside(event: MouseEvent) {
		if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
			closeDropdown();
		}
}

	// Handle search input
	function handleSearchInput(event: Event) {
		const target = event.target as HTMLInputElement;
		searchQuery = target.value;
	}

	// Get display text for current locale
	function getCurrentLocaleDisplay(): string {
		if (!currentLocaleConfig) return 'UA';
		return currentLocaleConfig.flag + ' ' + currentLocaleConfig.code.split('-')[1] || currentLocaleConfig.iso.toUpperCase();
	}
</script>

<svelte:window on:click={handleClickOutside} />

<div class="relative" bind:this={dropdownElement}>
	<!-- Current Locale Display -->
	<button
		type="button"
		on:click={toggleDropdown}
		on:keydown={handleKeyDown}
		class="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:opacity-80 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-main focus:ring-offset-2"
		aria-label="Change language"
		aria-expanded={isOpen}
		aria-haspopup="listbox"
	>
		<span class="text-base font-medium">
			{getCurrentLocaleDisplay()}
		</span>
		<svg 
			class="w-4 h-4 transition-transform duration-200 {isOpen ? 'rotate-180' : ''}" 
			fill="none" 
			stroke="currentColor" 
			viewBox="0 0 24 24"
		>
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
		</svg>
	</button>

	<!-- Dropdown Menu -->
	{#if isOpen}
		<div 
			class="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-hidden"
			role="listbox"
			aria-label="Available languages"
		>
			<!-- Search Input -->
			<div class="p-3 border-b border-gray-200">
				<input
					type="text"
					placeholder="Search languages..."
					bind:value={searchQuery}
					on:input={handleSearchInput}
					class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main focus:border-main"
				/>
			</div>

			<!-- Locale List -->
			<div class="max-h-64 overflow-y-auto">
				{#each filteredLocales as locale (locale.code)}
					<button
						type="button"
						on:click={() => selectLocale(locale.code)}
						class="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-main focus:ring-inset transition-colors {locale.code === currentLocaleCode ? 'bg-main/10 text-main' : 'text-gray-900'}"
						role="option"
						aria-selected={locale.code === currentLocaleCode}
					>
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-3">
								<span class="text-lg">{locale.flag}</span>
								<div class="text-left">
									<div class="font-medium">{locale.nativeName}</div>
									<div class="text-sm text-gray-500">{locale.name}</div>
								</div>
							</div>
							{#if locale.code === currentLocaleCode}
								<svg class="w-5 h-5 text-main" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
								</svg>
							{/if}
						</div>
					</button>
				{/each}
			</div>

			<!-- Footer -->
			<div class="p-3 border-t border-gray-200 bg-gray-50">
				<div class="text-xs text-gray-500 text-center">
					{filteredLocales.length} of {availableLocales.length} languages available
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	/* Custom scrollbar for dropdown */
	.overflow-y-auto::-webkit-scrollbar {
		width: 6px;
	}
	
	.overflow-y-auto::-webkit-scrollbar-track {
		background: #f1f1f1;
		border-radius: 3px;
	}
	
	.overflow-y-auto::-webkit-scrollbar-thumb {
		background: #c1c1c1;
		border-radius: 3px;
	}
	
	.overflow-y-auto::-webkit-scrollbar-thumb:hover {
		background: #a8a8a8;
	}
</style>
