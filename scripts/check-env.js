#!/usr/bin/env node

/**
 * Environment Variables Checker for OAuth
 * Run: npm run check-env
 */

console.log('🔍 Checking Environment Variables for OAuth...\n');

const requiredVars = [
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'VITE_PUBLIC_SUPABASE_URL',
    'VITE_PUBLIC_SUPABASE_ANON_KEY'
];

let allGood = true;

console.log('📋 Required Variables:\n');

for (const varName of requiredVars) {
    const value = process.env[varName];
    const status = value ? '✅' : '❌';
    const displayValue = value ?
        (varName.includes('KEY') ? value.substring(0, 20) + '...' : value) :
        'NOT SET';

    console.log(`${status} ${varName}: ${displayValue}`);

    if (!value) {
        allGood = false;
    }
}

console.log('\n' + '='.repeat(50));

if (allGood) {
    console.log('🎉 All required environment variables are set!');
    console.log('✅ OAuth should work properly');
} else {
    console.log('❌ Missing environment variables!');
    console.log('🔧 Add these to your .env file:');
    console.log('');
    console.log('# Server-side Supabase (add to .env)');
    console.log('SUPABASE_URL=https://your-project.supabase.co');
    console.log('SUPABASE_ANON_KEY=your-anon-key');
    console.log('');
    console.log('# Client-side Supabase (should already be in .env.local)');
    console.log('VITE_PUBLIC_SUPABASE_URL=https://your-project.supabase.co');
    console.log('VITE_PUBLIC_SUPABASE_ANON_KEY=your-anon-key');
    console.log('');
    console.log('💡 After adding variables, restart the dev server:');
    console.log('   npm run dev');
}

console.log('\n🔍 Current values from process.env:');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'Set' : 'Not set');
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? 'Set (length: ' + process.env.SUPABASE_ANON_KEY.length + ')' : 'Not set');
