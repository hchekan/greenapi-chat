import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

import { fileURLToPath } from 'node:url';
import path from 'node:path';
// Правильное получение __dirname в ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],

  server: {
    host: 'localhost',
    port: 5173,
    hmr: {
      host: 'localhost',
      port: 5173,
      protocol: 'ws',
    },
    watch: {
      usePolling: true,
      interval: 100,
      ignored: [],
    },
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@icons': path.resolve(__dirname, './src/assets/icons'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@chats': path.resolve(__dirname, './src/components/Chats'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@store': path.resolve(__dirname, './src/store'),
      '@types': path.resolve(__dirname, './src/types'),
      '@db': path.resolve(__dirname, './src/db'),
      '@api': path.resolve(__dirname, './src/api'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
})
