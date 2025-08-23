# 🍪 Cookie Consent System

A complete, production-ready cookie consent implementation for the Balance Botanica e-commerce platform, built with SvelteKit and following GDPR/ePrivacy directive requirements.

## 📋 Overview

This cookie consent system provides:
- **GDPR Compliant** - Granular consent for different cookie types
- **Production Ready** - No debug code, clean implementation
- **Multi-language Support** - Ukrainian and English translations
- **Persistent Storage** - Remembers user choices across sessions
- **Responsive Design** - Works on all device sizes
- **Developer Friendly** - Easy integration with analytics and marketing tools

## 🚀 Features

### ✅ Core Functionality
- [x] **Auto-show on first visit** - Banner appears when no previous choice made
- [x] **Persistent user choice** - Stores preferences in localStorage
- [x] **Three consent levels**: None, Necessary only, All cookies
- [x] **Granular controls** - Statistics and Marketing toggles
- [x] **Reset functionality** - Admin can reset user choices
- [x] **Clean UI/UX** - Smooth animations and intuitive interface

### ✅ Cookie Categories
1. **Necessary** (Always enabled) - Essential for website functionality
2. **Statistics** (Optional) - Analytics, performance monitoring
3. **Marketing** (Optional) - Advertising, social media integration

### ✅ Integration Ready
- Google Analytics integration helper
- Facebook Pixel integration helper
- Custom script loader with consent validation
- Event tracking with consent respect

## 📁 File Structure

```
src/lib/
├── stores/
│   └── cookie-consent.ts          # Main store and state management
├── components/
│   └── CookieConsent.svelte       # UI component
└── utils/
    └── cookie-helpers.ts          # Production utilities

src/routes/
└── +layout.svelte                 # Component integration

src/messages/
├── en.json                        # English translations
└── uk-ua.json                     # Ukrainian translations

static/icons/
└── cookie.svg                     # Cookie icon
```

## 🔧 Implementation

### 1. Basic Integration

The cookie consent is already integrated in `+layout.svelte`:

```svelte
<!-- In your layout file -->
<CookieConsent />
```

### 2. Using Cookie Helpers

```typescript
import { 
  AnalyticsManager, 
  MarketingManager, 
  ConsentChecker,
  CookieExamples 
} from '$lib/utils/cookie-helpers';

// Initialize tracking based on user consent
CookieExamples.initializeTracking();

// Track events (respects user consent)
CookieExamples.trackPageView('/products');
CookieExamples.trackPurchase('order-123', 299.99);

// Check consent status
if (ConsentChecker.hasFullConsent()) {
  // User allowed all cookies
}

if (ConsentChecker.isAllowed('statistics')) {
  // Analytics tracking allowed
}
```

### 3. Loading Third-party Scripts

```typescript
import { ScriptLoader } from '$lib/utils/cookie-helpers';

// Load Google Analytics (requires statistics consent)
await ScriptLoader.loadGoogleAnalytics('GA_MEASUREMENT_ID');

// Load Facebook Pixel (requires marketing consent)
await ScriptLoader.loadFacebookPixel('FACEBOOK_PIXEL_ID');

// Load custom script with consent requirement
await ScriptLoader.loadScript(
  'https://example.com/script.js',
  'marketing'  // Requires marketing consent
);
```

## 🎛️ Store API

### State Management

```typescript
import { 
  cookieConsentStore,
  showCookieConsent,
  hideCookieConsent,
  acceptAll,
  acceptNecessary,
  resetCookieConsent
} from '$lib/stores/cookie-consent';

// Show consent banner
showCookieConsent();

// Accept all cookies
acceptAll();

// Accept only necessary cookies
acceptNecessary();

// Reset user choice (shows banner again)
resetCookieConsent();
```

### Status Checking

```typescript
import { 
  getCookieStatus,
  getCookieSettings,
  isCookieAllowed 
} from '$lib/stores/cookie-consent';

// Get current status: 'none' | 'necessary' | 'all'
const status = getCookieStatus();

// Get detailed settings
const settings = getCookieSettings();
// Returns: { necessary: true, statistics: boolean, marketing: boolean }

// Check specific cookie type
const canTrack = isCookieAllowed('statistics');
```

## 🌍 Internationalization

The system supports Ukrainian (default) and English:

### English (`src/messages/en.json`)
```json
{
  "cookie_consent": {
    "title": "We use cookies",
    "description": "We use cookies and similar technologies...",
    "accept_necessary": "Accept Necessary",
    "accept_all": "Accept All"
  }
}
```

### Ukrainian (`src/messages/uk-ua.json`)
```json
{
  "cookie_consent": {
    "title": "Ми використовуємо cookies",
    "description": "Ми використовуємо cookies...",
    "accept_necessary": "Прийняти необхідне",
    "accept_all": "Прийняти все"
  }
}
```

## 🎨 Customization

### Styling

The component uses Tailwind CSS classes and can be customized by modifying `CookieConsent.svelte`:

- **Position**: Currently bottom-right, change container classes
- **Colors**: Green theme (#059669), modify CSS variables
- **Size**: Responsive design, adjust width/height classes
- **Animation**: Smooth slide-in, modify transition classes

### Behavior

Customize behavior by modifying the store functions:

```typescript
// Custom auto-show delay
setTimeout(() => showCookieConsent(), 2000); // 2 seconds

// Custom storage key
localStorage.setItem('my-custom-consent', JSON.stringify(state));
```

## 📊 Usage Examples

### E-commerce Tracking

```typescript
// Track product view
CookieExamples.trackPageView('/products/cbd-oil');

// Track add to cart (if analytics allowed)
AnalyticsManager.trackEvent('add_to_cart', {
  item_id: 'product-123',
  item_name: 'CBD Oil',
  value: 29.99
});

// Track purchase (if marketing allowed)
MarketingManager.trackConversion('Purchase', {
  value: 299.99,
  currency: 'UAH'
});
```

### Development Testing

```typescript
// Reset consent for testing
resetCookieConsent(); // Shows banner again

// Check current status
console.log(ConsentChecker.getConsentSummary());
// Output: { status: 'all', hasConsent: true, allowedTypes: ['necessary', 'statistics', 'marketing'] }
```

## 🔒 GDPR Compliance

This implementation follows GDPR requirements:

✅ **Consent before tracking** - No cookies set until user consents  
✅ **Granular control** - Users can choose cookie categories  
✅ **Easy withdrawal** - Users can change preferences anytime  
✅ **Clear information** - Detailed descriptions of cookie purposes  
✅ **Necessary cookies only** - Essential cookies clearly marked  
✅ **Persistent choice** - Consent remembered across sessions  

## 🚀 Production Deployment

### Before Going Live

1. **Remove development code** ✅ Already done
2. **Test all consent scenarios** ✅ Ready for testing
3. **Verify translations** ✅ Ukrainian + English supported
4. **Configure analytics IDs** - Update your tracking IDs
5. **Test with real domains** - Ensure localStorage works

### Performance

- **Lightweight** - Minimal JavaScript footprint
- **Lazy loading** - Third-party scripts load only with consent
- **Efficient storage** - Single localStorage key
- **No external dependencies** - Self-contained implementation

## 🛠️ Maintenance

### Adding New Cookie Types

1. Update `CookieSettings` interface in `cookie-consent.ts`
2. Add new toggle in `CookieConsent.svelte`
3. Add translations in message files
4. Update helper functions in `cookie-helpers.ts`

### Integrating New Services

```typescript
// Add to MarketingManager or AnalyticsManager
static initializeNewService() {
  withMarketingConsent(() => {
    // Initialize your service
    console.log('🎯 New service initialized');
  });
}
```

## 📝 Notes

- **Browser Support**: Works in all modern browsers with localStorage
- **Server-Side Rendering**: Gracefully handles SSR (no cookies on server)
- **Mobile Friendly**: Responsive design adapts to all screen sizes
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Clean Code**: No TODO items, production-ready implementation

---

*Built with ❤️ for Balance Botanica - Production-ready cookie consent system*