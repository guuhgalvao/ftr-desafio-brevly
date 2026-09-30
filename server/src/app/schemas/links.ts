import { z } from 'zod'

// Rule shared with the web package (docs/api-contract.md).
export const shortUrlSchema = z
  .string()
  .min(3, 'Short URL must have at least 3 characters.')
  .max(50, 'Short URL must have at most 50 characters.')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Short URL may only contain letters, numbers, "-" and "_".')

export const originalUrlSchema = z.url({
  protocol: /^https?$/,
  error: 'Original URL must be a valid http or https URL.',
})

export const linkIdSchema = z.uuid({ error: 'Link id must be a valid UUID.' })

export const createLinkInputSchema = z.object({
  originalUrl: originalUrlSchema,
  shortUrl: shortUrlSchema,
})

export const linkSchema = z.object({
  id: z.uuid(),
  originalUrl: z.string(),
  shortUrl: z.string(),
  accessCount: z.number().int(),
  createdAt: z.date(),
})

export type CreateLinkInput = z.infer<typeof createLinkInputSchema>
export type Link = z.infer<typeof linkSchema>
