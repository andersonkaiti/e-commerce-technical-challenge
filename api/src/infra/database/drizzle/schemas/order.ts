import { pgEnum, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

export const orderStatusEnum = pgEnum('order_status', ['pending', 'paid'])

export const ordersTable = pgTable('orders', {
  id: uuid().defaultRandom().primaryKey(),
  customerEmail: varchar().notNull(),
  status: orderStatusEnum().notNull().default('pending'),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})
