import { PassThrough } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { stringify } from 'csv-stringify'
import { desc } from 'drizzle-orm'
import { db, pg } from '@/infra/db'
import { links } from '@/infra/db/schemas/links'
import { uploadFileToStorage } from '@/infra/storage/upload-file-to-storage'
import { type Either, makeRight } from '@/shared/either'

const CURSOR_BATCH_SIZE = 100

// Raw rows from postgres.js keep the database column names. The Drizzle driver disables
// postgres.js date parsing, so timestamps arrive as strings.
type ExportRow = {
  original_url: string
  short_url: string
  access_count: number
  created_at: string
}

type ExportLinksOutput = {
  reportUrl: string
}

export async function exportLinks(): Promise<Either<never, ExportLinksOutput>> {
  const { sql, params } = db
    .select({
      originalUrl: links.originalUrl,
      shortUrl: links.shortUrl,
      accessCount: links.accessCount,
      createdAt: links.createdAt,
    })
    .from(links)
    .orderBy(desc(links.createdAt), desc(links.id))
    .toSQL()

  // Fetches CURSOR_BATCH_SIZE rows per round trip; the next batch is only requested
  // when the stream below asks for more data.
  const cursor = pg.unsafe<ExportRow[]>(sql, params as never[]).cursor(CURSOR_BATCH_SIZE)

  async function* rows() {
    for await (const batch of cursor) {
      for (const row of batch) {
        yield { ...row, created_at: links.createdAt.mapFromDriverValue(row.created_at) }
      }
    }
  }

  const csv = stringify({
    header: true,
    bom: true,
    columns: [
      { key: 'original_url', header: 'URL original' },
      { key: 'short_url', header: 'URL encurtada' },
      { key: 'access_count', header: 'Contagem de acessos' },
      { key: 'created_at', header: 'Data de criação' },
    ],
    cast: {
      date: (value) => value.toISOString(),
    },
  })

  const contentStream = new PassThrough()

  const convertToCsv = pipeline(rows, csv, contentStream)

  const upload = uploadFileToStorage({
    folder: 'exports',
    fileName: 'brevly-links.csv',
    contentType: 'text/csv; charset=utf-8',
    contentStream,
  }).catch((error: unknown) => {
    // Unblocks the pipeline so the cursor is closed and its connection released.
    contentStream.destroy(error instanceof Error ? error : new Error(String(error)))
    throw error
  })

  const [{ url }] = await Promise.all([upload, convertToCsv])

  return makeRight({ reportUrl: url })
}
