import { FinalizeOrderUseCase } from '@application/use-cases/finalize-order.usecase.ts'
import { OrdersRepository } from '@infra/database/repositories/orders.repository.ts'
import { NodemailerMailProvider } from '@infra/mail/nodemailer.mail-provider.ts'

export function makeFinalizeOrder() {
  return new FinalizeOrderUseCase(
    new OrdersRepository(),
    new NodemailerMailProvider(),
  )
}
