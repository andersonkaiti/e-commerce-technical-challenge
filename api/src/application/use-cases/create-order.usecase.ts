import type { IOrdersRepository } from '@domain/repositories/orders.repository.ts'
import type { IProductsRepository } from '@domain/repositories/products.repository.ts'
import { NotFound } from '../errors/not-found.ts'

interface IInput {
  customerEmail: string
  items: {
    productId: string
    quantity: number
    priceInCents: number
  }[]
}

export class CreateOrderUseCase {
  constructor(
    private readonly ordersRepository: IOrdersRepository,
    private readonly productsRepository: IProductsRepository,
  ) {}

  async execute({ customerEmail, items }: IInput) {
    const products = await Promise.all(
      items.map((item) =>
        this.productsRepository.getProductById(item.productId),
      ),
    )

    const someProductIsMissing = products.some((product) => !product)

    if (someProductIsMissing) {
      throw new NotFound('Product not found.')
    }

    await this.ordersRepository.createOrder({
      customerEmail,
      items,
    })
  }
}
