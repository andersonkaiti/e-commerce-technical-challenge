import type { IProduct } from '../entities/product.entity.ts'

export interface IProductsRepository {
  getProductById(id: string): Promise<IProduct | undefined>
}
