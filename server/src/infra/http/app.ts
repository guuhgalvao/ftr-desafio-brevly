import { fastifyCors } from '@fastify/cors'
import { fastify } from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { errorHandler } from './error-handler'
import { createLinkRoute } from './routes/create-link'
import { getLinkByShortUrlRoute } from './routes/get-link-by-short-url'
import { healthRoute } from './routes/health'
import { listLinksRoute } from './routes/list-links'

export function buildApp() {
  const app = fastify({ logger: true }).withTypeProvider<ZodTypeProvider>()

  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  app.setErrorHandler(errorHandler)
  app.setNotFoundHandler((_request, reply) => {
    return reply.status(404).send({ message: 'Route not found.' })
  })

  app.register(fastifyCors, {
    origin: true,
    methods: ['GET', 'HEAD', 'POST', 'PATCH', 'DELETE'],
  })

  app.register(healthRoute)
  app.register(createLinkRoute)
  app.register(listLinksRoute)
  app.register(getLinkByShortUrlRoute)

  return app
}
