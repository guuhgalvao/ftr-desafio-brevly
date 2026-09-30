import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getLinkByShortUrl } from '@/app/functions/get-link-by-short-url'
import { linkSchema } from '@/app/schemas/links'
import { isLeft } from '@/shared/either'
import { errorSchema } from '../schemas/errors'

export const getLinkByShortUrlRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/links/:shortUrl',
    {
      schema: {
        // Not validated against shortUrlSchema: the contract only defines 200 and 404 here,
        // and a malformed code can never exist, so it falls through to 404.
        params: z.object({ shortUrl: z.string() }),
        response: {
          200: linkSchema,
          404: errorSchema,
        },
      },
    },
    async (request, reply) => {
      const result = await getLinkByShortUrl(request.params)

      if (isLeft(result)) {
        return reply.status(404).send({ message: result.left.message })
      }

      return reply.status(200).send(result.right.link)
    },
  )
}
