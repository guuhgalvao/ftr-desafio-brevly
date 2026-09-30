import { afterAll, beforeEach } from 'vitest'
import { pg } from '@/infra/db'

beforeEach(async () => {
  await pg`TRUNCATE TABLE links`
})

afterAll(async () => {
  await pg.end()
})
