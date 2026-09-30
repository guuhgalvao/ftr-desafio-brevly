import { z } from 'zod'

export const errorSchema = z.object({ message: z.string() })

export const validationErrorSchema = z.object({
  message: z.string(),
  issues: z.array(
    z.object({
      path: z.array(z.union([z.string(), z.number()])),
      message: z.string(),
    }),
  ),
})
