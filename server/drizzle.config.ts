import { defineConfig } from 'drizzle-kit'

try {
  process.loadEnvFile()
} catch {
  // No .env file: rely on variables already present in the environment.
}

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/infra/db/schemas',
  out: './src/infra/db/migrations',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? '',
  },
})
