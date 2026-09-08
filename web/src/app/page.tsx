import { Header } from './_components/header'
import { Products } from './_components/products'

export default async function Home() {
  return (
    <div className="m-20 mx-auto max-w-7xl space-y-10 p-5">
      <Header />

      <Products />
    </div>
  )
}
