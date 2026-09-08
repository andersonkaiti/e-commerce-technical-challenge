import { Skeleton } from '@components/ui/skeleton'

export function CheckoutSkeleton() {
  return (
    <div className="space-y-8">
      <ul className="flex flex-col gap-4">
        {Array.from({ length: 3 }, (_, index) => index).map((index) => (
          <li key={index} className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-24" />
            </div>

            <Skeleton className="h-4 w-16" />
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between border-t pt-4">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-24" />
      </div>

      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-full" />
      </div>

      <Skeleton className="h-10 w-full" />
    </div>
  )
}
