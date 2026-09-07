import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { makeCreateOrder } from '../factories/create-order.factory.ts'

export async function createOrderRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/order',
    schema: {
      body: z.object({
        customerEmail: z.email(),
        items: z.array(
          z.object({
            productId: z.uuid(),
            quantity: z.number(),
            priceInCents: z.number(),
          }),
        ),
      }),
      response: {
        201: z.object({
          message: z.string(),
        }),
      },
    },
    handler: async (request, reply) => {
      const createOrder = makeCreateOrder()

      await createOrder.execute(request.body)

      reply.status(201).send({
        message: 'Order created successfully!',
      })
    },
  })
}
