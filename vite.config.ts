import devtoolsJson from 'vite-plugin-devtools-json';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit(), devtoolsJson()],
	server: {
		host: true, // Allow all hosts by default
		proxy: {},
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
