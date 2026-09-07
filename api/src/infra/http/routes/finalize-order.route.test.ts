import { faker } from '@faker-js/faker'
import { db } from '@infra/database/drizzle/index.ts'
import { ordersTable } from '@infra/database/drizzle/schemas/order.ts'
import { orderProductsTable } from '@infra/database/drizzle/schemas/order-products.ts'
import { productsTable } from '@infra/database/drizzle/schemas/product.ts'
import { eq } from 'drizzle-orm'
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

describe('POST /order/finalize (e2e)', () => {
  let orderId: string
  let productId: string

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

    const [order] = await db
      .insert(ordersTable)
      .values({ customerEmail: faker.internet.email() })
      .returning()

    orderId = order.id

    await db.insert(orderProductsTable).values({
      orderId,
      productId,
      quantity: 2,
      priceInCents: product.priceInCents,
    })
  })

  afterAll(async () => {
    // deleting the order cascades to its items
    await db.delete(ordersTable).where(eq(ordersTable.id, orderId))
    await db.delete(productsTable).where(eq(productsTable.id, productId))

    await app.close()
    await db.$client.end()
  })

  it('finalizes the order, sends the confirmation email and returns 200', async () => {
    const response = await request(app.server)
      .post('/order/finalize')
      .send({ orderId })

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ message: 'Order finalized successfully!' })
    expect(sendMailMock).toHaveBeenCalledTimes(1)
  })

  it('returns 404 when the order does not exist', async () => {
    const response = await request(app.server)
      .post('/order/finalize')
      .send({ orderId: faker.string.uuid() })

    expect(response.status).toBe(404)
  })

  it('returns 400 when the order id is not a valid uuid', async () => {
    const response = await request(app.server)
      .post('/order/finalize')
      .send({ orderId: 'not-a-uuid' })

    expect(response.status).toBe(400)
  })
})
