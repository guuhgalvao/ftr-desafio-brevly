import { describe, expect, it } from 'vitest'
import { db } from '@/infra/db'
import { links } from '@/infra/db/schemas/links'
import { listLinks } from './list-links'

describe('listLinks', () => {
  it('returns an empty list when there are no links', async () => {
    expect(await listLinks()).toEqual({ links: [] })
  })

  it('returns all links, most recent first', async () => {
    await db.insert(links).values([
      { originalUrl: 'https://a.com', shortUrl: 'oldest', createdAt: new Date('2026-01-01') },
      { originalUrl: 'https://b.com', shortUrl: 'newest', createdAt: new Date('2026-03-01') },
      { originalUrl: 'https://c.com', shortUrl: 'middle', createdAt: new Date('2026-02-01') },
    ])

    const result = await listLinks()

    expect(result.links.map((link) => link.shortUrl)).toEqual(['newest', 'middle', 'oldest'])
  })

  it('breaks ties on createdAt by id, newest id first', async () => {
    const createdAt = new Date('2026-01-01')

    await db.insert(links).values({ originalUrl: 'https://a.com', shortUrl: 'first', createdAt })
    await db.insert(links).values({ originalUrl: 'https://b.com', shortUrl: 'second', createdAt })

    const result = await listLinks()

    expect(result.links.map((link) => link.shortUrl)).toEqual(['second', 'first'])
  })
})
