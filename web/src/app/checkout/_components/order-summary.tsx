'use client'

import { useCart } from '@hooks/use-cart'
import { formatPrice } from '@utils/format-price'

export function OrderSummary() {
  const { items, subtotal } = useCart()

  return (
    <>
      <ul className="flex flex-col gap-4">
        {items.map((item) => (
          <li key={item.id} className="flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="font-medium">{item.name}</span>
              <span className="text-muted-foreground text-sm">
                {item.quantity} x {formatPrice(item.priceInCents)}
              </span>
            </div>

            <span className="font-medium">
              {formatPrice(item.priceInCents * item.quantity)}
            </span>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between border-t pt-4 font-semibold text-lg">
        <span>Total</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
    </>
  )
}
