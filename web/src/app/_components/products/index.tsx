import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@components/ui/card'
import { getProducts } from '@http/get-products'
import { formatPrice } from '@utils/format-price'
import Image from 'next/image'
import { AddProduct } from '../add-product'

export async function Products() {
  const { data: products } = await getProducts()

  return (
    <main className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {products?.map((product, index) => (
        <Card key={product.id}>
          <CardHeader>
            <CardTitle>{product.name}</CardTitle>
          </CardHeader>

          <CardContent className="grow">
            <CardDescription className="flex h-full flex-col justify-between gap-4">
              {product.description}

              <div className="relative h-20 w-full overflow-hidden rounded-sm">
                <Image
                  alt={product.name}
                  src={product.imageUrl}
                  className="absolute object-cover"
                  fill
                  sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                  priority={index < 3}
                />
              </div>
            </CardDescription>
          </CardContent>

          <CardFooter className="flex flex-col justify-between gap-2 lg:flex-row">
            <span>{formatPrice(product.priceInCents)}</span>

            <AddProduct product={product} />
          </CardFooter>
        </Card>
      ))}
    </main>
  )
}
