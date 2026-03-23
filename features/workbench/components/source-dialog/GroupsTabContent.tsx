"use client"

import { Layers } from "lucide-react"
import { Skeleton } from "@/shared/ui/skeleton"
import { ResourceGroup } from "@/types"
import { GroupSelectItem } from "./GroupSelectItem"

interface GroupsTabContentProps {
  groups: ResourceGroup[]
  isLoading: boolean
  localSelected: Set<number>
  onToggleGroup: (group: ResourceGroup) => void
}

export function GroupsTabContent({
  groups,
  isLoading,
  localSelected,
  onToggleGroup,
}: GroupsTabContentProps) {
  if (isLoading) {
    return (
      <>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-xl" />
        ))}
      </>
    )
  }

  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
        <Layers className="size-5 text-muted-foreground" />
        <p className="text-xs text-muted-foreground">No resource groups created yet.</p>
      </div>
    )
  }

  return (
    <>
      {groups.map((group) => (
        <GroupSelectItem
          key={group.id}
          group={group}
          localSelected={localSelected}
          onToggleGroup={onToggleGroup}
        />
      ))}
    </>
  )
}
