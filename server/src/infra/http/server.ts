import { env } from '@/env'
import { buildApp } from './app'

const app = buildApp()

async function shutdown(signal: NodeJS.Signals) {
  app.log.info(`${signal} received, closing server`)
  await app.close()
  process.exit(0)
}

process.once('SIGINT', shutdown)
process.once('SIGTERM', shutdown)

try {
  await app.listen({ host: '0.0.0.0', port: env.PORT })
} catch (error) {
  app.log.error(error)
  process.exit(1)
}
