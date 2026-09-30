import type { FastifyInstance } from 'fastify'
import { hasZodFastifySchemaValidationErrors } from 'fastify-type-provider-zod'

type ErrorHandler = Parameters<FastifyInstance['setErrorHandler']>[0]

function toPath(instancePath: string): (string | number)[] {
  return instancePath
    .split('/')
    .filter(Boolean)
    .map((segment) => (/^\d+$/.test(segment) ? Number(segment) : segment))
}

export const errorHandler: ErrorHandler = (error, request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      message: 'Validation error.',
      issues: error.validation.map((issue) => ({
        path: toPath(issue.instancePath),
        message: issue.message ?? 'Invalid value.',
      })),
    })
  }

  if (
    error instanceof Error &&
    'statusCode' in error &&
    typeof error.statusCode === 'number' &&
    error.statusCode >= 400 &&
    error.statusCode < 500
  ) {
    return reply.status(error.statusCode).send({ message: error.message })
  }

  request.log.error(error)

  return reply.status(500).send({ message: 'Internal server error.' })
}
