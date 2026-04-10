import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: { '/api': 'http://localhost:3001' },
  },
  build: {
    rollupOptions: {
      output: {
        format: 'iife',
        name: 'SymComponents',
        // Put everything (CSS too) into one JS file
        inlineDynamicImports: true,
      },
    },
    // Inline CSS into the JS bundle
    cssCodeSplit: false,
  },
});
