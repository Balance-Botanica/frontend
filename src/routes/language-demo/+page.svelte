<script lang="ts">
  import { localeStore, SUPPORTED_LANGUAGES } from '$lib/stores/locale.js';
  import { m } from '$lib/paraglide/messages.js';
  import { 
    Header, 
    SubHeader, 
    Footer, 
    LanguageSwitcher,
    Button,
    Typography 
  } from '$lib/components/index.js';
  
  $: currentLanguage = $localeStore;
  $: currentLanguageInfo = localeStore.getCurrentLanguageInfo();
</script>

<svelte:head>
  <title>Language Switching Demo - Balance Botanica</title>
</svelte:head>

<div class="min-h-screen bg-background">
  <!-- Show the full layout with language switching -->
  <Header />
  <SubHeader />
  
  <main class="max-w-7xl mx-auto px-6 py-12">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold mb-4" style="color: var(--color-heading);">
        Language Switching Demo
      </h1>
      <p class="text-lg" style="color: var(--color-text);">
        Test the language switching functionality across all components
      </p>
    </div>
    
    <!-- Language Status -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 class="text-2xl font-semibold mb-4" style="color: var(--color-heading);">
        Current Language Status
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="text-center p-4 bg-gray-50 rounded-lg">
          <div class="text-4xl mb-2">{currentLanguageInfo?.flag}</div>
          <div class="text-lg font-medium" style="color: var(--color-heading);">
            {currentLanguageInfo?.name}
          </div>
          <div class="text-sm" style="color: var(--color-text);">
            Code: {currentLanguage}
          </div>
        </div>
        
        <div class="text-center p-4 bg-gray-50 rounded-lg">
          <div class="text-lg font-medium mb-2" style="color: var(--color-heading);">
            Available Languages
          </div>
          <div class="flex justify-center space-x-2">
            {#each SUPPORTED_LANGUAGES as language}
              <button
                class="px-3 py-2 rounded-lg transition-all duration-200 hover:scale-110 {localeStore.isActive(language.code) ? 'bg-main text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}"
                on:click={() => localeStore.set(language.code)}
                title={`Switch to ${language.name}`}
              >
                {language.flag} {language.name}
              </button>
            {/each}
          </div>
        </div>
      </div>
    </div>
    
    <!-- Component Examples -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Typography Examples -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-xl font-semibold mb-4" style="color: var(--color-heading);">
          Typography System
        </h3>
        <Typography />
      </div>
      
      <!-- Language Switcher Examples -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-xl font-semibold mb-4" style="color: var(--color-heading);">
          Language Switcher Component
        </h3>
        <div class="space-y-4">
          <div>
            <h4 class="font-medium mb-2" style="color: var(--color-text);">Main Switcher:</h4>
            <LanguageSwitcher />
          </div>
          <div>
            <h4 class="font-medium mb-2" style="color: var(--color-text);">Direct Buttons:</h4>
            <div class="flex space-x-2">
              {#each SUPPORTED_LANGUAGES as language}
                <button
                  class="px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 {localeStore.isActive(language.code) ? 'bg-main text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
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
