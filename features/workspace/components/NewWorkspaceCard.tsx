import { Plus } from "lucide-react"
import { memo } from "react"

function NewWorkspaceCard() {
  return (
    <div className="group flex h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card p-5 text-muted-foreground transition-all hover:border-primary hover:text-primary hover:shadow-md">
      <div className="flex size-9 items-center justify-center rounded-full border-2 border-current transition-transform group-hover:scale-110">
        <Plus className="size-4" />
      </div>
      <span className="text-sm font-medium">New workspace</span>
      <span className="text-xs opacity-70">Start a fresh project</span>
    </div>
  )
}

export default memo(NewWorkspaceCard)
