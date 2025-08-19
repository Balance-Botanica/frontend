# Firebase Phone Authentication Setup

This guide will help you set up Firebase Phone Authentication for the Balance Botanica application.

## Prerequisites

1. A Firebase project
2. Node.js and npm installed
3. SvelteKit project setup

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or select an existing project
3. Enter your project name (e.g., "balance-botanica")
4. Follow the setup wizard

## Step 2: Enable Phone Authentication

1. In your Firebase project, go to **Authentication** > **Sign-in method**
2. Click on **Phone** provider
3. Enable it and configure:
   - **Phone numbers for testing** (optional, for development)
   - **reCAPTCHA verification** (required for production)

## Step 3: Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to **Your apps** section
3. Click **Web app** icon (</>) to add a web app
4. Register your app and copy the config object

## Step 4: Environment Variables

Create a `.env` file in your project root with:

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
```

## Step 5: Install Dependencies

```bash
npm install firebase
```

## Step 6: Configure reCAPTCHA

1. Go to **Authentication** > **Settings** > **reCAPTCHA Enterprise**
2. Enable reCAPTCHA Enterprise
3. Add your domain to the allowed list

## Step 7: Test the Setup

1. Start your development server
2. Navigate to `/locale-management`
3. Click "Sign In" to test phone authentication
4. Enter a phone number and verify with SMS code

## Features

### Phone Authentication
- **SMS Verification**: Users receive a 6-digit code via SMS
- **reCAPTCHA Protection**: Prevents abuse and bot attacks
- **Phone Number Formatting**: Automatic E.164 formatting
- **Error Handling**: Comprehensive error messages and validation

### Security Features
- **Rate Limiting**: Firebase handles SMS rate limiting
- **Phone Verification**: Only verified phone numbers can sign in
- **Session Management**: Secure session handling with Firebase Auth

### Cost Information
- **Free Tier**: 10,000 SMS verifications/month
- **Paid Tier**: ~$0.01 per SMS after free tier
- **No Setup Fees**: Pay only for what you use

## Troubleshooting

### Common Issues

1. **reCAPTCHA not loading**
   - Check domain is added to Firebase allowed list
   - Verify reCAPTCHA is enabled in Firebase console

2. **SMS not sending**
   - Verify phone number format (E.164)
   - Check Firebase project billing status
   - Ensure Phone Auth is enabled

3. **Authentication errors**
   - Check Firebase configuration in environment variables
   - Verify API keys are correct
   - Check browser console for detailed error messages

### Development vs Production

- **Development**: Use Firebase Auth Emulator for testing
- **Production**: Use live Firebase services
- **Testing**: Add test phone numbers in Firebase console

## Next Steps

1. **Customize UI**: Modify the PhoneAuth component styling
2. **Add User Profile**: Extend user data beyond phone number
3. **Implement Persistence**: Add user preferences storage
4. **Add Analytics**: Track authentication metrics

## Support

- [Firebase Documentation](https://firebase.google.com/docs/auth)
- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Support](https://firebase.google.com/support)
