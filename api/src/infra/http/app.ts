import fastifySwagger from '@fastify/swagger'
import fastifyApiReference from '@scalar/fastify-api-reference'
import { fastify } from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { errorHandler } from './error-handler.ts'
import { createOrderRoute } from './routes/create-order.route.ts'
import { getProductsRoute } from './routes/get-products.route.ts'

export const app = fastify()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'E-commerce API',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifyApiReference, {
  routePrefix: '/docs',
})

app.setErrorHandler(errorHandler)

app.register(createOrderRoute)
app.register(getProductsRoute)

app.get('/', (_request, reply) => reply.send({ message: 'E-commerce API' }))
