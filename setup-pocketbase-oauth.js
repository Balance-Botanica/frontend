const fs = require('fs');
const path = require('path');

// Read Google OAuth credentials
const credentialsPath = path.join(
	__dirname,
	'client_secret_14094555416-9a42o4omucf7tu9ss7q328lg11e9is2c.apps.googleusercontent.com.json'
);
const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));

const clientId = credentials.web.client_id;
const clientSecret = credentials.web.client_secret;

console.log('Google OAuth Setup for PocketBase:');
console.log('==================================');
console.log(`Client ID: ${clientId}`);
console.log(`Client Secret: ${clientSecret}`);
console.log('');
console.log('Redirect URI to add in Google Cloud Console:');
console.log('http://localhost:5173/api/oauth2-redirect');
console.log('');
console.log('Instructions:');
console.log('1. Go to http://127.0.0.1:8090/_/');
console.log('2. Login as admin@balancebotanica.com / 1234567890');
console.log('3. Go to Settings > Auth Providers');
console.log('4. Enable Google provider');
console.log('5. Set Client ID and Client Secret above');
console.log('6. Save settings');
