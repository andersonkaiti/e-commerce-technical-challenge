import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
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
import { finalizeOrderRoute } from './routes/finalize-order.route.ts'
import { getProductsRoute } from './routes/get-products.route.ts'
import { updateOrderRoute } from './routes/update-order.route.ts'

export const app = fastify()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(helmet, {
  contentSecurityPolicy: false,
})

app.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
})

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
  configuration: {
    theme: 'kepler',
  },
})

app.setErrorHandler(errorHandler)

app.register(cors, {
  origin: ['https://e-commerce.andersonkaiti.com', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
})

app.register(createOrderRoute)
app.register(getProductsRoute)
app.register(updateOrderRoute)
app.register(finalizeOrderRoute)

app.get('/', (_request, reply) => reply.send({ message: 'E-commerce API' }))
