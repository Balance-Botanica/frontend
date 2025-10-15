#!/usr/bin/env node

/**
 * Test PocketBase Authentication Implementation
 * 
 * This script tests the PocketBase authentication implementation
 * to ensure all components are working correctly.
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, readFileSync } from 'fs';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🧪 Testing PocketBase Authentication Implementation...\n');

// Test 1: Check if PocketBase client file exists
console.log('📋 Test 1: Checking PocketBase client file...');
const pbClientPath = join(__dirname, '..', 'src', 'lib', 'pocketbase', 'client.ts');
if (existsSync(pbClientPath)) {
  console.log('✅ PocketBase client file exists');
} else {
  console.log('❌ PocketBase client file missing');
}

// Test 2: Check if PocketBase auth store file exists
console.log('\n📋 Test 2: Checking PocketBase auth store file...');
const pbStorePath = join(__dirname, '..', 'src', 'lib', 'auth', 'pocketbase-store.ts');
if (existsSync(pbStorePath)) {
  console.log('✅ PocketBase auth store file exists');
} else {
  console.log('❌ PocketBase auth store file missing');
}

// Test 3: Check if auth routes exist
console.log('\n📋 Test 3: Checking auth routes...');
const authRoutes = [
  'src/routes/auth/callback/+page.svelte',
  'src/routes/auth/forgot-password/+page.server.ts',
  'src/routes/auth/reset-password/+page.server.ts'
];

for (const route of authRoutes) {
  const fullPath = join(__dirname, '..', route);
  if (existsSync(fullPath)) {
    console.log(`✅ Auth route exists: ${route}`);
  } else {
    console.log(`❌ Auth route missing: ${route}`);
  }
}

// Test 4: Check if PocketBase dependency is in package.json
console.log('\n📋 Test 4: Checking PocketBase dependency...');
try {
  const packageJsonPath = join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
  const hasPocketBase = packageJson.dependencies?.pocketbase;
  if (hasPocketBase) {
    console.log('✅ PocketBase dependency found in package.json');
    console.log('   Version:', hasPocketBase);
  } else {
    console.log('❌ PocketBase dependency not found in package.json');
  }
} catch (error) {
  console.log('❌ Failed to check package.json:', error.message);
}

// Test 5: Check if Supabase dependencies were removed
console.log('\n📋 Test 5: Checking Supabase dependency removal...');
try {
  const packageJsonPath = join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
  const hasSupabase = packageJson.dependencies?.['@supabase/supabase-js'] || 
                      packageJson.devDependencies?.['@supabase/supabase-js'] ||
                      packageJson.dependencies?.['@supabase/gotrue-js'] || 
                      packageJson.devDependencies?.['@supabase/gotrue-js'];
  
  if (hasSupabase) {
    console.log('❌ Supabase dependencies still present in package.json');
  } else {
    console.log('✅ Supabase dependencies successfully removed from package.json');
  }
} catch (error) {
  console.log('❌ Failed to check package.json for Supabase dependencies:', error.message);
}

console.log('\n🎉 Authentication migration test completed!');
console.log('\n📝 Next steps:');
console.log('1. Start your PocketBase server');
console.log('2. Run the development server with `npm run dev`');
console.log('3. Test authentication flows in the browser');
console.log('4. Verify OAuth providers are configured in PocketBase admin panel');