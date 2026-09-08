import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@components/ui/card'
import { Skeleton } from '@components/ui/skeleton'

export function ProductsSkeleton() {
  return (
    <main className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {Array.from({ length: 6 }, (_, index) => index).map((index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-5 w-2/3" />
            </CardTitle>
          </CardHeader>

          <CardContent className="grow">
            <CardDescription className="flex h-full flex-col justify-between gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>

              <Skeleton className="h-20 w-full rounded-sm" />
            </CardDescription>
          </CardContent>

          <CardFooter className="flex flex-col justify-between gap-2 lg:flex-row">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-9 w-full md:w-fit md:px-10" />
          </CardFooter>
        </Card>
      ))}
    </main>
  )
}
