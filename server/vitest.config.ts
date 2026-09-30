import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    env: {
      PORT: '3333',
      DATABASE_URL: 'postgresql://docker:docker@localhost:5433/brevly_test',

      CLOUDFLARE_ACCOUNT_ID: 'test',
      CLOUDFLARE_ACCESS_KEY_ID: 'test',
      CLOUDFLARE_SECRET_ACCESS_KEY: 'test',
      CLOUDFLARE_BUCKET: 'test',
      CLOUDFLARE_PUBLIC_URL: 'https://test.r2.dev',
    },
    globalSetup: ['src/test/global-setup.ts'],
    setupFiles: ['src/test/setup.ts'],
    fileParallelism: false,
  },
})
