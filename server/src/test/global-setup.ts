import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'
import type { TestProject } from 'vitest/node'

export async function setup(project: TestProject) {
  const databaseUrl = project.config.env.DATABASE_URL

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set in vitest.config.ts (test.env).')
  }

  const url = new URL(databaseUrl)
  const database = url.pathname.slice(1)

  if (!database.endsWith('_test')) {
    throw new Error(`Refusing to run tests against "${database}": name must end with "_test".`)
  }

  const adminUrl = new URL(url)
  adminUrl.pathname = '/postgres'
  const admin = postgres(adminUrl.toString(), { max: 1, onnotice: () => {} })

  try {
    const [existing] = await admin`SELECT 1 FROM pg_database WHERE datname = ${database}`
    if (!existing) {
      await admin.unsafe(`CREATE DATABASE "${database}"`)
    }
  } finally {
    await admin.end()
  }

  const client = postgres(databaseUrl, { max: 1, onnotice: () => {} })

  try {
    await migrate(drizzle(client), { migrationsFolder: 'src/infra/db/migrations' })
  } finally {
    await client.end()
  }
}
