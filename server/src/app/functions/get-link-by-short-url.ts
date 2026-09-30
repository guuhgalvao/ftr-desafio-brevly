import { eq } from 'drizzle-orm'
import { LinkNotFoundError } from '@/app/errors/link-not-found'
import type { Link } from '@/app/schemas/links'
import { db } from '@/infra/db'
import { links } from '@/infra/db/schemas/links'
import { type Either, makeLeft, makeRight } from '@/shared/either'

export async function getLinkByShortUrl(input: {
  shortUrl: string
}): Promise<Either<LinkNotFoundError, { link: Link }>> {
  const [link] = await db.select().from(links).where(eq(links.shortUrl, input.shortUrl)).limit(1)

  if (!link) {
    return makeLeft(new LinkNotFoundError())
  }

  return makeRight({ link })
}
