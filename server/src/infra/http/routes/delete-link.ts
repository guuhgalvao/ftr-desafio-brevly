import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { deleteLink } from '@/app/functions/delete-link'
import { linkIdSchema } from '@/app/schemas/links'
import { isLeft } from '@/shared/either'
import { badRequestErrorSchema, errorSchema } from '../schemas/errors'

export const deleteLinkRoute: FastifyPluginAsyncZod = async (app) => {
  app.delete(
    '/links/:id',
    {
      schema: {
        params: z.object({ id: linkIdSchema }),
        response: {
          204: z.void(),
          400: badRequestErrorSchema,
          404: errorSchema,
        },
      },
    },
    async (request, reply) => {
      const result = await deleteLink(request.params)

      if (isLeft(result)) {
        return reply.status(404).send({ message: result.left.message })
      }

      return reply.status(204).send()
    },
  )
}
