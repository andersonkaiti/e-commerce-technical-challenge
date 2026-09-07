import { integer, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

export const productsTable = pgTable('products', {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar().notNull(),
  description: varchar().notNull(),
  imageUrl: varchar().notNull(),
  priceInCents: integer().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})
