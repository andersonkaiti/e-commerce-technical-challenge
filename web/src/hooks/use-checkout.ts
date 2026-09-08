'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useCart } from './use-cart'

const checkoutSchema = z.object({
  email: z.email('Informe um e-mail válido.'),
})

type CheckoutSchema = z.infer<typeof checkoutSchema>

export function useCheckout() {
  const router = useRouter()

  const { items, subtotal, finalizePurchase, isFinalizingPurchase, clearCart } =
    useCart()

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<CheckoutSchema>({
    resolver: zodResolver(checkoutSchema),
  })

  const isEmpty = items.length === 0

  const submit = handleSubmit(async ({ email }) => {
    await finalizePurchase(email)

    clearCart()

    router.push('/')
  })

  return {
    items,
    subtotal,
    isEmpty,
    submit,
    register,
    isPending: isFinalizingPurchase,
    errors,
  }
}
