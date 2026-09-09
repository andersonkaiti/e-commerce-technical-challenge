import { reset, seed } from 'drizzle-seed'
import { db } from './index.ts'
import * as schema from './schemas/index.ts'
import { productsTable } from './schemas/product.ts'

console.log('🌱 Populando o banco...')

const productNames = [
  'Mechanical Keyboard',
  'Wireless Mouse',
  'USB-C Hub',
  'Noise-Cancelling Headphones',
  'Bluetooth Speaker',
  'Laptop Stand',
  'Ergonomic Office Chair',
  'LED Desk Lamp',
  'Portable SSD 1TB',
  '1080p Webcam',
  'Smart Watch',
  'Stainless Steel Water Bottle',
  'Ceramic Coffee Mug',
  'Leather Wallet',
  'Cotton Hoodie',
  'Running Sneakers',
  'Yoga Mat',
  'Polarized Sunglasses',
  'Travel Backpack',
  'Mechanical Pencil Set',
]

const imageUrls = productNames.map(
  (name) => `https://placehold.co/600x600?text=${encodeURIComponent(name)}`,
)

await reset(db, schema)

await seed(db, { productsTable }).refine((f) => ({
  productsTable: {
    count: productNames.length,
    columns: {
      name: f.valuesFromArray({ values: productNames, isUnique: true }),
      description: f.loremIpsum({ sentencesCount: 2 }),
      priceInCents: f.int({ minValue: 1000, maxValue: 500000 }),
      imageUrl: f.valuesFromArray({ values: imageUrls, isUnique: true }),
    },
  },
}))

console.log('✅ Produtos inseridos.')

process.exit(0)
