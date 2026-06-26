import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  optimizeDeps: {
    include: ['tailwind-config'],
  },
  plugins: [Vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'tailwind-config': fileURLToPath(new URL('./tailwind.config.cjs', import.meta.url)),
    },
  },
  server: {
    port: 9000,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        xfwd: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/ws/persons': {
        target: 'http://127.0.0.1:8080',
        ws: true,
        changeOrigin: true,
      },
      '/oauth': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        xfwd: true,
        secure: false,
      },
      '/unleash/frontend': {
        target: 'http://localhost:4242',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/unleash\/frontend/, '/api/frontend'),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Authorization', '*:development.unleash-insecure-frontend-api-token')
          })
        },
      },
    },
  },
  test: {
    reporters: ['junit'],
    setupFiles: ['tests/setup-hooks.ts'],
    outputFile: {
      junit: 'build/test-results/junit/report.xml',
    },
    environment: 'happy-dom',
    coverage: {
      reporter: ['lcov'],
      reportsDirectory: 'build/test-results/coverage',
    },
  },
})