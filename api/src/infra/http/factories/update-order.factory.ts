import { UpdateOrderUseCase } from '@application/use-cases/update-order.usecase.ts'
import { OrdersRepository } from '@infra/database/repositories/orders.repository.ts'

export function makeUpdateOrder() {
  return new UpdateOrderUseCase(new OrdersRepository())
}
