import type { IProductsRepository } from '@domain/repositories/products.repository.ts'

export class GetProductsUseCase {
  constructor(private readonly productsRepository: IProductsRepository) {}

  async execute() {
    return this.productsRepository.getProducts()
  }
}
