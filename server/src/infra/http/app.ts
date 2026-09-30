import { fastifyCors } from '@fastify/cors'
import { fastify } from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { errorHandler } from './error-handler'
import { healthRoute } from './routes/health'

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

  return app
}
