import { z } from 'zod'

export const envSchema = z.object({
  VITE_FRONTEND_URL: z.url(),
  VITE_BACKEND_URL: z.url(),
  // Optional: domain shown as the prefix of the "link encurtado" field. Unset or empty falls back to `brev.ly`.
  VITE_DISPLAY_DOMAIN: z
    .string()
    .optional()
    .transform((value) => value?.trim() || 'brev.ly'),
})
