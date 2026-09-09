import type { IOrder, IOrderDetails } from '@domain/entities/order.entity.ts'
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
  async createOrder({
    customerEmail,
    items,
  }: Omit<IOrder, 'id'>): Promise<Pick<IOrder, 'id'>> {
    const id = await db.transaction(async (tx) => {
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

      return order.id
    })

    return { id }
  }

  async getOrderById(orderId: string): Promise<IOrderDetails | undefined> {
    const order = await db.query.ordersTable.findFirst({
      where: { id: orderId },
      with: {
        items: {
          with: {
            product: true,
          },
        },
      },
    })

    if (!order) {
      return undefined
    }

    return {
      id: order.id,
      customerEmail: order.customerEmail,
      status: order.status,
      items: order.items.map((item) => ({
        productId: item.productId,
        productName: item.product.name,
        quantity: item.quantity,
        priceInCents: item.priceInCents,
        product: item.product,
      })),
    }
  }

  async markAsPaid(orderId: string): Promise<boolean> {
    return db.transaction(async (tx) => {
      const updated = await tx
        .update(ordersTable)
        .set({ status: 'paid' })
        .where(
          and(eq(ordersTable.id, orderId), eq(ordersTable.status, 'pending')),
        )
        .returning({ id: ordersTable.id })

      return updated.length > 0
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
