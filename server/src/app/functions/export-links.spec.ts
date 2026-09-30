import type { Readable } from 'node:stream'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '@/infra/db'
import { links } from '@/infra/db/schemas/links'
import { uploadFileToStorage } from '@/infra/storage/upload-file-to-storage'
import { isRight, unwrapEither } from '@/shared/either'
import { exportLinks } from './export-links'

vi.mock('@/infra/storage/upload-file-to-storage', () => ({
  uploadFileToStorage: vi.fn(),
}))

const BOM = '﻿'
const HEADER = 'URL original,URL encurtada,Contagem de acessos,Data de criação'

let uploadedCsv: string

async function readStream(stream: Readable): Promise<string> {
  const chunks: Buffer[] = []

  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk))
  }

  return Buffer.concat(chunks).toString('utf-8')
}

describe('exportLinks', () => {
  beforeEach(() => {
    uploadedCsv = ''

    vi.mocked(uploadFileToStorage).mockReset()
    vi.mocked(uploadFileToStorage).mockImplementation(async ({ contentStream }) => {
      uploadedCsv = await readStream(contentStream)

      return { key: 'exports/fake.csv', url: 'https://test.r2.dev/exports/fake.csv' }
    })
  })

  it('uploads a csv with the contract file name and content type', async () => {
    const result = await exportLinks()

    expect(isRight(result)).toBe(true)
    expect(unwrapEither(result)).toEqual({ reportUrl: 'https://test.r2.dev/exports/fake.csv' })
    expect(uploadFileToStorage).toHaveBeenCalledOnce()
    expect(uploadFileToStorage).toHaveBeenCalledWith(
      expect.objectContaining({
        folder: 'exports',
        fileName: 'brevly-links.csv',
        contentType: 'text/csv; charset=utf-8',
      }),
    )
  })

  it('generates only the header when there are no links', async () => {
    await exportLinks()

    expect(uploadedCsv).toBe(`${BOM}${HEADER}\n`)
  })

  it('writes one row per link, most recent first, with ISO 8601 dates', async () => {
    await db.insert(links).values([
      {
        originalUrl: 'https://a.com',
        shortUrl: 'oldest',
        accessCount: 3,
        createdAt: new Date('2026-01-01T10:00:00.000Z'),
      },
      {
        originalUrl: 'https://b.com/path?q=1,2',
        shortUrl: 'newest',
        accessCount: 0,
        createdAt: new Date('2026-03-01T12:30:00.000Z'),
      },
    ])

    await exportLinks()

    expect(uploadedCsv).toBe(
      [
        `${BOM}${HEADER}`,
        '"https://b.com/path?q=1,2",newest,0,2026-03-01T12:30:00.000Z',
        'https://a.com,oldest,3,2026-01-01T10:00:00.000Z',
        '',
      ].join('\n'),
    )
  })

  it('streams all rows across several cursor batches', async () => {
    await db.insert(links).values(
      Array.from({ length: 250 }, (_, index) => ({
        originalUrl: `https://example.com/${index}`,
        shortUrl: `link-${index}`,
      })),
    )

    await exportLinks()

    const lines = uploadedCsv.trimEnd().split('\n')

    expect(lines).toHaveLength(251)
  })

  it('rejects when the upload fails', async () => {
    vi.mocked(uploadFileToStorage).mockRejectedValueOnce(new Error('upload failed'))

    await expect(exportLinks()).rejects.toThrow('upload failed')
  })
})
