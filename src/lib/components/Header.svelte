<script lang="ts">
  import { colors } from '../colors';
  import { typography } from '../typography';
  import { m } from '$lib/paraglide/messages.js';
  
  // Import logo and icons
  import logoText from '../assets/icons/logo-text.svg';
  import personIcon from '../assets/icons/person.svg';
  import cartIcon from '../assets/icons/cart.svg';
  
  // Language switcher state
  let currentLanguage = 'uk';
  
  const languages = [
    { code: 'uk', name: m['header.language.uk'](), flag: '🇺🇦' },
    { code: 'en', name: m['header.language.en'](), flag: '🇬🇧' }
  ];
  
  const navigationLinks = [
    { href: '/shop', label: m['header.navigation.shop']() },
    { href: '/about', label: m['header.navigation.about']() },
    { href: '/contacts', label: m['header.navigation.contacts']() },
    { href: '/blog', label: m['header.navigation.blog']() }
  ];
  
  function handleLanguageChange(langCode: string) {
    currentLanguage = langCode;
    // TODO: Implement actual language switching logic
    console.log('Language changed to:', langCode);
  }
  
  function handlePersonClick() {
    // TODO: Navigate to account/login page
    console.log('Person icon clicked');
  }
  
  function handleCartClick() {
    // TODO: Navigate to cart page
    console.log('Cart icon clicked');
  }
</script>

<header 
  class="w-full bg-white border-b border-stroke"
  style="height: 80px;"
>
  <div class="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
    <!-- Logo -->
    <div class="flex items-center">
      <a href="/" class="flex items-center">
        <img 
          src={logoText} 
          alt="Balance Botanica" 
          class="h-12 w-auto"
        />
      </a>
    </div>
    
    <!-- Navigation Menu -->
    <nav class="hidden md:flex items-center space-x-8">
      {#each navigationLinks as link}
        <a 
          href={link.href}
          class="text-base font-medium transition-colors duration-200 hover:text-main"
          style="
            color: {colors.heading};
            font-size: {typography.sizes.base};
            font-weight: {typography.weights.medium};
            line-height: {typography.styles.linkButtonMedium.lineHeight};
          "
        >
          {link.label}
        </a>
      {/each}
    </nav>
    
    <!-- Right Side Actions -->
    <div class="flex items-center space-x-4">
      <!-- Language Switcher -->
      <div class="relative">
        <button
          class="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:scale-105 hover:shadow-sm"
          on:click={() => handleLanguageChange(currentLanguage === 'uk' ? 'en' : 'uk')}
          aria-label={m['header.accessibility.change_language']()}
        >
          <span class="text-lg">
            {languages.find(lang => lang.code === currentLanguage)?.flag}
          </span>
          <span 
            class="text-sm font-medium"
            style="color: {colors.heading}; font-size: {typography.sizes.sm}; font-weight: {typography.weights.medium};"
          >
            {languages.find(lang => lang.code === currentLanguage)?.name}
          </span>
          <svg 
            class="w-4 h-4 ml-1 transition-transform duration-200 group-hover:rotate-180" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            style="color: {colors.heading};"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
      </div>
      
      <!-- Action Icons -->
      <div class="flex items-center space-x-2">
        <!-- Person/Account Icon -->
        <button
          class="w-12 h-12 rounded-full bg-main flex items-center justify-center hover:bg-main-additional transition-all duration-200 hover:scale-110 hover:shadow-lg cursor-pointer"
          on:click={handlePersonClick}
          aria-label={m['header.accessibility.account']()}
        >
          <img 
            src={personIcon} 
            alt="Account" 
            class="w-6 h-6 transition-transform duration-200 hover:scale-110"
          />
        </button>
        
        <!-- Cart Icon -->
        <button
          class="w-12 h-12 rounded-full bg-main flex items-center justify-center hover:bg-main-additional transition-all duration-200 hover:scale-110 hover:shadow-lg cursor-pointer"
          on:click={handleCartClick}
          aria-label={m['header.accessibility.shopping_cart']()}
        >
          <img 
            src={cartIcon} 
            alt="Cart" 
            class="w-6 h-6 transition-transform duration-200 hover:scale-110"
          />
        </button>
      </div>
    </div>
  </div>
</header>
