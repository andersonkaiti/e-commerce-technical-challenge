import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { makeFinalizeOrder } from '../factories/finalize-order.factory.ts'

export async function finalizeOrderRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/order/finalize',
    schema: {
      body: z.object({
        orderId: z.uuid(),
      }),
      response: {
        200: z.object({
          message: z.string(),
        }),
      },
    },
    handler: async (request, reply) => {
      const finalizeOrder = makeFinalizeOrder()

      await finalizeOrder.execute(request.body)

      reply.status(200).send({
        message: 'Order finalized successfully!',
      })
    },
  })
}
