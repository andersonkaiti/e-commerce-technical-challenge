import { faker } from '@faker-js/faker'
import { db } from '@infra/database/drizzle/index.ts'
import { productsTable } from '@infra/database/drizzle/schemas/product.ts'
import { inArray } from 'drizzle-orm'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '../app.ts'

function makeProduct() {
  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    imageUrl: faker.image.url(),
    priceInCents: faker.number.int({ min: 1000, max: 500000 }),
  }
}

describe('GET /produtos (e2e)', () => {
  let productIds: string[]

  beforeAll(async () => {
    await app.ready()

    const products = await db
      .insert(productsTable)
      .values([makeProduct(), makeProduct(), makeProduct()])
      .returning({ id: productsTable.id })

    productIds = products.map((product) => product.id)
  })

  afterAll(async () => {
    await db.delete(productsTable).where(inArray(productsTable.id, productIds))

    await app.close()
    await db.$client.end()
  })

  it('returns 200 with the list of products', async () => {
    const response = await request(app.server).get('/produtos')

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)

    // the seeded products must be present in the response
    const returnedIds = response.body.map(
      (product: { id: string }) => product.id,
    )

    for (const id of productIds) {
      expect(returnedIds).toContain(id)
    }

    // each product exposes the expected shape (timestamps are not exposed)
    expect(response.body[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        description: expect.any(String),
        imageUrl: expect.any(String),
        priceInCents: expect.any(Number),
      }),
    )
  })
})
