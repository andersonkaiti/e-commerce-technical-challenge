import { buildOrderConfirmationEmail } from '@application/templates/order-confirmation.template.ts'
import type { IMailProvider } from '@domain/providers/mail.provider.ts'
import type { IOrdersRepository } from '@domain/repositories/orders.repository.ts'
import { Conflict } from '../errors/conflict.ts'
import { NotFound } from '../errors/not-found.ts'

interface IInput {
  orderId: string
}

export class FinalizeOrderUseCase {
  constructor(
    private readonly ordersRepository: IOrdersRepository,
    private readonly mailProvider: IMailProvider,
  ) {}

  async execute({ orderId }: IInput) {
    const order = await this.ordersRepository.getOrderById(orderId)

    if (!order) {
      throw new NotFound('Order not found.')
    }

    if (order.status === 'paid') {
      throw new Conflict('Order already finalized.')
    }

    const wasMarkedAsPaid = await this.ordersRepository.markAsPaid(orderId)

    if (!wasMarkedAsPaid) {
      throw new Conflict('Order already finalized.')
    }

    const totalInCents = order.items.reduce(
      (total, item) => total + item.priceInCents * item.quantity,
      0,
    )

    await this.mailProvider.sendMail({
      to: order.customerEmail,
      subject: 'Order confirmation',
      body: buildOrderConfirmationEmail(order, totalInCents),
    })
  }
}
