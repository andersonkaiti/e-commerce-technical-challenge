import { CartSheet } from './cart-sheet'

export function Header() {
  return (
    <header className="flex w-full justify-between">
      <div className="space-y-4">
        <h1 className="font-bold text-4xl tracking-tighter">Produtos</h1>

        <p className="text-muted-foreground">
          Adicione os produtos ao carrinho!
        </p>
      </div>

      <CartSheet />
    </header>
  )
}
