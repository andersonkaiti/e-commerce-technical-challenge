import type { IProduct } from '@domain/entities/product.entity.ts'
import type { IProductsRepository } from '@domain/repositories/products.repository.ts'
import { eq, inArray } from 'drizzle-orm'
import { db } from '../drizzle/index.ts'
import { productsTable } from '../drizzle/schemas/product.ts'

export class ProductsRepository implements IProductsRepository {
  async getProducts(): Promise<IProduct[]> {
    return db.select().from(productsTable)
  }

  async getProductById(id: string): Promise<IProduct | undefined> {
    const [product] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, id))

    return product
  }

  async getProductsByIds(ids: string[]): Promise<IProduct[]> {
    if (ids.length === 0) {
      return []
    }

    return db.select().from(productsTable).where(inArray(productsTable.id, ids))
  }
}
