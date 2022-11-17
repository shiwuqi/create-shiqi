import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import qiankun from 'vite-plugin-qiankun'
import path from 'path'
const pkg = require('./package.json')

const useDevMode = false

export default ({ mode }: { mode: string; }) => {
  const base = mode === 'development' ? '/qiankun' : '/qiankun/'

  return defineConfig({
    base,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    plugins: [
      react(),
      qiankun(pkg.name, {
        useDevMode,
      }),
    ],
    server: {
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: 'http://api-test.com',
          changeOrigin: true,
        },
      },
      cors: true,
    },
  })

}
