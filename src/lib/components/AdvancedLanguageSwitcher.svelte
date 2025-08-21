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
	$: filteredLocales = availableLocales.filter(
		(locale) =>
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
		return (
			currentLocaleConfig.flag + ' ' + currentLocaleConfig.code.split('-')[1] ||
			currentLocaleConfig.iso.toUpperCase()
		);
	}
</script>

<svelte:window on:click={handleClickOutside} />

<div class="relative" bind:this={dropdownElement}>
	<!-- Current Locale Display -->
	<button
		type="button"
		on:click={toggleDropdown}
		on:keydown={handleKeyDown}
		class="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 transition-opacity duration-200 hover:opacity-80 focus:ring-2 focus:ring-main focus:ring-offset-2 focus:outline-none"
		aria-label="Change language"
		aria-expanded={isOpen}
		aria-haspopup="listbox"
	>
		<span class="text-base font-medium">
			{getCurrentLocaleDisplay()}
		</span>
		<svg
			class="h-4 w-4 transition-transform duration-200 {isOpen ? 'rotate-180' : ''}"
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
			class="absolute right-0 z-50 mt-2 max-h-96 w-80 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg"
			role="listbox"
			aria-label="Available languages"
		>
			<!-- Search Input -->
			<div class="border-b border-gray-200 p-3">
				<input
					type="text"
					placeholder="Search languages..."
					bind:value={searchQuery}
					on:input={handleSearchInput}
					class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-main focus:ring-2 focus:ring-main focus:outline-none"
				/>
			</div>

			<!-- Locale List -->
			<div class="max-h-64 overflow-y-auto">
				{#each filteredLocales as locale (locale.code)}
					<button
						type="button"
						on:click={() => selectLocale(locale.code)}
						class="w-full px-4 py-3 text-left transition-colors hover:bg-gray-50 focus:bg-gray-50 focus:ring-2 focus:ring-main focus:outline-none focus:ring-inset {locale.code ===
						currentLocaleCode
							? 'bg-main/10 text-main'
							: 'text-gray-900'}"
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
								<svg class="h-5 w-5 text-main" fill="currentColor" viewBox="0 0 20 20">
									<path
										fill-rule="evenodd"
										d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
										clip-rule="evenodd"
									/>
								</svg>
							{/if}
						</div>
					</button>
				{/each}
			</div>

			<!-- Footer -->
			<div class="border-t border-gray-200 bg-gray-50 p-3">
				<div class="text-center text-xs text-gray-500">
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
