import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

export const ordersTable = pgTable('orders', {
  id: uuid().defaultRandom().primaryKey(),
  customerEmail: varchar().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})
