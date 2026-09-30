import { describe, expect, it } from 'vitest'
import { ShortUrlAlreadyExistsError } from '@/app/errors/short-url-already-exists'
import { isLeft, isRight, unwrapEither } from '@/shared/either'
import { createLink } from './create-link'

describe('createLink', () => {
  it('creates a link with defaults filled by the server', async () => {
    const result = await createLink({
      originalUrl: 'https://github.com/gustavo',
      shortUrl: 'gustavo-github',
    })

    expect(isRight(result)).toBe(true)
    expect(unwrapEither(result)).toEqual({
      link: {
        id: expect.any(String),
        originalUrl: 'https://github.com/gustavo',
        shortUrl: 'gustavo-github',
        accessCount: 0,
        createdAt: expect.any(Date),
      },
    })
  })

  it('returns a conflict when the short URL already exists', async () => {
    await createLink({ originalUrl: 'https://a.com', shortUrl: 'repeated' })

    const result = await createLink({ originalUrl: 'https://b.com', shortUrl: 'repeated' })

    expect(isLeft(result)).toBe(true)
    expect(unwrapEither(result)).toBeInstanceOf(ShortUrlAlreadyExistsError)
  })

  it('treats short URLs with different casing as distinct', async () => {
    await createLink({ originalUrl: 'https://a.com', shortUrl: 'Portfolio-Dev' })

    const result = await createLink({ originalUrl: 'https://b.com', shortUrl: 'portfolio-dev' })

    expect(isRight(result)).toBe(true)
  })
})
