import { Suspense } from 'react'
import { Header } from './_components/header'
import { Products } from './_components/products'
import { ProductsSkeleton } from './_components/products/skeleton'

export default async function Home() {
  return (
    <div className="m-20 mx-auto w-full max-w-7xl space-y-10 p-5">
      <Header />

      <Suspense fallback={<ProductsSkeleton />}>
        <Products />
      </Suspense>
    </div>
  )
}
