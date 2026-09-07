import type { IOrderDetails } from '@domain/entities/order.entity.ts'
import { formatPrice } from '@shared/utils/format-price.ts'

export function buildOrderConfirmationEmail(
  order: IOrderDetails,
  totalInCents: number,
) {
  const items = order.items
    .map(
      (item) =>
        `<li>${item.productName} — ${item.quantity}x — ${formatPrice(
          item.priceInCents * item.quantity,
        )}</li>`,
    )
    .join('')

  return `
    <h1>Order confirmation</h1>
    <p>Your order <strong>${order.id}</strong> has been confirmed.</p>
    <ul>${items}</ul>
    <p><strong>Total: ${formatPrice(totalInCents)}</strong></p>
  `
}
