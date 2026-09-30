import { eq } from 'drizzle-orm'
import { describe, expect, it } from 'vitest'
import { LinkNotFoundError } from '@/app/errors/link-not-found'
import { db } from '@/infra/db'
import { links } from '@/infra/db/schemas/links'
import { isLeft, isRight, unwrapEither } from '@/shared/either'
import { getLinkByShortUrl } from './get-link-by-short-url'

describe('getLinkByShortUrl', () => {
  it('returns the link for an existing short URL without counting an access', async () => {
    const [created] = await db
      .insert(links)
      .values({ originalUrl: 'https://github.com/gustavo', shortUrl: 'gustavo-github' })
      .returning()

    const result = await getLinkByShortUrl({ shortUrl: 'gustavo-github' })

    expect(isRight(result)).toBe(true)
    expect(unwrapEither(result)).toEqual({ link: created })

    const [stored] = await db.select().from(links).where(eq(links.shortUrl, 'gustavo-github'))
    expect(stored?.accessCount).toBe(0)
  })

  it('is case sensitive', async () => {
    await db.insert(links).values({ originalUrl: 'https://a.com', shortUrl: 'Portfolio-Dev' })

    const result = await getLinkByShortUrl({ shortUrl: 'portfolio-dev' })

    expect(isLeft(result)).toBe(true)
  })

  it('returns not found for an unknown short URL', async () => {
    const result = await getLinkByShortUrl({ shortUrl: 'missing' })

    expect(isLeft(result)).toBe(true)
    expect(unwrapEither(result)).toBeInstanceOf(LinkNotFoundError)
  })
})
