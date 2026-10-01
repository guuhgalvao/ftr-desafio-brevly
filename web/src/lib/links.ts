import { z } from 'zod'
import { env } from '@/env'

const frontendUrl = env.VITE_FRONTEND_URL.replace(/\/+$/, '')
const PROTOCOL = /^https?:\/\//i

// Host shown in the UI in place of the design's `brev.ly` (e.g. `localhost:5173`).
export const displayHost = frontendUrl.replace(PROTOCOL, '')

export function buildShortLink(shortUrl: string) {
  return `${frontendUrl}/${shortUrl}`
}

export function stripProtocol(url: string) {
  return url.replace(PROTOCOL, '')
}

export function formatAccessCount(count: number) {
  return count === 1 ? '1 acesso' : `${count} acessos`
}

export const formMessages = {
  invalidUrl: 'Informe uma URL válida.',
  invalidShortUrl: 'Use de 3 a 50 caracteres: letras, números, - e _.',
  shortUrlTaken: 'Essa URL encurtada já existe.',
}

// Same rule as the API (docs/api-contract.md, "Validação de shortUrl").
export const shortUrlSchema = z
  .string()
  .min(3, formMessages.invalidShortUrl)
  .max(50, formMessages.invalidShortUrl)
  .regex(/^[a-zA-Z0-9_-]+$/, formMessages.invalidShortUrl)

// The design's placeholder has no protocol (`www.exemplo.com.br`), so `https://` is assumed.
export const originalUrlSchema = z
  .string()
  .trim()
  .transform((value) => (PROTOCOL.test(value) ? value : `https://${value}`))
  .pipe(
    z.url({
      protocol: /^https?$/,
      hostname: z.regexes.domain,
      error: formMessages.invalidUrl,
    }),
  )

export const newLinkSchema = z.object({
  originalUrl: originalUrlSchema,
  shortUrl: shortUrlSchema,
})
