import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { z } from 'zod'
import { envSchema } from './src/env-schema'

export default defineConfig(({ mode }) => {
  const result = envSchema.safeParse(loadEnv(mode, process.cwd(), 'VITE_'))
  if (!result.success) {
    throw new Error(`Invalid environment variables:\n${z.prettifyError(result.error)}`)
  }

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
