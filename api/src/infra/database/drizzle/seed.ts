import { reset, seed } from 'drizzle-seed'
import { db } from './index.ts'
import * as schema from './schemas/index.ts'
import { productsTable } from './schemas/product.ts'

console.log('🌱 Populando o banco...')

await reset(db, schema)

await seed(db, { productsTable }).refine((f) => ({
  productsTable: {
    count: 20,
    columns: {
      name: f.companyName(),
      description: f.loremIpsum({ sentencesCount: 2 }),
      priceInCents: f.int({ minValue: 1000, maxValue: 500000 }),
      imageUrl: f.default({ defaultValue: 'https://placehold.co/600x600' }),
    },
  },
}))

console.log('✅ Produtos inseridos.')

process.exit(0)
