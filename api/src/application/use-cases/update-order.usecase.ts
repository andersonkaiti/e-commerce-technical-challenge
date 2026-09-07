import type { IOrdersRepository } from '@domain/repositories/orders.repository.ts'

interface IInput {
  orderId: string
  productId: string
  quantity: number
}

export class UpdateOrderUseCase {
  constructor(private readonly ordersRepository: IOrdersRepository) {}

  async execute({ orderId, productId, quantity }: IInput) {
    if (quantity <= 0) {
      await this.ordersRepository.removeItem({ orderId, productId })

      return
    }

    await this.ordersRepository.updateItemQuantity({
      orderId,
      productId,
      quantity,
    })
  }
}
