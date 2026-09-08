'use client'

import { toast } from '@components/ui/toast'
import type { IProduct } from '@entities/product'
import { formatPrice } from '@utils/format-price'
import { createContext, type PropsWithChildren, useState } from 'react'

interface ICartContext {
  items: IProduct[]
  subtotal: number
  handleAddToCart: (product: IProduct) => void
  increaseQuantity: (productId: string) => void
  decreaseQuantity: (productId: string) => void
  removeFromCart: (productId: string) => void
  clearCart: () => void
}

export const CartContext = createContext({} as ICartContext)

export function CartProvider({ children }: PropsWithChildren) {
  const [items, setItems] = useState<IProduct[]>([])

  const subtotal = items.reduce(
    (total, item) => total + item.priceInCents * item.quantity,
    0,
  )

  function clearCart() {
    setItems([])
  }

  function handleAddToCart(product: IProduct) {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id)

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      }

      return [...prevItems, { ...product, quantity: 1 }]
    })

    toast.add({
      title: `${product.name} adicionado com sucesso!`,
      description: formatPrice(product.priceInCents),
    })
  }

  function increaseQuantity(productId: string) {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    )
  }

  function decreaseQuantity(productId: string) {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      ),
    )
  }

  function removeFromCart(productId: string) {
    setItems((prevItems) => prevItems.filter((item) => item.id !== productId))
  }

  return (
    <CartContext
      value={{
        items,
        subtotal,
        handleAddToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext>
  )
}
