import { z } from 'zod'

const requiredString = z.string().trim().min(1, 'Required')

const envSchema = z.object({
  PORT: requiredString.pipe(z.coerce.number<string>().int().min(1).max(65535)),
  DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ }),

  CLOUDFLARE_ACCOUNT_ID: requiredString,
  CLOUDFLARE_ACCESS_KEY_ID: requiredString,
  CLOUDFLARE_SECRET_ACCESS_KEY: requiredString,
  CLOUDFLARE_BUCKET: requiredString,
  CLOUDFLARE_PUBLIC_URL: z.url({ protocol: /^https?$/ }),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error(`❌ Invalid environment variables:\n${z.prettifyError(parsed.error)}`)
  process.exit(1)
}

export const env = parsed.data
