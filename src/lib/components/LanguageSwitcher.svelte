<script lang="ts">
  import { localeStore, type LanguageCode } from '../stores/locale.js';
  import { m } from '$lib/paraglide/messages.js';
  
  // Get current language from store
  $: currentLanguage = $localeStore;
  $: currentLanguageInfo = localeStore.getCurrentLanguageInfo();
  
  function handleLanguageChange(languageCode: LanguageCode) {
    localeStore.set(languageCode);
  }
  
  // Get display text for language codes
  function getLanguageDisplay(code: LanguageCode): string {
    return code === 'uk-ua' ? 'UA' : 'GB';
  }
  
  function getLanguageFullName(code: LanguageCode): string {
    return code === 'uk-ua' ? 'Ukrainian' : 'English';
  }
</script>

<div class="relative flex flex-col items-center space-y-3">
  <!-- Current Language Display -->
  <div class="text-center">
    <div 
      class="text-lg font-semibold"
      style="color: var(--color-heading); font-size: var(--font-size-lg); font-weight: var(--font-weight-semibold);"
    >
      {getLanguageDisplay(currentLanguage)} {getLanguageFullName(currentLanguage)}
    </div>
  </div>
  
  <!-- Language Selection Buttons -->
  <div class="flex space-x-2">
    {#each localeStore.getSupportedLanguages() as language}
      <button
        class="px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 {localeStore.isActive(language.code) 
          ? 'bg-main text-white shadow-md' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:shadow-sm'}"
        on:click={() => handleLanguageChange(language.code)}
        aria-label={`Switch to ${language.name}`}
        title={`Switch to ${language.name}`}
        style="
          font-size: var(--font-size-base);
          font-weight: var(--font-weight-medium);
          min-width: 48px;
        "
      >
        {getLanguageDisplay(language.code)}
      </button>
    {/each}
  </div>
</div>
