import { GetProductsUseCase } from '@application/use-cases/get-products.usecase.ts'
import { ProductsRepository } from '@infra/database/repositories/products.repository.ts'

export function makeGetProducts() {
  return new GetProductsUseCase(new ProductsRepository())
}
