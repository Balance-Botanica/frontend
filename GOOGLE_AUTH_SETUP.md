# 🚀 Google OAuth + Supabase Authentication Setup Guide

This guide will help you set up the complete Google OAuth + Supabase authentication system for Balance Botanica.

## 📋 Prerequisites

- ✅ Supabase project created
- ✅ Google Cloud Console project created  
- ✅ Google OAuth credentials configured

## 🔧 Step-by-Step Setup

### 1. 🗄️ Supabase Database Setup

Execute the SQL schema in your Supabase SQL Editor:

```sql
-- Run the contents of supabase-schema.sql in your Supabase project
-- This creates user_profiles, linked_accounts, phone_numbers, and personal_info tables
-- Plus triggers for automatic account linking
```

### 2. 🔐 Environment Variables

Create `.env.local` file with your Supabase credentials:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Get these values from:**
- Supabase Dashboard → Settings → API
- Copy "Project URL" and "Project API keys (anon public)"

### 3. 🎯 Google OAuth Configuration

#### A. In Google Cloud Console:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services → Credentials
3. Create OAuth 2.0 Client ID (if not exists)
4. Add authorized redirect URIs:
   ```
   https://your-project-ref.supabase.co/auth/v1/callback
   ```

#### B. In Supabase Dashboard:
1. Go to Authentication → Providers
2. Enable Google provider
3. Add your Google OAuth credentials:
   - **Client ID**: From Google Cloud Console
   - **Client Secret**: From Google Cloud Console
4. Set redirect URL: `https://your-domain.com/auth/callback`

### 4. 🌐 Site URL Configuration

In Supabase Authentication → URL Configuration:
- **Site URL**: `http://localhost:5175` (for development)
- **Redirect URLs**: 
  - `http://localhost:5175/auth/callback`
  - `https://your-production-domain.com/auth/callback`

## 🧪 Testing the Authentication

### 1. Test Email/Password Authentication:
- Go to `/login`
- Enter email and password
- Should create account automatically if doesn't exist
- Should sign in if account exists

### 2. Test Google OAuth:
- Go to `/login`
- Click "Увійти за допомогою Google"
- Should redirect to Google OAuth
- After approval, should redirect back to your app
- Should automatically link accounts with same email

### 3. Test Account Linking:
1. Create account with email: `test@example.com`
2. Sign in with Google using same email
3. Check Supabase database - should see linked accounts

## 📊 Database Structure

The system creates these tables:

```sql
user_profiles          -- Main user profiles
├── id (UUID, PK)
├── email (TEXT, UNIQUE)
├── full_name (TEXT)
├── avatar_url (TEXT)
└── created_at (TIMESTAMP)

linked_accounts        -- Account linking
├── primary_user_id (UUID, FK)
├── linked_user_id (UUID, FK)
├── provider (TEXT)
└── linked_at (TIMESTAMP)
```

## 🔒 Security Features

- ✅ **Row Level Security (RLS)** enabled
- ✅ **Automatic account linking** for same email
- ✅ **Secure session management**
- ✅ **HTTP-only cookies** for tokens
- ✅ **CSRF protection**

## 🎨 UI Components

### Login Form Features:
- ✅ Beautiful Material Design interface
- ✅ Google OAuth button with proper branding
- ✅ Email/password authentication
- ✅ Automatic sign-up if account doesn't exist
- ✅ Loading states and error handling
- ✅ Responsive design

### Authentication Flow:
1. User visits `/login`
2. Can choose Google OAuth or email/password
3. Google OAuth redirects to `/auth/callback`
4. Successful auth redirects to homepage
5. Failed auth shows error message

## 🔄 Integration Points

### Frontend:
- `src/lib/auth/supabase-store.ts` - Main auth store
- `src/lib/components/LoginForm.svelte` - Login UI
- `src/routes/login/+page.svelte` - Login page
- `src/routes/auth/callback/` - OAuth callback handler

### State Management:
```javascript
// Access user state anywhere in your app
import { user, session, isAuthenticated } from '$lib/auth/supabase-store';

// Check if user is logged in
$: if ($isAuthenticated) {
  // User is logged in
  console.log('User:', $user);
}
```

## 🚨 Common Issues & Solutions

### Issue: "Invalid OAuth redirect URL"
**Solution**: Make sure redirect URLs match exactly in:
- Google Cloud Console authorized redirect URIs
- Supabase Authentication URL configuration

### Issue: "CORS policy error"
**Solution**: Ensure Site URL is correctly set in Supabase settings

### Issue: "User not found" after Google OAuth
**Solution**: Check if user_profiles trigger is working correctly

## 📈 Next Steps

After basic setup:
1. ✅ Implement password recovery
2. ✅ Add profile management 
3. ✅ Implement role-based access
4. ✅ Add social media account linking
5. ✅ Implement user preferences

## 🎯 Production Checklist

Before going live:
- [ ] Update Site URLs to production domain
- [ ] Configure production Google OAuth credentials
- [ ] Test Google OAuth in production environment
- [ ] Verify email confirmations work
- [ ] Test account linking scenarios
- [ ] Check RLS policies are working
- [ ] Backup database schema

---

**🎉 You're ready to rock with Google OAuth + Supabase authentication!**

The system provides enterprise-level security with a beautiful, user-friendly interface. Users can sign in with Google or email/password, and accounts are automatically linked when using the same email address.