import { eq, sql } from 'drizzle-orm'
import { LinkNotFoundError } from '@/app/errors/link-not-found'
import { db } from '@/infra/db'
import { links } from '@/infra/db/schemas/links'
import { type Either, makeLeft, makeRight } from '@/shared/either'

export async function incrementLinkAccess(input: {
  id: string
}): Promise<Either<LinkNotFoundError, { id: string; accessCount: number }>> {
  // Single atomic statement: no read-modify-write race between concurrent accesses.
  const [link] = await db
    .update(links)
    .set({ accessCount: sql`${links.accessCount} + 1` })
    .where(eq(links.id, input.id))
    .returning({ id: links.id, accessCount: links.accessCount })

  if (!link) {
    return makeLeft(new LinkNotFoundError())
  }

  return makeRight(link)
}
