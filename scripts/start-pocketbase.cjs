// Start PocketBase server
const { spawn } = require('child_process');
const path = require('path');

// Configuration
const POCKETBASE_DIR = path.join(__dirname, '..', 'pocketbase');
const POCKETBASE_EXECUTABLE = path.join(POCKETBASE_DIR, 'pocketbase.exe');
const POCKETBASE_DATA_DIR = path.join(POCKETBASE_DIR, 'pb_data');
const POCKETBASE_HOST = '127.0.0.1:8090';

console.log('🚀 Starting PocketBase server...');
console.log(`📂 Working directory: ${POCKETBASE_DIR}`);
console.log(`🔧 Data directory: ${POCKETBASE_DATA_DIR}`);
console.log(`🌐 Server address: http://${POCKETBASE_HOST}`);

// Spawn PocketBase process
const pocketbase = spawn(POCKETBASE_EXECUTABLE, [
    'serve',
    `--http=${POCKETBASE_HOST}`,
    `--dir=${POCKETBASE_DATA_DIR}`
], {
    cwd: POCKETBASE_DIR
});

// Handle stdout
pocketbase.stdout.on('data', (data) => {
    console.log(`[PocketBase] ${data}`);
});

// Handle stderr
pocketbase.stderr.on('data', (data) => {
    console.error(`[PocketBase Error] ${data}`);
});

// Handle process exit
pocketbase.on('close', (code) => {
    console.log(`[PocketBase] Process exited with code ${code}`);
});

// Handle process error
pocketbase.on('error', (error) => {
    console.error('[PocketBase] Failed to start process:', error.message);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down PocketBase...');
    pocketbase.kill('SIGINT');
});

console.log('✅ PocketBase startup script initialized');
console.log('🔗 Admin Dashboard will be available at: http://127.0.0.1:8090/_/');
console.log('🔗 REST API will be available at: http://127.0.0.1:8090/api/');
console.log(' Press Ctrl+C to stop the server');