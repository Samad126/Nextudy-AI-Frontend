import { ChevronDown, MousePointerClick } from "lucide-react"
import { Button } from "@/shared/ui/button"

export function QAToolbar() {
  return (
    <div className="flex items-center justify-between mb-3 shrink-0">
      <Button variant="outline" size="sm" className="gap-1.5 text-xs h-7 px-3">
        <ChevronDown className="size-3.5" />
        EXPORT
      </Button>
      <Button variant="outline" size="sm" className="gap-1.5 text-xs h-7 px-3">
        <MousePointerClick className="size-3.5" />
        SELECT
      </Button>
    </div>
  )
}
