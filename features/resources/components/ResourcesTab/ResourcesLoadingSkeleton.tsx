import { Skeleton } from "@/shared/ui/skeleton"

export function ResourcesLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 rounded-xl border border-border p-3.5">
          <Skeleton className="size-10 rounded-lg shrink-0" />
          <div className="flex-1 min-w-0 flex flex-col gap-2 pt-0.5">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}
