import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	server: {
		host: true, // Listen on all local IPs
		port: 5173, // Default Vite port
		strictPort: true, // Don't try another port if 5173 is taken
		watch: {
			usePolling: true, // For network volumes & containers
		},
	},
});
