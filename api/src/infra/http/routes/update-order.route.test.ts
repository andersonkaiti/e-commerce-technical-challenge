import { faker } from '@faker-js/faker'
import { db } from '@infra/database/drizzle/index.ts'
import { ordersTable } from '@infra/database/drizzle/schemas/order.ts'
import { orderProductsTable } from '@infra/database/drizzle/schemas/order-products.ts'
import { productsTable } from '@infra/database/drizzle/schemas/product.ts'
import { and, eq, inArray } from 'drizzle-orm'
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

describe('PUT /order (e2e)', () => {
  let orderId: string
  let productToUpdateId: string
  let productToRemoveId: string
  let createdProductIds: string[]

  beforeAll(async () => {
    await app.ready()

    const products = await db
      .insert(productsTable)
      .values([makeProduct(), makeProduct()])
      .returning({ id: productsTable.id })

    productToUpdateId = products[0].id
    productToRemoveId = products[1].id
    createdProductIds = products.map((product) => product.id)

    const [order] = await db
      .insert(ordersTable)
      .values({ customerEmail: faker.internet.email() })
      .returning()

    orderId = order.id

    await db.insert(orderProductsTable).values([
      {
        orderId,
        productId: productToUpdateId,
        quantity: 1,
        priceInCents: 1000,
      },
      {
        orderId,
        productId: productToRemoveId,
        quantity: 1,
        priceInCents: 1000,
      },
    ])
  })

  afterAll(async () => {
    // deleting the order cascades to its items
    await db.delete(ordersTable).where(eq(ordersTable.id, orderId))
    await db
      .delete(productsTable)
      .where(inArray(productsTable.id, createdProductIds))

    await app.close()
    await db.$client.end()
  })

  it('updates the quantity of an item and returns 200', async () => {
    const quantity = faker.number.int({ min: 2, max: 10 })

    const response = await request(app.server)
      .put('/order')
      .send({ orderId, productId: productToUpdateId, quantity })

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ message: 'Order updated successfully!' })

    const [item] = await db
      .select()
      .from(orderProductsTable)
      .where(
        and(
          eq(orderProductsTable.orderId, orderId),
          eq(orderProductsTable.productId, productToUpdateId),
        ),
      )

    expect(item.quantity).toBe(quantity)
  })

  it('removes the item when quantity is 0 and returns 200', async () => {
    const response = await request(app.server)
      .put('/order')
      .send({ orderId, productId: productToRemoveId, quantity: 0 })

    expect(response.status).toBe(200)

    const items = await db
      .select()
      .from(orderProductsTable)
      .where(
        and(
          eq(orderProductsTable.orderId, orderId),
          eq(orderProductsTable.productId, productToRemoveId),
        ),
      )

    expect(items).toHaveLength(0)
  })

  it('returns 400 when the order id is not a valid uuid', async () => {
    const response = await request(app.server).put('/order').send({
      orderId: 'not-a-uuid',
      productId: productToUpdateId,
      quantity: 1,
    })

    expect(response.status).toBe(400)
  })
})
