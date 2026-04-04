import { Skeleton } from "@/shared/ui/skeleton"

export function GroupsLoadingSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-xl border border-border px-4 py-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-5 w-8 rounded-full ml-2" />
          <div className="ml-auto flex gap-1">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="size-6 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  )
}
