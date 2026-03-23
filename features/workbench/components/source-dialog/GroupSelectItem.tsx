"use client"

import { Layers } from "lucide-react"
import { Checkbox } from "@/shared/ui/checkbox"
import { ResourceGroup } from "@/types"
import { cn } from "@/lib/utils"

type SelectionState = "all" | "some" | "none"

function getSelectionState(group: ResourceGroup, localSelected: Set<number>): SelectionState {
  if (group.resources.length === 0) return "none"
  const selectedCount = group.resources.filter((r) => localSelected.has(r.id)).length
  if (selectedCount === 0) return "none"
  if (selectedCount === group.resources.length) return "all"
  return "some"
}

interface GroupSelectItemProps {
  group: ResourceGroup
  localSelected: Set<number>
  onToggleGroup: (group: ResourceGroup) => void
}

export function GroupSelectItem({ group, localSelected, onToggleGroup }: GroupSelectItemProps) {
  const state = getSelectionState(group, localSelected)
  const checked = state === "all" ? true : state === "some" ? "indeterminate" : false

  return (
    <div
      onClick={() => onToggleGroup(group)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onToggleGroup(group)}
      className={cn(
        "flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-colors",
        state !== "none" ? "border-primary bg-primary/5" : "border-border hover:bg-muted/40"
      )}
    >
      <Checkbox
        checked={checked}
        onCheckedChange={() => onToggleGroup(group)}
        onClick={(e) => e.stopPropagation()}
      />
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted">
          <Layers className="size-3.5 text-muted-foreground" />
        </div>
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-sm font-medium text-foreground truncate leading-tight">
            {group.name}
          </span>
          <span className="text-xs text-muted-foreground">
            {group.resources.length} resource{group.resources.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </div>
  )
}
