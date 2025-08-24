import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
   build: {
    outDir: 'build',
  },
  optimizeDeps: {
    include: ['pdfjs-dist']
  },
  server: {
    hmr: true,
    fs: {
      allow: ['..']
    }
  },
  assetsInclude: ['**/*.worker.js', '**/*.worker.min.js', '**/*.worker.mjs', '**/*.worker.min.mjs'],
  define: {
    global: 'globalThis',
  },
});
