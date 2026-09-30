import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { incrementLinkAccess } from '@/app/functions/increment-link-access'
import { linkIdSchema } from '@/app/schemas/links'
import { isLeft } from '@/shared/either'
import { badRequestErrorSchema, errorSchema } from '../schemas/errors'

export const incrementLinkAccessRoute: FastifyPluginAsyncZod = async (app) => {
  app.patch(
    '/links/:id/access',
    {
      schema: {
        params: z.object({ id: linkIdSchema }),
        response: {
          200: z.object({ id: z.uuid(), accessCount: z.number().int() }),
          400: badRequestErrorSchema,
          404: errorSchema,
        },
      },
    },
    async (request, reply) => {
      const result = await incrementLinkAccess(request.params)

      if (isLeft(result)) {
        return reply.status(404).send({ message: result.left.message })
      }

      return reply.status(200).send(result.right)
    },
  )
}
