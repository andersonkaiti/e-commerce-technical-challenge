import { integer, pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core'
import { ordersTable } from './order.ts'
import { productsTable } from './product.ts'

export const orderProductsTable = pgTable(
  'order_products',
  {
    orderId: uuid()
      .notNull()
      .references(() => ordersTable.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    productId: uuid()
      .notNull()
      .references(() => productsTable.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    quantity: integer().notNull(),
    priceInCents: integer().notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.orderId, table.productId],
    }),
  ],
)
