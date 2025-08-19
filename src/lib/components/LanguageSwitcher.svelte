<script lang="ts">
	import { localeStore } from '$lib/stores/locale.js';
	
	let currentLanguage: string;
	
	localeStore.subscribe(value => {
		currentLanguage = value;
	});

	function handleLanguageToggle(event: MouseEvent | KeyboardEvent) {
		event.preventDefault();
		event.stopPropagation();
		localeStore.toggle();
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			handleLanguageToggle(event);
		}
	}
</script>

<div
	role="button"
	tabindex="0"
	on:click={handleLanguageToggle}
	on:keydown={handleKeyDown}
	class="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:opacity-80 transition-opacity duration-200"
>
	<span class="text-base font-medium">
		{currentLanguage === 'uk-ua' ? '🇺🇦' : '🇬🇧'}
	</span>
	<span class="text-base font-medium">
		{currentLanguage === 'uk-ua' ? 'UA' : 'EN'}
	</span>
</div>
