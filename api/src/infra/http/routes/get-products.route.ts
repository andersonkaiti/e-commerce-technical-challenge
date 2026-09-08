import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { makeGetProducts } from '../factories/get-products.factory.ts'

export async function getProductsRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/produtos',
    schema: {
      response: {
        200: z.array(
          z.object({
            id: z.uuid(),
            name: z.string(),
            description: z.string(),
            imageUrl: z.string(),
            priceInCents: z.number(),
          }),
        ),
      },
    },
    handler: async (_request, reply) => {
      const getProducts = makeGetProducts()

      const products = await getProducts.execute()

      reply.status(200).send(products)
    },
  })
}
