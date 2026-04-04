"use client"

import { useState } from "react"
import { FolderPlus } from "lucide-react"
import { Button } from "@/shared/ui/button"
import { Skeleton } from "@/shared/ui/skeleton"
import { useGetResourceGroups } from "../../queries/use-get-resource-groups"
import { useGetResources } from "../../queries/use-get-resources"
import { useWorkspaceRole } from "@/shared/providers/workspace-role-provider"
import { can } from "@/lib/permissions"
import { ResourceGroupCard } from "./ResourceGroupCard"
import { CreateGroupDialog } from "./CreateGroupDialog"
import { GroupsLoadingSkeleton } from "./GroupsLoadingSkeleton"
import { GroupsEmptyState } from "./GroupsEmptyState"

interface GroupsTabProps {
  workspaceId: number
}

export function GroupsTab({ workspaceId }: GroupsTabProps) {
  const [createOpen, setCreateOpen] = useState(false)
  const { data: groups, isLoading } = useGetResourceGroups(workspaceId)
  const { data: allResources = [] } = useGetResources(workspaceId)
  const { role } = useWorkspaceRole()
  const canEdit = role !== undefined && can.editContent(role)

  return (
    <div className="flex flex-col gap-4">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {isLoading ? (
            <Skeleton className="h-4 w-20" />
          ) : (
            <>{groups?.length ?? 0} group{groups?.length !== 1 ? "s" : ""}</>
          )}
        </span>
        {canEdit && (
          <Button size="sm" onClick={() => setCreateOpen(true)} className="gap-1.5">
            <FolderPlus className="size-3.5" />
            New Group
          </Button>
        )}
      </div>

      {/* List / empty states */}
      {isLoading ? (
        <GroupsLoadingSkeleton />
      ) : groups && groups.length > 0 ? (
        <div className="flex flex-col gap-2">
          {groups.map((group) => (
            <ResourceGroupCard
              key={group.id}
              group={group}
              workspaceId={workspaceId}
              allResources={allResources}
            />
          ))}
        </div>
      ) : (
        <GroupsEmptyState canEdit={canEdit} onCreateClick={() => setCreateOpen(true)} />
      )}

      <CreateGroupDialog open={createOpen} setOpen={setCreateOpen} workspaceId={workspaceId} />
    </div>
  )
}
