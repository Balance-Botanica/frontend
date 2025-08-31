#!/usr/bin/env node

// Загружаем переменные окружения
import { config } from 'dotenv';
config();

import { writeFileSync } from 'fs';
import { join } from 'path';

console.log('🔧 Creating .env file...\n');

const envContent = `# Supabase Configuration (Required for OAuth)
VITE_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=8343800455:AAGk9NjKvopbJoGsRfl-Tkv3Rg9kh4qqDfI

# Google Sheets Configuration
GOOGLE_CREDENTIALS_PATH=./balance-botanica-d061b04ea697.json

# Database Configuration
DATABASE_URL=./local.db

# Development
NODE_ENV=development
`;

try {
	const envPath = join(process.cwd(), '.env');
	writeFileSync(envPath, envContent);

	console.log('✅ .env file created successfully!');
	console.log('📁 Location:', envPath);
	console.log('\n📋 Next steps:');
	console.log('1. Place your Google credentials JSON file in the root directory');
	console.log('2. Rename it to: balance-botanica-d061b04ea697.json');
	console.log('3. Run: npm run orders:test');
	console.log('4. Run: npm run bot');

} catch (error) {
	console.error('❌ Failed to create .env file:', error);
	process.exit(1);
}
