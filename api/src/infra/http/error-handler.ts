import { Conflict } from '@application/errors/conflict.ts'
import { NotFound } from '@application/errors/not-found.ts'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { hasZodFastifySchemaValidationErrors } from 'fastify-type-provider-zod'

export function errorHandler(
  error: Error,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  request.log.error(error)
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      error: error.message,
    })
  }

  if (error instanceof NotFound) {
    return reply.status(404).send({
      error: error.message,
    })
  }

  if (error instanceof Conflict) {
    return reply.status(409).send({
      error: error.message,
    })
  }

  return reply.status(500).send({
    error: 'Internal server error',
  })
}
