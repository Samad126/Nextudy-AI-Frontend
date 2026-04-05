import { Skeleton } from "@/shared/ui/skeleton"

export function AttemptDetailSkeleton() {
  return (
    <div className="container flex flex-col gap-4 max-w-2xl mx-auto w-full">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-20 w-full rounded-xl" />
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-24 w-full rounded-xl" />
      ))}
    </div>
  )
}
