import { faker } from '@faker-js/faker'
import { db } from '@infra/database/drizzle/index.ts'
import { ordersTable } from '@infra/database/drizzle/schemas/order.ts'
import { orderProductsTable } from '@infra/database/drizzle/schemas/order-products.ts'
import { productsTable } from '@infra/database/drizzle/schemas/product.ts'
import { eq, inArray } from 'drizzle-orm'
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

describe('POST /carrinho (e2e)', () => {
  let products: { id: string; priceInCents: number }[]

  beforeAll(async () => {
    await app.ready()

    products = await db
      .insert(productsTable)
      .values([makeProduct(), makeProduct(), makeProduct()])
      .returning({
        id: productsTable.id,
        priceInCents: productsTable.priceInCents,
      })
  })

  afterAll(async () => {
    const productIds = products.map((product) => product.id)

    // remove every order created from the test products, then the products
    const items = await db
      .select({ orderId: orderProductsTable.orderId })
      .from(orderProductsTable)
      .where(inArray(orderProductsTable.productId, productIds))

    const orderIds = [...new Set(items.map((item) => item.orderId))]

    if (orderIds.length > 0) {
      await db.delete(ordersTable).where(inArray(ordersTable.id, orderIds))
    }

    await db.delete(productsTable).where(inArray(productsTable.id, productIds))

    await app.close()
    await db.$client.end()
  })

  it('creates an order with a single item and returns 201', async () => {
    const product = products[0]
    const quantity = faker.number.int({ min: 1, max: 10 })

    const response = await request(app.server)
      .post('/carrinho')
      .send({
        customerEmail: faker.internet.email(),
        items: [
          {
            productId: product.id,
            quantity,
            priceInCents: product.priceInCents,
          },
        ],
      })

    expect(response.status).toBe(201)
    expect(response.body).toEqual({ orderId: expect.any(String) })

    const persisted = await db
      .select()
      .from(orderProductsTable)
      .where(eq(orderProductsTable.productId, product.id))

    expect(persisted).toHaveLength(1)
    expect(persisted[0].quantity).toBe(quantity)
  })

  it('creates an order with multiple items and returns 201', async () => {
    const response = await request(app.server)
      .post('/carrinho')
      .send({
        customerEmail: faker.internet.email(),
        items: products.map((product) => ({
          productId: product.id,
          quantity: faker.number.int({ min: 1, max: 5 }),
          priceInCents: product.priceInCents,
        })),
      })

    expect(response.status).toBe(201)
    expect(response.body).toEqual({ orderId: expect.any(String) })
  })

  it('returns 400 when the customer email is invalid', async () => {
    const response = await request(app.server)
      .post('/carrinho')
      .send({
        customerEmail: faker.person.fullName(),
        items: [{ productId: products[0].id, quantity: 1, priceInCents: 1000 }],
      })

    expect(response.status).toBe(400)
  })

  it('returns 400 when a product id is not a valid uuid', async () => {
    const response = await request(app.server)
      .post('/carrinho')
      .send({
        customerEmail: faker.internet.email(),
        items: [
          {
            productId: faker.string.alphanumeric(10),
            quantity: 1,
            priceInCents: 1000,
          },
        ],
      })

    expect(response.status).toBe(400)
  })

  it('returns 400 when items are missing', async () => {
    const response = await request(app.server)
      .post('/carrinho')
      .send({ customerEmail: faker.internet.email() })

    expect(response.status).toBe(400)
  })
})
