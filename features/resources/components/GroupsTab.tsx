"use client"

import { useState } from "react"
import { FolderPlus, Folders } from "lucide-react"
import { Button } from "@/shared/ui/button"
import { Skeleton } from "@/shared/ui/skeleton"
import { useGetResourceGroups } from "../queries/use-get-resource-groups"
import { useGetResources } from "../queries/use-get-resources"
import { ResourceGroupCard } from "./ResourceGroupCard"
import { CreateGroupDialog } from "./CreateGroupDialog"
import { useWorkspaceRole } from "@/shared/providers/workspace-role-provider"
import { can } from "@/lib/permissions"

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

      {/* List */}
      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-border px-4 py-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-5 w-8 rounded-full ml-2" />
              <div className="ml-auto flex gap-1">
                <Skeleton className="size-6 rounded-md" />
                <Skeleton className="size-6 rounded-md" />
              </div>
            </div>
          ))}
        </div>
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
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-muted">
            <Folders className="size-6 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">No groups yet</p>
            <p className="text-xs text-muted-foreground mt-0.5">Organize your resources into groups</p>
          </div>
          {canEdit && (
            <Button size="sm" variant="outline" onClick={() => setCreateOpen(true)} className="mt-1">
              Create a group
            </Button>
          )}
        </div>
      )}

      <CreateGroupDialog open={createOpen} setOpen={setCreateOpen} workspaceId={workspaceId} />
    </div>
  )
}
