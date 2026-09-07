import { CreateOrderUseCase } from '@application/use-cases/create-order.usecase.ts'
import { OrdersRepository } from '@infra/database/repositories/orders.repository.ts'
import { ProductsRepository } from '@infra/database/repositories/products.repository.ts'

export function makeCreateOrder() {
  return new CreateOrderUseCase(
    new OrdersRepository(),
    new ProductsRepository(),
  )
}
