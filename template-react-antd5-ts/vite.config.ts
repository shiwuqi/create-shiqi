import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import qiankun from 'vite-plugin-qiankun';
import path from 'path';
const pkg = require('./package.json');

const useDevMode = false;

export default ({ mode }: { mode: string; }) => {

  return defineConfig({
    base: '/',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        target: 'es2020',
      },
    },
    esbuild: {
      logOverride: { 'this-is-undefined-in-esm': 'silent' },
    },
    plugins: [
      react({
        babel: {
          plugins: [
            'babel-plugin-macros',
            [
              '@emotion/babel-plugin-jsx-pragmatic',
              {
                export: 'jsx',
                import: '__cssprop',
                module: '@emotion/react',
              },
            ],
            [
              '@babel/plugin-transform-react-jsx',
              { pragma: '__cssprop' },
              'twin.macro',
            ],
          ],
        },
      }),
      qiankun(pkg.name, {
        useDevMode,
      }),
    ],
    server: {
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: 'http://47.109.82.231:7005',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/'),
        },
      },
      cors: true,
    },
  })

}
