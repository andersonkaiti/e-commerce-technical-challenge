import type { IOrdersRepository } from '@domain/repositories/orders.repository.ts'
import type { IProductsRepository } from '@domain/repositories/products.repository.ts'
import { NotFound } from '../errors/not-found.ts'

interface IInput {
  customerEmail: string
  items: {
    productId: string
    quantity: number
  }[]
}

export class CreateOrderUseCase {
  constructor(
    private readonly ordersRepository: IOrdersRepository,
    private readonly productsRepository: IProductsRepository,
  ) {}

  async execute({ customerEmail, items }: IInput) {
    const productIds = items.map((item) => item.productId)
    const products = await this.productsRepository.getProductsByIds(productIds)

    const priceByProductId = new Map(
      products.map((product) => [product.id, product.priceInCents]),
    )

    const orderItems = items.map((item) => {
      const priceInCents = priceByProductId.get(item.productId)

      if (priceInCents === undefined) {
        throw new NotFound('Product not found.')
      }

      return {
        productId: item.productId,
        quantity: item.quantity,
        priceInCents,
      }
    })

    const totalInCents = orderItems.reduce(
      (total, item) => total + item.priceInCents * item.quantity,
      0,
    )

    const { id } = await this.ordersRepository.createOrder({
      customerEmail,
      items: orderItems,
    })

    return { id, totalInCents }
  }
}
