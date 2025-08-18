<script lang="ts">
  import { localeStore, type LanguageCode } from '../stores/locale.js';
  import { m } from '$lib/paraglide/messages.js';
  
  // Get current language from store
  $: currentLanguage = $localeStore;
  $: currentLanguageInfo = localeStore.getCurrentLanguageInfo();
  
  function handleLanguageToggle(event: MouseEvent | KeyboardEvent) {
    event.preventDefault();
    event.stopPropagation();
    console.log('🔍 [DEBUG] Language toggle clicked, preventing default behavior');
    console.log('🔍 [DEBUG] Event type:', event.type);
    console.log('🔍 [DEBUG] Event target:', event.target);
    console.log('🔍 [DEBUG] Current URL before toggle:', window.location.href);
    
    // Test without store first
    console.log('🔍 [DEBUG] About to call localeStore.toggle()');
    try {
      localeStore.toggle();
      console.log('✅ [DEBUG] localeStore.toggle() completed successfully');
    } catch (error) {
      console.error('❌ [DEBUG] Error in localeStore.toggle():', error);
    }
    
    console.log('🔍 [DEBUG] Current URL after toggle:', window.location.href);
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
  <!-- Current Language Display - Simple label style matching Figma -->
  <div
    role="button"
    tabindex="0"
    class="text-center px-3 py-2 cursor-pointer hover:opacity-80 transition-opacity duration-200"
    on:click={handleLanguageToggle}
    on:keydown={(e) => e.key === 'Enter' && handleLanguageToggle(e)}
    aria-label={m['header.accessibility.change_language']()}
    title={`${m['header.accessibility.change_language']()} (Click to toggle)`}
  >
    <div 
      class="text-base font-medium"
      style="color: var(--color-heading); font-size: var(--font-size-base); font-weight: var(--font-weight-medium);"
    >
      {getLanguageDisplay(currentLanguage)} {getLanguageFullName(currentLanguage)}
    </div>
  </div>
</div>
