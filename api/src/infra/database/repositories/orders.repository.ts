import type { IOrder } from '@domain/entities/order.entity.ts'
import type { IOrdersRepository } from '@domain/repositories/orders.repository.ts'
import { db } from '../drizzle/index.ts'
import { ordersTable } from '../drizzle/schemas/order.ts'
import { orderProductsTable } from '../drizzle/schemas/order-products.ts'

export class OrdersRepository implements IOrdersRepository {
  async createOrder({ customerEmail, items }: IOrder): Promise<void> {
    await db.transaction(async (tx) => {
      const [order] = await tx
        .insert(ordersTable)
        .values({
          customerEmail,
        })
        .returning()

      await tx.insert(orderProductsTable).values(
        items.map((item) => ({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          priceInCents: item.priceInCents,
        })),
      )
    })
  }
}
