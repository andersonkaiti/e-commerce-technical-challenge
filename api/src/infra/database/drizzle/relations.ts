import { defineRelations } from 'drizzle-orm'
import * as schema from './schemas/index.ts'

// ordersTable pode ter vários produtos
// produtosTable podem estar contidos em vários orders
// (n:n)

export const relations = defineRelations(schema, (relation) => ({
  ordersTable: {
    products: relation.many.productsTable({
      from: relation.ordersTable.id.through(
        relation.orderProductsTable.orderId,
      ),
      to: relation.productsTable.id.through(
        relation.orderProductsTable.productId,
      ),
    }),
    items: relation.many.orderProductsTable(),
  },
  productsTable: {
    orders: relation.many.ordersTable({
      from: relation.productsTable.id.through(
        relation.orderProductsTable.productId,
      ),
      to: relation.ordersTable.id.through(relation.orderProductsTable.orderId),
    }),
    items: relation.many.orderProductsTable(),
  },
  orderProductsTable: {
    order: relation.one.ordersTable({
      from: relation.orderProductsTable.orderId,
      to: relation.ordersTable.id,
      optional: false,
    }),
    product: relation.one.productsTable({
      from: relation.orderProductsTable.productId,
      to: relation.productsTable.id,
      optional: false,
    }),
  },
}))
