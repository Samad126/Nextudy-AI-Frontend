"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/shared/ui/button"
import { ResourceGroup } from "@/types"
import { useGetResources } from "@/features/resources/queries/use-get-resources"
import { useGetResourceGroups } from "@/features/resources/queries/use-get-resource-groups"
import { useUpdateWorkbenchResources } from "../../mutations/use-update-workbench-resources"
import { SourceDialogTabBar } from "./SourceDialogTabBar"
import { ResourcesTabContent } from "./ResourcesTabContent"
import { GroupsTabContent } from "./GroupsTabContent"

type SourceTab = "resources" | "groups"

interface SelectSourceDialogContentProps {
  workspaceId: number
  workbenchId: number
  selectedIds: Set<number>
  onConfirm: (ids: Set<number>) => void
  onClose: () => void
}

export function SelectSourceDialogContent({
  workspaceId,
  workbenchId,
  selectedIds,
  onConfirm,
  onClose,
}: SelectSourceDialogContentProps) {
  const [activeTab, setActiveTab] = useState<SourceTab>("resources")
  // Initialises from props on mount — no useEffect needed (component remounts on open)
  const [localSelected, setLocalSelected] = useState<Set<number>>(() => new Set(selectedIds))

  const { data: resources = [], isLoading: loadingResources } = useGetResources(workspaceId)
  const { data: groups = [], isLoading: loadingGroups } = useGetResourceGroups(workspaceId)
  const { mutate: updateResources, isPending } = useUpdateWorkbenchResources(workbenchId)

  function handleToggleResource(id: number) {
    setLocalSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  function handleToggleGroup(group: ResourceGroup) {
    const groupIds = group.resources.map((r) => r.id)
    const allSelected = groupIds.every((id) => localSelected.has(id))

    setLocalSelected((prev) => {
      const next = new Set(prev)
      if (allSelected) {
        groupIds.forEach((id) => next.delete(id))
      } else {
        groupIds.forEach((id) => next.add(id))
      }
      return next
    })
  }

  function handleConfirm() {
    updateResources(
      { workbenchId, resourceIds: Array.from(localSelected) },
      {
        onSuccess: () => {
          onConfirm(localSelected)
          onClose()
        },
        onError: () => toast.error("Failed to update study context"),
      }
    )
  }

  return (
    <>
      <SourceDialogTabBar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="px-4 py-3 flex flex-col gap-2 max-h-72 overflow-y-auto">
        {activeTab === "resources" && (
          <ResourcesTabContent
            resources={resources}
            isLoading={loadingResources}
            localSelected={localSelected}
            onToggle={handleToggleResource}
          />
        )}
        {activeTab === "groups" && (
          <GroupsTabContent
            groups={groups}
            isLoading={loadingGroups}
            localSelected={localSelected}
            onToggleGroup={handleToggleGroup}
          />
        )}
      </div>

      <div className="px-4 pb-4 pt-2">
        <Button className="w-full" onClick={handleConfirm} disabled={isPending}>
          {isPending ? "Saving..." : "Confirm Study Context"}
        </Button>
      </div>
    </>
  )
}
