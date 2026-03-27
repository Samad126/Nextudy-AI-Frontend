import { ChevronDown, MousePointerClick, RefreshCw, X, ClipboardList, CheckSquare } from "lucide-react"
import { Button } from "@/shared/ui/button"

interface QAToolbarProps {
  onRegenerate: () => void
  selectMode: boolean
  selectedCount: number
  totalCount: number
  onToggleSelectMode: () => void
  onCreateQuiz: () => void
  onSelectAll: () => void
}

export function QAToolbar({
  onRegenerate,
  selectMode,
  selectedCount,
  totalCount,
  onToggleSelectMode,
  onCreateQuiz,
  onSelectAll,
}: QAToolbarProps) {
  const allSelected = totalCount > 0 && selectedCount === totalCount

  return (
    <div className="flex flex-wrap items-center justify-between mb-3 shrink-0 gap-2">
      <div className="flex items-center gap-1.5">
        <Button variant="outline" size="sm" className="gap-1.5 text-xs h-7 px-3">
          <ChevronDown className="size-3.5" />
          EXPORT
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs h-7 px-3"
          onClick={onRegenerate}
        >
          <RefreshCw className="size-3.5" />
          REGENERATE
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {selectMode && (
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs h-7 px-3"
            onClick={onSelectAll}
          >
            <CheckSquare className="size-3.5" />
            {allSelected ? "DESELECT ALL" : "SELECT ALL"}
          </Button>
        )}
        {selectMode && selectedCount > 0 && (
          <Button
            size="sm"
            className="gap-1.5 text-xs h-7 px-3"
            onClick={onCreateQuiz}
          >
            <ClipboardList className="size-3.5" />
            Create Quiz ({selectedCount})
          </Button>
        )}
        <Button
          variant={selectMode ? "secondary" : "outline"}
          size="sm"
          className="gap-1.5 text-xs h-7 px-3"
          onClick={onToggleSelectMode}
        >
          {selectMode ? (
            <>
              <X className="size-3.5" />
              CANCEL
            </>
          ) : (
            <>
              <MousePointerClick className="size-3.5" />
              SELECT
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
