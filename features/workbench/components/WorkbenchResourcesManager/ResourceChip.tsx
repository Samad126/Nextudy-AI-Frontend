import { X } from "lucide-react"
import { Resource } from "@/types"
import { ResourceTypeLabel } from "./ResourceTypeLabel"

export function ResourceChip({
  resource,
  onRemove,
}: {
  resource: Resource
  onRemove: () => void
}) {
  return (
    <div className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/50 pl-2 pr-1 py-1">
      <span className="flex size-5 items-center justify-center shrink-0">
        <ResourceTypeLabel type={resource.type} />
      </span>
      <span className="text-xs text-foreground max-w-[140px] truncate">{resource.name}</span>
      <button
        onClick={onRemove}
        className="text-muted-foreground hover:text-destructive transition-colors p-0.5 rounded"
        aria-label={`Remove ${resource.name}`}
      >
        <X className="size-3" />
      </button>
    </div>
  )
}
