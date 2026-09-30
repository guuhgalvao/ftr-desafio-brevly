import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { exportLinks } from '@/app/functions/export-links'
import { unwrapEither } from '@/shared/either'

export const exportLinksRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/links/exports',
    {
      schema: {
        response: {
          200: z.object({ reportUrl: z.string() }),
        },
      },
    },
    async (_request, reply) => {
      const result = await exportLinks()

      return reply.status(200).send(unwrapEither(result))
    },
  )
}
