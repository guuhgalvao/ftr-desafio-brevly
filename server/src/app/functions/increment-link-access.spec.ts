import { eq } from 'drizzle-orm'
import { uuidv7 } from 'uuidv7'
import { describe, expect, it } from 'vitest'
import { LinkNotFoundError } from '@/app/errors/link-not-found'
import { db } from '@/infra/db'
import { links } from '@/infra/db/schemas/links'
import { isLeft, isRight, unwrapEither } from '@/shared/either'
import { incrementLinkAccess } from './increment-link-access'

async function insertLink() {
  const [link] = await db
    .insert(links)
    .values({ originalUrl: 'https://github.com/gustavo', shortUrl: 'gustavo-github' })
    .returning()

  if (!link) {
    throw new Error('Failed to insert link.')
  }

  return link
}

describe('incrementLinkAccess', () => {
  it('increments the access count by one', async () => {
    const link = await insertLink()

    const first = await incrementLinkAccess({ id: link.id })
    const second = await incrementLinkAccess({ id: link.id })

    expect(isRight(first)).toBe(true)
    expect(unwrapEither(first)).toEqual({ id: link.id, accessCount: 1 })
    expect(unwrapEither(second)).toEqual({ id: link.id, accessCount: 2 })
  })

  it('does not lose increments under concurrency', async () => {
    const link = await insertLink()
    const total = 50

    await Promise.all(Array.from({ length: total }, () => incrementLinkAccess({ id: link.id })))

    const [stored] = await db.select().from(links).where(eq(links.id, link.id))
    expect(stored?.accessCount).toBe(total)
  })

  it('returns not found for an unknown id', async () => {
    const result = await incrementLinkAccess({ id: uuidv7() })

    expect(isLeft(result)).toBe(true)
    expect(unwrapEither(result)).toBeInstanceOf(LinkNotFoundError)
  })
})
