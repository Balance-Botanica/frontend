<script lang="ts">
  import { colors } from '../colors';
  import { typography } from '../typography';
  import { m } from '$lib/paraglide/messages.js';
  import LanguageSwitcher from './LanguageSwitcher.svelte';
  import Logo from './Logo.svelte';
  
  // Import icons
  import personIcon from '../assets/icons/person.svg';
  import cartIcon from '../assets/icons/cart.svg';
  
  const navigationLinks = [
    { href: '/shop', label: m['header.navigation.shop']() },
    { href: '/about', label: m['header.navigation.about']() },
    { href: '/contacts', label: m['header.navigation.contacts']() },
    { href: '/blog', label: m['header.navigation.blog']() }
  ];
  
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
        <Logo size="default" />
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
      <LanguageSwitcher />
      
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
