import { Readable } from 'node:stream'
import type { Upload } from '@aws-sdk/lib-storage'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { uploadFileToStorage } from './upload-file-to-storage'

type UploadParams = ConstructorParameters<typeof Upload>[0]['params']

const uploads = vi.hoisted(() => ({ params: [] as UploadParams[] }))

vi.mock('@aws-sdk/lib-storage', () => ({
  Upload: class {
    constructor(options: { params: UploadParams }) {
      uploads.params.push(options.params)
    }

    async done() {
      return {}
    }
  },
}))

const UUID_V4 = '[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}'

function uploadCsv() {
  return uploadFileToStorage({
    folder: 'exports',
    fileName: 'brevly-links.csv',
    contentType: 'text/csv; charset=utf-8',
    contentStream: Readable.from(['a,b\n']),
  })
}

describe('uploadFileToStorage', () => {
  beforeEach(() => {
    uploads.params = []
  })

  it('uploads to exports/<uuid>.csv in the configured bucket', async () => {
    const { key } = await uploadCsv()

    expect(key).toMatch(new RegExp(`^exports/${UUID_V4}\\.csv$`))
    expect(uploads.params).toHaveLength(1)
    expect(uploads.params[0]).toMatchObject({ Bucket: 'test', Key: key })
  })

  it('sets headers so the browser downloads the file instead of opening it', async () => {
    await uploadCsv()

    expect(uploads.params[0]).toMatchObject({
      ContentType: 'text/csv; charset=utf-8',
      ContentDisposition: 'attachment; filename="brevly-links.csv"',
    })
  })

  it('passes the stream as the body without buffering it', async () => {
    const contentStream = Readable.from(['a,b\n'])

    await uploadFileToStorage({
      folder: 'exports',
      fileName: 'brevly-links.csv',
      contentType: 'text/csv; charset=utf-8',
      contentStream,
    })

    expect(uploads.params[0]?.Body).toBe(contentStream)
  })

  it('returns the public url of the uploaded key', async () => {
    const { key, url } = await uploadCsv()

    expect(url).toBe(`https://test.r2.dev/${key}`)
  })

  it('generates a different key on every call', async () => {
    const first = await uploadCsv()
    const second = await uploadCsv()

    expect(first.key).not.toBe(second.key)
    expect(first.url).not.toBe(second.url)
  })
})
