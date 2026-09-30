import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { createLink } from '@/app/functions/create-link'
import { createLinkInputSchema, linkSchema } from '@/app/schemas/links'
import { isLeft } from '@/shared/either'
import { errorSchema, validationErrorSchema } from '../schemas/errors'

export const createLinkRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/links',
    {
      schema: {
        body: createLinkInputSchema,
        response: {
          201: linkSchema,
          400: validationErrorSchema,
          409: errorSchema,
        },
      },
    },
    async (request, reply) => {
      const result = await createLink(request.body)

      if (isLeft(result)) {
        return reply.status(409).send({ message: result.left.message })
      }

      return reply.status(201).send(result.right.link)
    },
  )
}
