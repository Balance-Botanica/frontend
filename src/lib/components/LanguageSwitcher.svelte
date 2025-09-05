<script lang="ts">
	import { goto } from '$app/navigation';
	import { availableLocales, switchLocale, currentLocale } from '$lib/i18n/store';
	import { SUPPORTED_LOCALES } from '$lib/i18n/types';
	import type { SupportedLocale } from '$lib/i18n/types';

	// Props
	const { className = '' }: { className?: string } = $props();

	// State for dropdown visibility
	let isDropdownOpen = $state(false);
	let isDropdownHovered = false;
	let dropdownContainer: HTMLDivElement;

	// Get display code for locale (convert 'uk-ua' to 'UA', 'en' to 'EN')
	function getDisplayCode(locale: SupportedLocale): string {
		switch (locale) {
			case 'uk-ua':
				return 'UA';
			case 'en':
				return 'EN';
		}
	}

	// Get all locales including current one for dropdown
	let allLocales = $derived(Object.values(SUPPORTED_LOCALES));
	let currentLocaleConfig = $derived(SUPPORTED_LOCALES[$currentLocale]);

	// Handle language switch
	async function handleLanguageSwitch(locale: SupportedLocale) {
		await switchLocale(locale);
		isDropdownOpen = false;

		// Navigate to the appropriate URL for the selected language
		await navigateToLanguageUrl(locale);
	}

	// Navigate to the appropriate URL for the selected language
	async function navigateToLanguageUrl(targetLocale: SupportedLocale) {
		if (typeof window === 'undefined') return;

		const currentPath = window.location.pathname;

		// Remove any existing language prefix to get the base path
		const basePath = currentPath.replace(/^\/en/, '') || '/';

		// If target is Ukrainian (default), navigate to path without language prefix
		if (targetLocale === 'uk-ua') {
			goto(basePath, { replaceState: false });
			return;
		}

		// For other languages, add the appropriate prefix
		if (targetLocale === 'en') {
			const newPath = basePath === '/' ? '/en/' : `/en${basePath}`;
			goto(newPath, { replaceState: false });
		}

		// Future languages can be added here easily:
		// if (targetLocale === 'de') {
		//   const newPath = basePath === '/' ? '/de/' : `/de${basePath}`;
		//   goto(newPath, { replaceState: false });
		// }
	}

	// Handle mouse enter
	function handleMouseEnter() {
		isDropdownOpen = true;
	}

	// Handle mouse leave
	function handleMouseLeave() {
		// Add a small delay to allow mouse to reach dropdown
		setTimeout(() => {
			if (!isDropdownHovered) {
				isDropdownOpen = false;
			}
		}, 100);
	}

	// Handle dropdown mouse enter/leave
	function handleDropdownMouseEnter() {
		isDropdownHovered = true;
	}

	function handleDropdownMouseLeave() {
		isDropdownHovered = false;
		setTimeout(() => {
			if (!isDropdownHovered) {
				isDropdownOpen = false;
			}
		}, 100);
	}
	
	// Add focus and blur handlers for keyboard accessibility
	function handleFocus() {
		isDropdownOpen = true;
	}
	
	function handleBlur() {
		// Add a small delay to allow for clicking on dropdown items
		setTimeout(() => {
			isDropdownOpen = false;
		}, 150);
	}
</script>

<div 
	class="language-switcher {className}"
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
	onfocus={handleFocus}
	onblur={handleBlur}
	bind:this={dropdownContainer}
	role="button"
	tabindex="0"
>
	<!-- Current Language Button -->
	<div class="current-language">
		<span class="language-code">{getDisplayCode($currentLocale)}</span>
		<svg 
			class="chevron {isDropdownOpen ? 'rotated' : ''}"
			width="12" 
			height="12" 
			viewBox="0 0 24 24" 
			fill="none" 
			stroke="currentColor" 
			stroke-width="2"
		>
			<polyline points="6,9 12,15 18,9"></polyline>
		</svg>
	</div>

	<!-- Dropdown Menu -->
	{#if isDropdownOpen}
		<div
			class="dropdown-menu"
			role="menu"
			onmouseenter={handleDropdownMouseEnter}
			onmouseleave={handleDropdownMouseLeave}
		>
			{#each allLocales as locale (locale.code)}
				<button
					class="dropdown-item {locale.code === $currentLocale ? 'active' : ''}"
					onclick={() => handleLanguageSwitch(locale.code)}
					title="Switch to {locale.nativeName}"
				>
					<span class="flag">{locale.flag}</span>
					<span class="display-code">{getDisplayCode(locale.code)}</span>
					<span class="native-name">{locale.nativeName}</span>
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.language-switcher {
		position: relative;
		display: inline-block;
	}

	.current-language {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 8px 12px;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s ease;
		background: transparent;
		border: 1px solid transparent;
		color: #1a1a1a;
	}

	.current-language:hover {
		background: #f8f9fa;
		border-color: #e9ecef;
	}

	.language-code {
		font-family: 'Nunito', sans-serif;
		font-size: 14px;
		font-weight: 600;
		color: inherit;
		line-height: 1;
	}

	.chevron {
		transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		color: #6b7280;
		width: 12px;
		height: 12px;
	}

	.chevron.rotated {
		transform: rotate(180deg);
	}

	.dropdown-menu {
		position: absolute;
		top: 100%;
		right: 0;
		min-width: 160px;
		background: white;
		border: 1px solid #e5e7eb;
		border-radius: 12px;
		box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
		z-index: 50;
		overflow: hidden;
		padding: 4px;
		animation: fadeInUp 0.2s ease-out;
		margin-top: 2px;
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(8px) scale(0.95);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	.dropdown-item {
		display: flex;
		align-items: center;
		gap: 12px;
		width: 100%;
		padding: 10px 12px;
		border: none;
		background: transparent;
		cursor: pointer;
		transition: all 0.15s ease;
		border-radius: 8px;
		text-align: left;
		color: #374151;
	}

	.dropdown-item:hover {
		background: #f3f4f6;
		color: #1f2937;
	}

	.dropdown-item.active {
		background: #4B766E;
		color: white;
	}

	.dropdown-item.active:hover {
		background: #3a5d56;
	}

	.flag {
		font-size: 16px;
		line-height: 1;
		flex-shrink: 0;
	}

	.display-code {
		font-family: 'Nunito', sans-serif;
		font-size: 14px;
		font-weight: 600;
		min-width: 24px;
		color: inherit;
	}

	.native-name {
		font-family: 'Nunito', sans-serif;
		font-size: 13px;
		font-weight: 500;
		color: inherit;
		opacity: 0.8;
		flex: 1;
	}

	.dropdown-item.active .native-name {
		opacity: 1;
	}

	/* Responsive adjustments */
	@media (max-width: 640px) {
		.dropdown-menu {
			min-width: 140px;
			left: 0;
			right: auto;
			margin-top: 4px;
		}
	}
</style>
