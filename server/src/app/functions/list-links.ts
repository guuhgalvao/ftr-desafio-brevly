import { desc } from 'drizzle-orm'
import type { Link } from '@/app/schemas/links'
import { db } from '@/infra/db'
import { links } from '@/infra/db/schemas/links'

export async function listLinks(): Promise<{ links: Link[] }> {
  const rows = await db.select().from(links).orderBy(desc(links.createdAt), desc(links.id))

  return { links: rows }
}
