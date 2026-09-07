import type { IProduct } from '../entities/product.entity.ts'

export interface IProductsRepository {
  getProducts(): Promise<IProduct[]>
  getProductById(id: string): Promise<IProduct | undefined>
}
