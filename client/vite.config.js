import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,   // listen on 0.0.0.0 so LAN devices can connect
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
});
