import devtoolsJson from 'vite-plugin-devtools-json';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit(), devtoolsJson()],
	assetsInclude: ['**/*.md'],
	server: {
		host: true, // Allow all hosts by default
		proxy: {
			'/pb-api': {
				target: 'http://127.0.0.1:8090',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/pb-api/, ''),
				configure: (proxy, options) => {
					// Enable credentials for cookie support
					proxy.on('proxyReq', (proxyReq, req, res) => {
						// Forward cookies from client to PocketBase
						if (req.headers.cookie) {
							proxyReq.setHeader('Cookie', req.headers.cookie);
						}
						// Remove Origin header to avoid CORS issues
						proxyReq.removeHeader('Origin');
						// Ensure credentials are included
						proxyReq.setHeader('credentials', 'include');
					});
					proxy.on('proxyRes', (proxyRes, req, res) => {
						// Forward cookies from PocketBase back to client
						const cookies = proxyRes.headers['set-cookie'];
						if (cookies) {
							res.setHeader('set-cookie', cookies);
						}
						// Add CORS headers for OAuth and cookies
						if (req.headers.origin) {
							proxyRes.headers['Access-Control-Allow-Origin'] = req.headers.origin;
							proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
							proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
							proxyRes.headers['Access-Control-Allow-Headers'] =
								'Content-Type, Authorization, Accept, Cookie';
						}
					});
				}
			}
		},
		allowedHosts: [
			// Default hosts
			'localhost',
			'127.0.0.1',
			// Add ngrok hosts
			'9d922759c1d5.ngrok-free.app',
			'*.ngrok-free.app' // Allow any ngrok-free.app subdomain for future sessions
		]
	}
});
