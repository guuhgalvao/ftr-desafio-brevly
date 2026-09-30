import { eq } from 'drizzle-orm'
import { uuidv7 } from 'uuidv7'
import { describe, expect, it } from 'vitest'
import { LinkNotFoundError } from '@/app/errors/link-not-found'
import { db } from '@/infra/db'
import { links } from '@/infra/db/schemas/links'
import { isLeft, isRight, unwrapEither } from '@/shared/either'
import { deleteLink } from './delete-link'

describe('deleteLink', () => {
  it('deletes an existing link', async () => {
    const [link] = await db
      .insert(links)
      .values({ originalUrl: 'https://github.com/gustavo', shortUrl: 'gustavo-github' })
      .returning()

    if (!link) {
      throw new Error('Failed to insert link.')
    }

    const result = await deleteLink({ id: link.id })

    expect(isRight(result)).toBe(true)
    expect(await db.select().from(links).where(eq(links.id, link.id))).toEqual([])
  })

  it('returns not found for an unknown id', async () => {
    const result = await deleteLink({ id: uuidv7() })

    expect(isLeft(result)).toBe(true)
    expect(unwrapEither(result)).toBeInstanceOf(LinkNotFoundError)
  })
})
