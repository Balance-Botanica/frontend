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

<div class="relative flex flex-col items-center">
  <!-- Current Language Display -->
  <div class="text-center">
    <div 
      class="text-lg font-semibold"
      style="color: var(--color-heading); font-size: var(--font-size-lg); font-weight: var(--font-weight-semibold);"
    >
      {getLanguageDisplay(currentLanguage)} {getLanguageFullName(currentLanguage)}
    </div>
  </div>
</div>
