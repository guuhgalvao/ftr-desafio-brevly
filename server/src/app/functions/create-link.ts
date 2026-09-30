import { ShortUrlAlreadyExistsError } from '@/app/errors/short-url-already-exists'
import type { CreateLinkInput, Link } from '@/app/schemas/links'
import { db } from '@/infra/db'
import { isUniqueViolation } from '@/infra/db/errors'
import { links } from '@/infra/db/schemas/links'
import { type Either, makeLeft, makeRight } from '@/shared/either'

export async function createLink(
  input: CreateLinkInput,
): Promise<Either<ShortUrlAlreadyExistsError, { link: Link }>> {
  try {
    const [link] = await db.insert(links).values(input).returning()

    if (!link) {
      throw new Error('Insert returned no rows.')
    }

    return makeRight({ link })
  } catch (error) {
    if (isUniqueViolation(error, 'links_short_url_unique')) {
      return makeLeft(new ShortUrlAlreadyExistsError())
    }

    throw error
  }
}
