<script lang="ts">
	import { availableLocales, switchLocale } from '$lib/i18n/store';
	import type { SupportedLocale } from '$lib/i18n/types';

	// Props
	export let className: string = '';
	export let showFlags: boolean = true;
	export let showNames: boolean = true;

	// Обработчик переключения языка
	async function handleLanguageSwitch(locale: SupportedLocale) {
		await switchLocale(locale);
	}
</script>

<div class="flex items-center gap-2 {className}">
	{#each $availableLocales as locale (locale.code)}
		<button
			onclick={() => handleLanguageSwitch(locale.code)}
			class="flex items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-gray-100"
			aria-label="Switch to {locale.nativeName}"
			title="Switch to {locale.nativeName}"
		>
			{#if showFlags}
				<span class="text-lg">{locale.flag}</span>
			{/if}
			{#if showNames}
				<span class="text-sm font-medium">{locale.nativeName}</span>
			{/if}
		</button>
	{/each}
</div>
