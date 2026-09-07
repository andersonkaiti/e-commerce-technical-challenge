import type { IOrder } from '@domain/entities/order.entity.ts'
import type {
  IOrdersRepository,
  IRemoveOrderItem,
  IUpdateOrderItem,
} from '@domain/repositories/orders.repository.ts'
import { and, eq } from 'drizzle-orm'
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

  async updateItemQuantity({
    orderId,
    productId,
    quantity,
  }: IUpdateOrderItem): Promise<void> {
    await db
      .update(orderProductsTable)
      .set({ quantity })
      .where(
        and(
          eq(orderProductsTable.orderId, orderId),
          eq(orderProductsTable.productId, productId),
        ),
      )
  }

  async removeItem({ orderId, productId }: IRemoveOrderItem): Promise<void> {
    await db
      .delete(orderProductsTable)
      .where(
        and(
          eq(orderProductsTable.orderId, orderId),
          eq(orderProductsTable.productId, productId),
        ),
      )
  }
}
