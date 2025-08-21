# Locale Management Dashboard

A comprehensive dashboard for managing application locales, internationalization settings, and user authentication with Firebase Phone Auth.

## Overview

The Locale Management Dashboard provides administrators and developers with a powerful interface to:

- Manage multiple locales (Ukrainian, English, German, Polish, Czech)
- Configure locale-specific settings (currency, date formats, RTL support)
- Authenticate users via phone number verification
- Monitor performance metrics and locale changes
- Control advanced i18n features

## Features

### 🔐 Firebase Phone Authentication

- **Phone Number Verification**: SMS-based authentication with 6-digit OTP
- **reCAPTCHA Protection**: Prevents abuse and bot attacks
- **Secure Sessions**: Firebase Auth handles user sessions
- **Cost-Effective**: Free tier includes 10,000 SMS/month

### 🌍 Multi-Locale Support

- **5 Supported Locales**: Ukrainian (primary), English, German, Polish, Czech
- **Priority System**: Configurable locale priority for fallbacks
- **RTL Support**: Right-to-left language support (Arabic, Hebrew ready)
- **Currency Integration**: Locale-specific currency symbols and formatting

### ⚙️ Advanced Configuration

- **Performance Metrics**: Track locale loading times and bundle sizes
- **Accessibility Features**: Screen reader and keyboard navigation support
- **SEO Optimization**: Hreflang tags and alternate URL management
- **Fallback Chains**: Intelligent locale fallback system

### 📊 Real-time Monitoring

- **Current Locale Display**: Visual representation of active locale
- **Change History**: Track all locale changes with timestamps
- **Performance Tracking**: Monitor locale switching performance
- **User Activity**: Track authentication and locale preferences

## Architecture

### Frontend Components

```
src/lib/components/
├── PhoneAuth.svelte          # Phone authentication component
├── Button.svelte             # Reusable button component
├── Switch.svelte             # Toggle switch component
├── Checkbox.svelte           # Checkbox component
├── RadioGroup.svelte         # Radio button group
└── Radio.svelte              # Individual radio button
```

### Firebase Integration

```
src/lib/firebase/
├── config.ts                 # Firebase configuration
├── auth.ts                   # Authentication store and functions
└── types.ts                  # TypeScript interfaces
```

### Internationalization System

```
src/lib/i18n/
├── config.ts                 # Locale configurations
├── types.ts                  # TypeScript interfaces
└── store.ts                  # Advanced locale store
```

## Usage

### Accessing the Dashboard

1. Navigate to `/locale-management` in your application
2. Sign in using phone authentication (required for access)
3. Use the dashboard to manage locales and settings

### Phone Authentication Flow

1. **Phone Input**: Enter phone number in E.164 format (+380501234567)
2. **SMS Verification**: Receive 6-digit code via SMS
3. **Code Verification**: Enter the received code
4. **Authentication**: Access granted upon successful verification

### Locale Management

1. **View Current Locale**: See active locale with detailed information
2. **Switch Locales**: Click on any supported locale to activate it
3. **Configure Settings**: Toggle advanced features and options
4. **Monitor Performance**: Track metrics and locale changes

## Configuration

### Environment Variables

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
```

### Locale Configuration

```typescript
export const SUPPORTED_LOCALES = {
	'uk-ua': {
		code: 'uk-ua',
		iso: 'uk',
		country: 'UA',
		name: 'Українська',
		nativeName: 'Українська',
		flag: '🇺🇦',
		rtl: false,
		currency: 'UAH',
		currencySymbol: '₴',
		priority: 1
	}
	// ... more locales
};
```

## Security Features

### Authentication Security

- **Phone Verification**: Only verified phone numbers can access
- **reCAPTCHA Protection**: Prevents automated attacks
- **Rate Limiting**: Firebase handles SMS rate limiting
- **Session Management**: Secure session handling

### Data Protection

- **Environment Variables**: Sensitive data stored securely
- **Input Validation**: Comprehensive input sanitization
- **Error Handling**: Secure error messages without data leakage

## Performance

### Optimization Features

- **Lazy Loading**: Locales loaded on-demand
- **Caching**: Intelligent caching of locale data
- **Bundle Splitting**: Separate bundles for different locales
- **Performance Metrics**: Real-time performance monitoring

### Scalability

- **30+ Locale Support**: Designed to handle enterprise-scale localization
- **Modular Architecture**: Easy to add new locales and features
- **Performance Tracking**: Monitor and optimize locale performance

## Troubleshooting

### Common Issues

1. **Firebase Configuration**
   - Verify environment variables are set correctly
   - Check Firebase project settings and API keys
   - Ensure Phone Authentication is enabled

2. **SMS Delivery**
   - Verify phone number format (E.164)
   - Check Firebase billing status
   - Ensure reCAPTCHA is configured

3. **Locale Switching**
   - Check browser console for errors
   - Verify locale configuration files
   - Ensure Paraglide integration is working

### Debug Mode

Enable debug mode by setting:

```typescript
// In development
console.log('Current locale:', $currentLocale);
console.log('Available locales:', getEnabledLocales());
```

## Development

### Adding New Locales

1. **Update Configuration**: Add locale to `SUPPORTED_LOCALES`
2. **Add Translations**: Create message files for new locale
3. **Test Integration**: Verify locale switching works correctly
4. **Update Documentation**: Document new locale features

### Customizing Components

1. **Styling**: Modify Tailwind classes for custom appearance
2. **Functionality**: Extend component props and events
3. **Integration**: Connect to external services and APIs

## Deployment

### Production Setup

1. **Firebase Configuration**: Use production Firebase project
2. **Environment Variables**: Set production environment variables
3. **Domain Configuration**: Add production domain to Firebase
4. **SSL Certificate**: Ensure HTTPS for production

### Monitoring

1. **Performance Metrics**: Track locale loading performance
2. **Error Logging**: Monitor authentication and locale errors
3. **User Analytics**: Track locale usage and preferences

## Support

### Documentation

- [Firebase Setup Guide](./FIREBASE_SETUP.md)
- [Locale System Documentation](./LANGUAGE_SYSTEM.md)
- [Component Library Documentation](./COMPONENTS.md)

### Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [SvelteKit Documentation](https://kit.svelte.dev/docs)
- [Paraglide JS Documentation](https://inlang.com/m/gerre34r/library-inlang-paraglideJs)

### Community

- [GitHub Issues](https://github.com/your-repo/issues)
- [Discord Community](https://discord.gg/your-community)
- [Documentation Wiki](https://github.com/your-repo/wiki)
