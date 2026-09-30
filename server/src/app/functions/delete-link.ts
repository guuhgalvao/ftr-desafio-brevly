import { eq } from 'drizzle-orm'
import { LinkNotFoundError } from '@/app/errors/link-not-found'
import { db } from '@/infra/db'
import { links } from '@/infra/db/schemas/links'
import { type Either, makeLeft, makeRight } from '@/shared/either'

export async function deleteLink(input: { id: string }): Promise<Either<LinkNotFoundError, null>> {
  const [deleted] = await db.delete(links).where(eq(links.id, input.id)).returning({ id: links.id })

  if (!deleted) {
    return makeLeft(new LinkNotFoundError())
  }

  return makeRight(null)
}
