import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// vite.config.js
export default {
  optimizeDeps: {
    exclude: ['@electric-sql/pglite'],
  },
  build: {
    rollupOptions: {
      external: ['@electric-sql/pglite'],
    },
  },
};
