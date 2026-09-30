import { z } from 'zod'

export const errorSchema = z.object({ message: z.string() })

// Zod validation errors carry `issues`; other 400s from Fastify (e.g. malformed JSON) only a message.
export const badRequestErrorSchema = z.object({
  message: z.string(),
  issues: z
    .array(
      z.object({
        path: z.array(z.union([z.string(), z.number()])),
        message: z.string(),
      }),
    )
    .optional(),
})
