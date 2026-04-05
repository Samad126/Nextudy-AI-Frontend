import { MousePointerClick } from "lucide-react"

export function QAEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 h-full py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <MousePointerClick className="size-5 text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-foreground">No resources selected</p>
        <p className="text-xs text-muted-foreground">
          Select study materials using the Resources button above.
        </p>
      </div>
    </div>
  )
}
