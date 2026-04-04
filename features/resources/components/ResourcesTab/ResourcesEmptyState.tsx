import { Upload } from "lucide-react"

export function ResourcesEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-muted">
        <Upload className="size-6 text-muted-foreground" />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">No resources yet</p>
        <p className="text-xs text-muted-foreground mt-0.5">Resources will appear here once added</p>
      </div>
    </div>
  )
}
