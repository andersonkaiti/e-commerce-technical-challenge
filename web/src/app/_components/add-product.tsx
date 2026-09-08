'use client'

import { Button } from '@components/ui/button'
import type { IProduct } from '@entities/product'
import { useCart } from '@hooks/use-cart'

interface IAddToCartButtonProps {
  product: IProduct
}

export function AddProduct({ product }: IAddToCartButtonProps) {
  const { handleAddToCart } = useCart()

  return (
    <Button
      className="w-full lg:w-fit"
      onClick={() => handleAddToCart(product)}
    >
      Adicionar ao carrinho
    </Button>
  )
}
