# Language Switching System

## Overview

The Balance Botanica website implements a production-ready, comprehensive language switching system that works across all pages and components. The system is built on Svelte stores and integrates seamlessly with Paraglide JS for internationalization.

## Features

### ✅ **Production Ready**

- **Persistent Language Selection**: Language choice is saved to localStorage and persists across browser sessions
- **Browser Language Detection**: Automatically detects user's preferred language on first visit
- **Fallback Handling**: Graceful fallback to default language (Ukrainian) if browser language is unsupported
- **Accessibility**: Proper ARIA labels, document language attributes, and keyboard navigation

### ✅ **Cross-Page Functionality**

- **Global State Management**: Language state is managed centrally and accessible from any component
- **Real-time Updates**: All components automatically update when language changes
- **No Page Reloads**: Seamless language switching without losing user context

### ✅ **Component Integration**

- **Header Navigation**: All navigation links update to selected language
- **Footer Content**: Company information, links, and newsletter text are fully translated
- **SubHeader**: Delivery information banner updates automatically
- **Form Elements**: Input placeholders, button text, and validation messages

## Architecture

### Core Components

#### 1. **Locale Store** (`src/lib/stores/locale.ts`)

```typescript
// Central state management for language
export const localeStore = createLocaleStore();

// Key methods:
localeStore.set('uk'); // Set specific language
localeStore.toggle(); // Toggle between languages
localeStore.getCurrentLanguageInfo(); // Get current language details
```

#### 2. **Language Switcher Component** (`src/lib/components/LanguageSwitcher.svelte`)

```svelte
<!-- Reusable component with hover effects and accessibility -->
<LanguageSwitcher />
```

#### 3. **Paraglide Integration** (`src/lib/paraglide/`)

```typescript
// Automatic language switching in Paraglide
import { m } from '$lib/paraglide/messages.js';
m['header.navigation.shop'](); // Returns text in current language
```

## Supported Languages

| Code | Name       | Flag | Locale |
| ---- | ---------- | ---- | ------ |
| `uk` | Українська | 🇺🇦   | uk-UA  |
| `en` | English    | 🇬🇧   | en-GB  |

## Usage Examples

### Basic Language Switching

```svelte
<script>
	import { localeStore } from '$lib/stores/locale.js';

	function switchToEnglish() {
		localeStore.set('en');
	}

	function toggleLanguage() {
		localeStore.toggle();
	}
</script>

<button on:click={switchToEnglish}>Switch to English</button>
<button on:click={toggleLanguage}>Toggle Language</button>
```

### Reactive Language Display

```svelte
<script>
	import { localeStore } from '$lib/stores/locale.js';

	$: currentLanguage = $localeStore;
	$: languageInfo = localeStore.getCurrentLanguageInfo();
</script>

<div>
	Current: {languageInfo?.flag}
	{languageInfo?.name}
	Code: {currentLanguage}
</div>
```

### Component Integration

```svelte
<script>
	import { m } from '$lib/paraglide/messages.js';
	import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
</script>

<header>
	<nav>
		<a href="/shop">{m['header.navigation.shop']()}</a>
		<a href="/about">{m['header.navigation.about']()}</a>
	</nav>

	<LanguageSwitcher />
</header>
```

## Implementation Details

### State Persistence

- **localStorage Key**: `balance-botanica-locale`
- **Fallback Chain**: localStorage → browser language → default (uk)
- **Automatic Sync**: Paraglide runtime is automatically updated when language changes

### Performance Optimizations

- **Reactive Updates**: Only components that use translations re-render
- **Efficient Store**: Minimal memory footprint with optimized subscription handling
- **Lazy Loading**: Translation files are loaded on-demand

### Accessibility Features

- **ARIA Labels**: Proper labeling for screen readers
- **Document Language**: HTML lang attribute updates automatically
- **Keyboard Navigation**: Full keyboard support for language switching
- **Focus Management**: Proper focus handling during language changes

## Testing

### Demo Page

Visit `/language-demo` to test the complete language switching functionality:

- Real-time language switching
- Component updates across all sections
- Persistent language selection
- Browser language detection

### Manual Testing

1. **Switch Languages**: Use the language switcher in the header
2. **Navigate Pages**: Verify language persists across navigation
3. **Refresh Browser**: Confirm language choice is remembered
4. **Clear Storage**: Test fallback to browser language

## Future Enhancements

### Planned Features

- **URL-based Language**: Support for `/uk/shop` vs `/en/shop` URLs
- **SEO Optimization**: Language-specific meta tags and structured data
- **RTL Support**: Right-to-left language support for future languages
- **Analytics**: Track language preferences and usage patterns

### Extensibility

- **New Languages**: Easy addition of new supported languages
- **Custom Locales**: Support for region-specific variations (uk-UA, uk-CA)
- **Translation Management**: Integration with translation management systems

## Troubleshooting

### Common Issues

#### Language Not Persisting

```typescript
// Check if localStorage is available
if (browser) {
	console.log('Stored language:', localStorage.getItem('balance-botanica-locale'));
}
```

#### Components Not Updating

```svelte
<!-- Ensure proper store subscription -->
<script>
	import { localeStore } from '$lib/stores/locale.js';
	$: currentLang = $localeStore; // Reactive statement
</script>
```

#### Translation Keys Missing

```typescript
// Check if translation exists
import { m } from '$lib/paraglide/messages.js';
console.log('Available keys:', Object.keys(m));
```

### Debug Mode

```typescript
// Enable debug logging
if (browser && import.meta.env.DEV) {
	localeStore.subscribe((lang) => {
		console.log('Language changed to:', lang);
	});
}
```

## Contributing

### Adding New Languages

1. **Update `SUPPORTED_LANGUAGES`** in `locale.ts`
2. **Add translation files** in `messages/` directory
3. **Update Paraglide config** if needed
4. **Test thoroughly** across all components

### Translation Guidelines

- **Keep Keys Consistent**: Use dot notation (e.g., `header.navigation.shop`)
- **Context Matters**: Provide context for translators
- **Pluralization**: Handle plural forms appropriately
- **Cultural Sensitivity**: Consider cultural differences in translations

---

This language system provides a solid foundation for internationalization while maintaining excellent performance and user experience. The architecture is designed to scale with future requirements and integrate seamlessly with the existing component system.
