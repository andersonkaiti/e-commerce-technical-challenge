import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { makeCreateOrder } from '../factories/create-order.factory.ts'

export async function createOrderRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/carrinho',
    schema: {
      body: z.object({
        customerEmail: z.email(),
        items: z
          .array(
            z.object({
              productId: z.uuid(),
              quantity: z.number().int().positive(),
            }),
          )
          .min(1),
      }),
      response: {
        201: z.object({
          orderId: z.uuid(),
          totalInCents: z.number().int(),
        }),
      },
    },
    handler: async (request, reply) => {
      const createOrder = makeCreateOrder()

      const { id: orderId, totalInCents } = await createOrder.execute(
        request.body,
      )

      reply.status(201).send({ orderId, totalInCents })
    },
  })
}
