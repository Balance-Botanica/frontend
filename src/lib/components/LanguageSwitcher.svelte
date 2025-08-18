<script lang="ts">
  import { localeStore, type LanguageCode } from '../stores/locale.js';
  import { m } from '$lib/paraglide/messages.js';
  
  // Get current language from store
  $: currentLanguage = $localeStore;
  $: currentLanguageInfo = localeStore.getCurrentLanguageInfo();
  
  function handleLanguageChange() {
    localeStore.toggle();
  }
  
  function handleSpecificLanguageChange(languageCode: LanguageCode) {
    localeStore.set(languageCode);
  }
</script>

<div class="relative">
  <button
    class="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 hover:border hover:border-stroke transition-all duration-200 hover:scale-105 hover:shadow-sm cursor-pointer"
    on:click={handleLanguageChange}
    aria-label={m['header.accessibility.change_language']()}
    title={`${m['header.accessibility.change_language']()} (${currentLanguageInfo?.name})`}
  >
    <span class="text-lg">
      {currentLanguageInfo?.flag}
    </span>
    <span 
      class="text-sm font-medium"
      style="color: var(--color-heading); font-size: var(--font-size-sm); font-weight: var(--font-weight-medium);"
    >
      {currentLanguageInfo?.name}
    </span>
  </button>
  
  <!-- Alternative: Direct language selection buttons -->
  <div class="hidden md:flex items-center space-x-1 ml-2">
    {#each localeStore.getSupportedLanguages() as language}
      <button
        class="px-2 py-1 rounded text-xs transition-all duration-200 hover:scale-110 {localeStore.isActive(language.code) ? 'bg-main text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}"
        on:click={() => handleSpecificLanguageChange(language.code)}
        aria-label={`Switch to ${language.name}`}
        title={`Switch to ${language.name}`}
      >
        {language.flag}
      </button>
    {/each}
  </div>
</div>
