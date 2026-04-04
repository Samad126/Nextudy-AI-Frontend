"use client"

import { Trash2, FolderPlus, Check } from "lucide-react"
import { toast } from "sonner"
import { getApiErrorMessage } from "@/lib/api/get-api-error"
import { Resource, ResourceGroup } from "@/types"
import { Button } from "@/shared/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { ResourceTypeIcon } from "./ResourceTypeIcon"
import { useDeleteResource } from "../../mutations/use-delete-resource"
import { useAddResourceToGroup } from "../../mutations/use-add-resource-to-group"
import { useRemoveResourceFromGroup } from "../../mutations/use-remove-resource-from-group"
import { useWorkspaceRole } from "@/shared/providers/workspace-role-provider"
import { can } from "@/lib/permissions"

interface ResourceCardProps {
  resource: Resource
  workspaceId: number
  groups: ResourceGroup[]
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function ResourceCard({ resource, workspaceId, groups }: ResourceCardProps) {
  const { mutate: deleteResource, isPending: deleting } = useDeleteResource(workspaceId)
  const { mutate: addToGroup, isPending: adding } = useAddResourceToGroup(workspaceId)
  const { mutate: removeFromGroup, isPending: removing } = useRemoveResourceFromGroup(workspaceId)
  const { role } = useWorkspaceRole()
  const canEdit = role !== undefined && can.editContent(role)

  // which groups currently contain this resource
  const memberGroupIds = new Set(
    groups.filter((g) => g.resources.some((r) => r.id === resource.id)).map((g) => g.id)
  )

  function handleDelete() {
    deleteResource(resource.id, {
      onSuccess: () => toast.success("Resource deleted"),
      onError: (err) => toast.error(getApiErrorMessage(err, "Failed to delete resource")),
    })
  }

  function handleToggleGroup(group: ResourceGroup) {
    const inGroup = memberGroupIds.has(group.id)
    if (inGroup) {
      removeFromGroup(
        { groupId: group.id, resourceId: resource.id },
        {
          onSuccess: () => toast.success(`Removed from "${group.name}"`),
          onError: (err) => toast.error(getApiErrorMessage(err, "Failed to remove from group")),
        }
      )
    } else {
      addToGroup(
        { groupId: group.id, resourceId: resource.id },
        {
          onSuccess: () => toast.success(`Added to "${group.name}"`),
          onError: (err) => toast.error(getApiErrorMessage(err, "Failed to add to group")),
        }
      )
    }
  }

  const isBusy = adding || removing

  return (
    <div
      className={cn(
        "group relative flex items-start gap-3 rounded-xl border border-border bg-card p-3.5 transition-all duration-200",
        "hover:border-primary/30 hover:shadow-sm"
      )}
    >
      <ResourceTypeIcon type={resource.type} size="md" />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate leading-snug" title={resource.name}>
          {resource.name}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground">{formatBytes(resource.file_size)}</span>
          <span className="text-xs text-muted-foreground/50">·</span>
          <span className="text-xs text-muted-foreground">{formatDate(resource.created_at)}</span>
        </div>
      </div>

      {canEdit && (
        <div className={cn("flex items-center gap-0.5 shrink-0 transition-opacity")}>
          {/* Add to group */}
          {groups.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="text-muted-foreground hover:text-foreground"
                  disabled={isBusy}
                  aria-label="Add to group"
                >
                  <FolderPlus className="size-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                  Add to group
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {groups.map((group) => {
                  const inGroup = memberGroupIds.has(group.id)
                  return (
                    <DropdownMenuItem
                      key={group.id}
                      onClick={() => handleToggleGroup(group)}
                      className="flex items-center justify-between gap-2 cursor-pointer"
                    >
                      <span className="truncate text-sm">{group.name}</span>
                      {inGroup && <Check className="size-3.5 text-primary shrink-0" />}
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Delete */}
          <Button
            variant="ghost"
            size="icon-xs"
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={handleDelete}
            disabled={deleting}
            aria-label="Delete resource"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      )}
    </div>
  )
}
