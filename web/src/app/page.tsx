import { Products } from './_components/products'

export default async function Home() {
  return (
    <div className="m-20 mx-auto max-w-7xl space-y-10 p-5">
      <h1 className="font-bold text-4xl tracking-tight">Produtos</h1>

      <Products />
    </div>
  )
}
