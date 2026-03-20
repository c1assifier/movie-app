import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const currentDir = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, currentDir, '')

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(currentDir, './src'),
      },
    },
    define: {
      __POISKKINO_API_URL__: JSON.stringify(env.POISKKINO_API_URL),
    },
    server: {
      proxy: {
        '/api': {
          target: 'https://api.poiskkino.dev/v1.4',
          changeOrigin: true,
          secure: true,
          rewrite: (requestPath) => requestPath.replace(/^\/api/, ''),
          headers: {
            'X-API-KEY': env.POISKKINO_API_KEY,
          },
        },
        '/poster-proxy': {
          target: 'https://avatars.mds.yandex.net',
          changeOrigin: true,
          secure: true,
          rewrite: (requestPath) => requestPath.replace(/^\/poster-proxy/, ''),
        },
      },
    },
  }
})
