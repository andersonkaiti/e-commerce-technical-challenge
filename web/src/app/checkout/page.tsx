'use client'

import { Button } from '@components/ui/button'
import { useCart } from '@hooks/use-cart'
import { useRouter } from 'next/navigation'
import { CheckoutForm } from './_components/checkout-form'
import { OrderSummary } from './_components/order-summary'

export default function CheckoutPage() {
  const router = useRouter()

  const { items } = useCart()

  const isEmpty = items.length === 0

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8 p-5 py-20">
      <div className="flex items-center justify-between gap-2">
        <h1 className="font-bold text-3xl tracking-tight">Resumo da compra</h1>

        <Button variant="outline" onClick={() => router.push('/')}>
          Voltar
        </Button>
      </div>

      {isEmpty ? (
        <p className="text-muted-foreground">Seu carrinho está vazio.</p>
      ) : (
        <>
          <OrderSummary />

          <CheckoutForm />
        </>
      )}
    </div>
  )
}
