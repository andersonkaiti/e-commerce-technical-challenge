'use client'

import { Button } from '@components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@components/ui/sheet'
import { useCart } from '@hooks/use-cart'
import { formatPrice } from '@utils/format-price'
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function CartSheet() {
  const router = useRouter()

  const {
    items,
    subtotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart()

  const totalItems = items.reduce((total, item) => total + item.quantity, 0)
  const isEmpty = items.length === 0

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button variant="outline">
            <ShoppingCart className="size-5" />
            <span>{totalItems}</span>
          </Button>
        }
      />

      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Carrinho</SheetTitle>
          <SheetDescription>
            {isEmpty
              ? 'Seu carrinho está vazio.'
              : `Você tem ${totalItems} ${
                  totalItems === 1 ? 'item' : 'itens'
                } no carrinho.`}
          </SheetDescription>
        </SheetHeader>

        {!isEmpty && (
          <>
            <ul className="flex flex-1 flex-col gap-4 overflow-y-auto px-4">
              {items.map((item) => (
                <li key={item.id} className="flex flex-col gap-2 border-b pb-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium">{item.name}</span>

                    <Button
                      variant="ghost"
                      size="icon-xs"
                      aria-label="Remover item"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon-xs"
                        aria-label="Diminuir quantidade"
                        disabled={item.quantity <= 1}
                        onClick={() => decreaseQuantity(item.id)}
                      >
                        <Minus />
                      </Button>

                      <span className="w-8 text-center text-sm">
                        {item.quantity}
                      </span>

                      <Button
                        variant="outline"
                        size="icon-xs"
                        aria-label="Aumentar quantidade"
                        onClick={() => increaseQuantity(item.id)}
                      >
                        <Plus />
                      </Button>
                    </div>

                    <span className="font-medium">
                      {formatPrice(item.priceInCents * item.quantity)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            <SheetFooter>
              <div className="flex items-center justify-between font-semibold">
                <span>Total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <Button
                className="w-full"
                onClick={() => router.push('/checkout')}
              >
                Ir para o resumo
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
