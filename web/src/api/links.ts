import { z } from 'zod'
import { request, requestNoContent } from './client'

export const linkSchema = z.object({
  id: z.uuid(),
  originalUrl: z.string(),
  shortUrl: z.string(),
  accessCount: z.number().int(),
  createdAt: z.iso.datetime({ offset: true }),
})

export type Link = z.infer<typeof linkSchema>

export interface CreateLinkInput {
  originalUrl: string
  shortUrl: string
}

export const linkKeys = {
  all: ['links'] as const,
}

export function listLinks() {
  return request('/links', {
    method: 'GET',
    schema: z.object({ links: z.array(linkSchema) }),
  })
}

export function createLink(input: CreateLinkInput) {
  return request('/links', { method: 'POST', body: input, schema: linkSchema })
}

export function getLinkByShortUrl(shortUrl: string) {
  return request(`/links/${encodeURIComponent(shortUrl)}`, { method: 'GET', schema: linkSchema })
}

export function incrementLinkAccess(id: string) {
  return request(`/links/${encodeURIComponent(id)}/access`, {
    method: 'PATCH',
    schema: z.object({ id: z.uuid(), accessCount: z.number().int() }),
  })
}

export function deleteLink(id: string) {
  return requestNoContent(`/links/${encodeURIComponent(id)}`, 'DELETE')
}

export function exportLinks() {
  return request('/links/exports', {
    method: 'POST',
    schema: z.object({ reportUrl: z.url() }),
  })
}
