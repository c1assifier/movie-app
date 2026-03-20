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
      __POISKKINO_API_KEY__: JSON.stringify(env.POISKKINO_API_KEY),
    },
  }
})
