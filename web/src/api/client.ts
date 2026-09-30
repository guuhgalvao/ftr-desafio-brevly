import type { z } from 'zod'
import { env } from '@/env'
import { ApiError, apiErrorSchema, NetworkError } from './errors'

type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE'

// Concatenated instead of `new URL(path, base)` so a base with a path (`https://host/api`) is kept.
const baseUrl = env.VITE_BACKEND_URL.replace(/\/+$/, '')

interface RequestOptions<T extends z.ZodType> {
  method: Method
  body?: unknown
  schema: T
}

async function send(path: string, method: Method, body: unknown) {
  const hasBody = body !== undefined
  let response: Response
  try {
    response = await fetch(`${baseUrl}${path}`, {
      method,
      headers: hasBody ? { 'Content-Type': 'application/json' } : undefined,
      body: hasBody ? JSON.stringify(body) : undefined,
    })
  } catch (error) {
    throw new NetworkError({ cause: error })
  }

  if (!response.ok) {
    throw await toApiError(response)
  }

  return response
}

async function toApiError(response: Response) {
  const body: unknown = await response.json().catch(() => undefined)
  const parsed = apiErrorSchema.safeParse(body)
  if (!parsed.success) {
    return new ApiError(response.status, `Request failed with status ${response.status}.`)
  }
  return new ApiError(response.status, parsed.data.message, parsed.data.issues)
}

// Request whose success response carries a JSON body, validated against `schema`.
export async function request<T extends z.ZodType>(
  path: string,
  { method, body, schema }: RequestOptions<T>,
): Promise<z.infer<T>> {
  const response = await send(path, method, body)
  return schema.parse(await response.json())
}

// Request whose success response is `204 No Content`.
export async function requestNoContent(path: string, method: Method): Promise<void> {
  await send(path, method, undefined)
}
