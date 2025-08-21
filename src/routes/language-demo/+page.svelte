<script lang="ts">
	import { localeStore, type Language } from '$lib/stores/locale.js';
	import { t } from '$lib/i18n';
	import {
		Header,
		SubHeader,
		Footer,
		LanguageSwitcher,
		Button,
		Typography
	} from '$lib/components/index.js';

	$: currentLanguage = $localeStore;

	// Define supported languages
	const SUPPORTED_LANGUAGES: Array<{ code: Language; name: string; flag: string }> = [
		{ code: 'uk-ua', name: 'Українська', flag: '🇺🇦' },
		{ code: 'en', name: 'English', flag: '🇺🇸' }
	];

	function getCurrentLanguageInfo() {
		return SUPPORTED_LANGUAGES.find((lang) => lang.code === currentLanguage);
	}

	function isActive(code: Language) {
		return currentLanguage === code;
	}
</script>

<svelte:head>
	<title>Language Switching Demo - Balance Botanica</title>
</svelte:head>

<div class="min-h-screen bg-background">
	<!-- Show the full layout with language switching -->
	<Header />
	<SubHeader />

	<main class="mx-auto max-w-7xl px-6 py-12">
		<div class="mb-12 text-center">
			<h1 class="mb-4 text-4xl font-bold" style="color: var(--color-heading);">
				Language Switching Demo
			</h1>
			<p class="text-lg" style="color: var(--color-text);">
				Test the language switching functionality across all components
			</p>
		</div>

		<!-- Language Status -->
		<div class="mb-8 rounded-lg bg-white p-6 shadow-md">
			<h2 class="mb-4 text-2xl font-semibold" style="color: var(--color-heading);">
				Current Language Status
			</h2>
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<div class="rounded-lg bg-gray-50 p-4 text-center">
					<div class="mb-2 text-4xl">{getCurrentLanguageInfo()?.flag}</div>
					<div class="text-lg font-medium" style="color: var(--color-heading);">
						{getCurrentLanguageInfo()?.name}
					</div>
					<div class="text-sm" style="color: var(--color-text);">
						Code: {currentLanguage}
					</div>
				</div>

				<div class="rounded-lg bg-gray-50 p-4 text-center">
					<div class="mb-2 text-lg font-medium" style="color: var(--color-heading);">
						Available Languages
					</div>
					<div class="flex justify-center space-x-2">
						{#each SUPPORTED_LANGUAGES as language}
							<button
								class="rounded-lg px-3 py-2 transition-all duration-200 hover:scale-110 {isActive(
									language.code
								)
									? 'bg-main text-white shadow-lg'
									: 'bg-gray-200 text-gray-700 hover:bg-gray-300'}"
								on:click={() => localeStore.set(language.code)}
								title={`Switch to ${language.name}`}
							>
								{language.flag}
								{language.name}
							</button>
						{/each}
					</div>
				</div>
			</div>
		</div>

		<!-- Component Examples -->
		<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
			<!-- Typography Examples -->
			<div class="rounded-lg bg-white p-6 shadow-md">
				<h3 class="mb-4 text-xl font-semibold" style="color: var(--color-heading);">
					Typography System
				</h3>
				<Typography />
			</div>

			<!-- Language Switcher Examples -->
			<div class="rounded-lg bg-white p-6 shadow-md">
				<h3 class="mb-4 text-xl font-semibold" style="color: var(--color-heading);">
					Language Switcher Component
				</h3>
				<div class="space-y-4">
					<div>
						<h4 class="mb-2 font-medium" style="color: var(--color-text);">Main Switcher:</h4>
						<LanguageSwitcher />
					</div>
					<div>
						<h4 class="mb-2 font-medium" style="color: var(--color-text);">Direct Buttons:</h4>
						<div class="flex space-x-2">
							{#each SUPPORTED_LANGUAGES as language}
								<button
									class="rounded-lg px-4 py-2 transition-all duration-200 hover:scale-105 {isActive(
										language.code
									)
										? 'bg-main text-white'
										: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
									on:click={() => localeStore.set(language.code)}
								>
									{language.flag}
								</button>
							{/each}
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Footer Test -->
		<div class="mt-12">
			<Footer />
		</div>
	</main>
</div>
