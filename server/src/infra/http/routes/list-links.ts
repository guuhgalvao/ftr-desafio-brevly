import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { listLinks } from '@/app/functions/list-links'
import { linkSchema } from '@/app/schemas/links'

export const listLinksRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/links',
    {
      schema: {
        response: {
          200: z.object({ links: z.array(linkSchema) }),
        },
      },
    },
    async (_request, reply) => {
      const result = await listLinks()

      return reply.status(200).send(result)
    },
  )
}
