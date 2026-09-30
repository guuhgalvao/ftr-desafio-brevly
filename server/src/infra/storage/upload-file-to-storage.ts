import { randomUUID } from 'node:crypto'
import { extname } from 'node:path'
import type { Readable } from 'node:stream'
import { Upload } from '@aws-sdk/lib-storage'
import { env } from '@/env'
import { r2 } from './client'

type UploadFileToStorageInput = {
  folder: 'exports'
  fileName: string
  contentType: string
  contentStream: Readable
}

type UploadFileToStorageOutput = {
  key: string
  url: string
}

export async function uploadFileToStorage(
  input: UploadFileToStorageInput,
): Promise<UploadFileToStorageOutput> {
  const { folder, fileName, contentType, contentStream } = input

  const key = `${folder}/${randomUUID()}${extname(fileName)}`

  const upload = new Upload({
    client: r2,
    params: {
      Bucket: env.CLOUDFLARE_BUCKET,
      Key: key,
      Body: contentStream,
      ContentType: contentType,
      ContentDisposition: `attachment; filename="${fileName}"`,
    },
  })

  await upload.done()

  // Trailing slash keeps any path in the public URL when resolving the key against it.
  const baseUrl = env.CLOUDFLARE_PUBLIC_URL.endsWith('/')
    ? env.CLOUDFLARE_PUBLIC_URL
    : `${env.CLOUDFLARE_PUBLIC_URL}/`

  return { key, url: new URL(key, baseUrl).toString() }
}
