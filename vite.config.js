import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    port: 8333,
    proxy: {
      '/scraper-api': {
        target: 'http://localhost:3600',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/scraper-api/, ''),
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
