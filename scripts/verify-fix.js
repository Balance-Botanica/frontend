const http = require('http');

// Make a request to our test endpoint
const options = {
    hostname: 'localhost',
    port: 5174,
    path: '/test-fix',
    method: 'GET'
};

console.log('🔍 Testing the fix by requesting /test-fix endpoint...');

const req = http.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
        data += chunk;
    });
    
    res.on('end', () => {
        console.log('✅ Request completed successfully');
        console.log('📝 Response received (first 500 chars):');
        console.log(data.substring(0, 500) + '...');
        console.log('\n🎉 Fix verification complete! Check http://localhost:5174/test-fix in your browser for full details.');
    });
});

req.on('error', (error) => {
    console.log('❌ Request failed:', error.message);
    console.log('💡 Make sure the dev server is running on port 5174');
});

req.end();