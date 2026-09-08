'use client'

import { Alert, AlertDescription, AlertTitle } from '@components/ui/alert'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
import { useCheckout } from '@hooks/use-checkout'
import { AlertCircleIcon, Loader2 } from 'lucide-react'

export function CheckoutForm() {
  const { submit, register, isPending, errors } = useCheckout()

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          type="email"
          placeholder="seu@email.com"
          {...register('email')}
        />

        {errors.email && (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>Erro!</AlertTitle>
            <AlertDescription>{errors.email.message}</AlertDescription>
          </Alert>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <span className="flex items-center gap-2">
            <Loader2 className="size-4 animate-spin" />
            Finalizando...
          </span>
        ) : (
          'Finalizar compra'
        )}
      </Button>
    </form>
  )
}
