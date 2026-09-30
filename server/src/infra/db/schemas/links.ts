import { sql } from 'drizzle-orm'
import { check, integer, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core'
import { uuidv7 } from 'uuidv7'

export const links = pgTable(
  'links',
  {
    id: uuid('id')
      .primaryKey()
      .$defaultFn(() => uuidv7()),
    originalUrl: text('original_url').notNull(),
    shortUrl: text('short_url').notNull(),
    accessCount: integer('access_count').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('links_short_url_unique').on(table.shortUrl),
    check('links_access_count_check', sql`${table.accessCount} >= 0`),
  ],
)
