import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://api-test.com',
        changeOrigin: true,
      },
      '/qiankun/': {
        target: 'http://localhost:5173/',
        changeOrigin: true,
      },
    },
    cors: true,
    port: 5174
  },
})
