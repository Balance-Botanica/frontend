<script lang="ts">
  import { colors } from '../colors';
  import { typography } from '../typography';
  import Input from './Input.svelte';
  import Button from './Button.svelte';
  import { m } from '$lib/paraglide/messages.js';
  
  // Import the actual SVG icons
  import waIcon from '../assets/icons/wa.svg';
  import tgIcon from '../assets/icons/tg.svg';
  import ttIcon from '../assets/icons/tt.svg';
  import igIcon from '../assets/icons/ig.svg';
  import fbIcon from '../assets/icons/fb.svg';
  
  export let companyName: string = 'Balance Botanica';
  
  let emailValue = '';
  
  const navigationLinks = [
    { href: '/shop', label: m['footer.navigation.shop']() },
    { href: '/about', label: m['footer.navigation.about']() },
    { href: '/terms', label: m['footer.navigation.terms']() },
    { href: '/contacts', label: m['footer.navigation.contacts']() },
    { href: '/blog', label: m['footer.navigation.blog']() }
  ];
  
  const socialLinks = [
    { href: '#', icon: fbIcon, label: m['footer.social.facebook']() },
    { href: '#', icon: igIcon, label: m['footer.social.instagram']() },
    { href: '#', icon: ttIcon, label: m['footer.social.tiktok']() },
    { href: '#', icon: tgIcon, label: m['footer.social.telegram']() },
    { href: '#', icon: waIcon, label: m['footer.social.whatsapp']() }
  ];
  
  function handleEmailChange(value: string) {
    emailValue = value;
  }
  
  function handleSubscribe() {
    if (emailValue) {
      console.log('Subscribing email:', emailValue);
      // TODO: Implement newsletter subscription
      emailValue = '';
    }
  }
</script>

<footer class="w-full" style="background-color: {colors.main};">
  <div class="max-w-7xl mx-auto px-6 py-12">
    <!-- Main Footer Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
      <!-- Company Info & Navigation -->
      <div class="lg:col-span-2">
        <!-- Logo Area -->
        <div class="mb-6">
          <div class="w-12 h-12 rounded-lg bg-white/20 mb-4"></div>
        </div>
        
        <!-- Navigation Links -->
        <div class="flex flex-wrap gap-6 mb-6">
          {#each navigationLinks as link}
            <a 
              href={link.href}
              class="text-white hover:opacity-80 transition-opacity"
              style="
                font-size: {typography.sizes.base};
                font-weight: {typography.weights.medium};
              "
            >
              {link.label}
            </a>
          {/each}
        </div>
        
        <!-- Company Description -->
        <p 
          class="text-white/80 max-w-lg leading-relaxed"
          style="
            font-size: {typography.sizes.base};
            font-weight: {typography.weights.regular};
            line-height: {typography.styles.p2.lineHeight};
          "
        >
          {m['footer.company.description']()}
        </p>
      </div>
      
      <!-- Newsletter Subscription -->
      <div class="lg:col-span-1">
        <h3 
          class="text-white mb-4 text-center lg:text-left"
          style="
            font-size: {typography.sizes.lg};
            font-weight: {typography.weights.medium};
            line-height: {typography.styles.h5.lineHeight};
          "
        >
          {m['footer.newsletter.title']()}
        </h3>
        
        <div class="flex flex-col sm:flex-row gap-3">
          <Input
            type="email"
            placeholder={m['footer.newsletter.placeholder']()}
            value={emailValue}
            onChange={handleEmailChange}
          />
          <Button
            variant="secondary"
            size="md"
            onClick={handleSubscribe}
          >
            {m['footer.newsletter.button']()}
          </Button>
        </div>
      </div>
    </div>
    
    <!-- Bottom Footer -->
    <div class="border-t border-white/20 pt-8">
      <div class="flex flex-col lg:flex-row justify-between items-center gap-6">
        <!-- Copyright & Legal -->
        <div class="text-center lg:text-left">
          <p 
            class="text-white/50 mb-2"
            style="
              font-size: {typography.sizes.sm};
              font-weight: {typography.weights.regular};
            "
          >
            {m['footer.legal.copyright']()}
          </p>
          <p 
            class="text-white/50"
            style="
              font-size: {typography.sizes.sm};
              font-weight: {typography.weights.regular};
            "
          >
            {m['footer.legal.terms_privacy']()}
          </p>
        </div>
        
        <!-- Social Icons -->
        <div class="flex items-center gap-4">
          {#each socialLinks as social}
            <a 
              href={social.href}
              class="w-6 h-6 flex items-center justify-center text-white hover:opacity-80 transition-opacity"
              aria-label={social.label}
            >
              <img 
                src={social.icon} 
                alt={social.label}
                class="w-6 h-6"
              />
            </a>
          {/each}
        </div>
      </div>
    </div>
  </div>
</footer>
