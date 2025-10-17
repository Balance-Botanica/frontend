# Security Guidelines

## Credentials and Secrets

This project contains sensitive credentials and secrets that should never be committed to version control:

### Files that are ignored by .gitignore:
- `balance-botanica-*.json` - Firebase service account keys
- `client_secret_*.json` - Google OAuth credentials
- `admin-chat-id.json` - Telegram bot configuration
- `*.env` - Environment variables (except .env.example)
- `pocketbase/pb_data/backups/*.zip` - Database backups containing user data

### Setting up credentials:

1. **Google OAuth:**
   - Copy `client_secret_*.json` from Google Cloud Console
   - Configure OAuth redirect URIs in Google Cloud Console
   - Set up PocketBase auth provider with correct credentials

2. **Firebase:**
   - Download service account key from Firebase Console
   - Rename to `balance-botanica-*.json`

3. **Environment Variables:**
   - Copy `.env.example` to `.env`
   - Fill in actual values

### Security Best Practices:

- Never commit credentials to git
- Use environment variables for sensitive data
- Rotate credentials regularly
- Use separate credentials for development/production
- Monitor access logs for suspicious activity

### Database Backups:

PocketBase backups may contain sensitive user data. Store backups securely and never commit them to git.
