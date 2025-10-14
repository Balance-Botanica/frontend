// Check environment variables
require('dotenv/config');

console.log('Environment Variables Check:');
console.log('==========================');
console.log('POCKETBASE_ENABLED:', process.env.POCKETBASE_ENABLED);
console.log('POCKETBASE_URL:', process.env.POCKETBASE_URL);
console.log('DATABASE_URL:', process.env.DATABASE_URL);