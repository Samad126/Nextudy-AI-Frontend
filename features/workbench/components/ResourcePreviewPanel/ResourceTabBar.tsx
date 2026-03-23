import { Resource } from "@/types"
import { cn } from "@/lib/utils"
import { ResourceTypeDot } from "./ResourceTypeDot"

export function ResourceTabBar({
  resources,
  activeId,
  onTabClick,
}: {
  resources: Resource[]
  activeId: number | null
  onTabClick: (id: number) => void
}) {
  return (
    <div className="scrollbar-hide flex shrink-0 items-center gap-0 overflow-x-auto border-b border-border">
      {resources.map((r) => (
        <button
          key={r.id}
          onClick={() => onTabClick(r.id)}
          className={cn(
            "flex shrink-0 items-center gap-1.5 border-b-2 px-4 py-2.5 text-xs font-medium whitespace-nowrap transition-colors",
            activeId === r.id
              ? "border-primary bg-muted/30 text-foreground"
              : "border-transparent text-muted-foreground hover:bg-muted/20 hover:text-foreground"
          )}
        >
          <ResourceTypeDot type={r.type} />
          <span className="max-w-[140px] truncate">{r.name}</span>
        </button>
      ))}
    </div>
  )
}
