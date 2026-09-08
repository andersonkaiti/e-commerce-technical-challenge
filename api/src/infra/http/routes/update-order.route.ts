import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { makeUpdateOrder } from '../factories/update-order.factory.ts'

export async function updateOrderRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'PUT',
    url: '/carrinho',
    schema: {
      body: z.object({
        orderId: z.uuid(),
        productId: z.uuid(),
        quantity: z.number().int().min(0),
      }),
      response: {
        200: z.object({
          message: z.string(),
        }),
      },
    },
    handler: async (request, reply) => {
      const updateOrder = makeUpdateOrder()

      await updateOrder.execute(request.body)

      reply.status(200).send({
        message: 'Order updated successfully!',
      })
    },
  })
}
