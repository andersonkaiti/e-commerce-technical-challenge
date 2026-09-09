import { faker } from '@faker-js/faker'
import { db } from '@infra/database/drizzle/index.ts'
import { ordersTable } from '@infra/database/drizzle/schemas/order.ts'
import { orderProductsTable } from '@infra/database/drizzle/schemas/order-products.ts'
import { productsTable } from '@infra/database/drizzle/schemas/product.ts'
import { inArray } from 'drizzle-orm'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { app } from '../app.ts'

// mock the SMTP transport so no real email is sent
const { sendMailMock } = vi.hoisted(() => ({ sendMailMock: vi.fn() }))

vi.mock('nodemailer', () => ({
  createTransport: () => ({ sendMail: sendMailMock }),
  default: { createTransport: () => ({ sendMail: sendMailMock }) },
}))

function makeProduct() {
  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    imageUrl: faker.image.url(),
    priceInCents: faker.number.int({ min: 1000, max: 500000 }),
  }
}

describe('POST /finalizar-compra (e2e)', () => {
  let orderId: string
  let idempotencyOrderId: string
  let productId: string

  async function createOrder(priceInCents: number) {
    const [order] = await db
      .insert(ordersTable)
      .values({ customerEmail: faker.internet.email() })
      .returning()

    await db.insert(orderProductsTable).values({
      orderId: order.id,
      productId,
      quantity: 2,
      priceInCents,
    })

    return order.id
  }

  beforeAll(async () => {
    await app.ready()

    const [product] = await db
      .insert(productsTable)
      .values(makeProduct())
      .returning({
        id: productsTable.id,
        priceInCents: productsTable.priceInCents,
      })

    productId = product.id

    orderId = await createOrder(product.priceInCents)
    idempotencyOrderId = await createOrder(product.priceInCents)
  })

  afterAll(async () => {
    // deleting the orders cascades to their items
    await db
      .delete(ordersTable)
      .where(inArray(ordersTable.id, [orderId, idempotencyOrderId]))
    await db.delete(productsTable).where(inArray(productsTable.id, [productId]))

    await app.close()
    await db.$client.end()
  })

  it('finalizes the order, sends the confirmation email and returns 200', async () => {
    sendMailMock.mockClear()

    const response = await request(app.server)
      .post('/finalizar-compra')
      .send({ orderId })

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ message: 'Order finalized successfully!' })
    expect(sendMailMock).toHaveBeenCalledTimes(1)
  })

  it('is idempotent: a second finalize returns 409 and sends no new email', async () => {
    sendMailMock.mockClear()

    const first = await request(app.server)
      .post('/finalizar-compra')
      .send({ orderId: idempotencyOrderId })

    const second = await request(app.server)
      .post('/finalizar-compra')
      .send({ orderId: idempotencyOrderId })

    expect(first.status).toBe(200)
    expect(second.status).toBe(409)
    expect(sendMailMock).toHaveBeenCalledTimes(1)
  })

  it('returns 404 when the order does not exist', async () => {
    const response = await request(app.server)
      .post('/finalizar-compra')
      .send({ orderId: faker.string.uuid() })

    expect(response.status).toBe(404)
  })

  it('returns 400 when the order id is not a valid uuid', async () => {
    const response = await request(app.server)
      .post('/finalizar-compra')
      .send({ orderId: 'not-a-uuid' })

    expect(response.status).toBe(400)
  })
})
