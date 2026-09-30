import { describe, expect, it } from 'vitest'
import { linkIdSchema, originalUrlSchema, shortUrlSchema } from './links'

describe('shortUrlSchema', () => {
  it.each(['abc', 'Portfolio-Dev', 'my_link-01', 'a'.repeat(50)])('accepts "%s"', (value) => {
    expect(shortUrlSchema.safeParse(value).success).toBe(true)
  })

  it.each(['ab', 'a'.repeat(51), 'with space', 'acentuação', 'slash/inside', 'dot.inside', ''])(
    'rejects "%s"',
    (value) => {
      expect(shortUrlSchema.safeParse(value).success).toBe(false)
    },
  )
})

describe('originalUrlSchema', () => {
  it.each(['https://github.com/gustavo', 'http://localhost:3000/path?q=1'])(
    'accepts "%s"',
    (value) => {
      expect(originalUrlSchema.safeParse(value).success).toBe(true)
    },
  )

  it.each(['github.com', 'ftp://files.example.com', 'not a url', ''])('rejects "%s"', (value) => {
    expect(originalUrlSchema.safeParse(value).success).toBe(false)
  })
})

describe('linkIdSchema', () => {
  it('accepts a UUID v7', () => {
    expect(linkIdSchema.safeParse('0192f1c4-8b7a-7cc3-9f1e-3b2a1c0d4e5f').success).toBe(true)
  })

  it('rejects a non-UUID', () => {
    expect(linkIdSchema.safeParse('123').success).toBe(false)
  })
})
