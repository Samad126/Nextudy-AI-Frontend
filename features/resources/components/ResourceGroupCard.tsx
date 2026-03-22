"use client"

import { useState } from "react"
import { Pencil, Trash2, X, Plus, ChevronDown, ChevronUp } from "lucide-react"
import { toast } from "sonner"
import { Resource, ResourceGroup } from "@/types"
import { Button } from "@/shared/ui/button"
import { Badge } from "@/shared/ui/badge"
import { Separator } from "@/shared/ui/separator"
import { cn } from "@/lib/utils"
import { ResourceTypeIcon } from "./ResourceTypeIcon"
import { RenameGroupDialog } from "./RenameGroupDialog"
import { useDeleteResourceGroup } from "../mutations/use-delete-resource-group"
import { useAddResourceToGroup } from "../mutations/use-add-resource-to-group"
import { useRemoveResourceFromGroup } from "../mutations/use-remove-resource-from-group"

interface ResourceGroupCardProps {
  group: ResourceGroup
  workspaceId: number
  allResources: Resource[]
}

export function ResourceGroupCard({ group, workspaceId, allResources }: ResourceGroupCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [renameOpen, setRenameOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)

  const { mutate: deleteGroup, isPending: deleting } = useDeleteResourceGroup(workspaceId)
  const { mutate: addResource, isPending: adding } = useAddResourceToGroup(workspaceId)
  const { mutate: removeResource } = useRemoveResourceFromGroup(workspaceId)

  const groupResourceIds = new Set(group.resources.map((r) => r.id))
  const availableToAdd = allResources.filter((r) => !groupResourceIds.has(r.id))

  function handleDelete() {
    deleteGroup(group.id, {
      onSuccess: () => toast.success("Group deleted"),
      onError: () => toast.error("Failed to delete group"),
    })
  }

  function handleRemove(resourceId: number) {
    removeResource(
      { groupId: group.id, resourceId },
      {
        onSuccess: () => toast.success("Removed from group"),
        onError: () => toast.error("Failed to remove resource"),
      }
    )
  }

  function handleAdd(resourceId: number) {
    addResource(
      { groupId: group.id, resourceId },
      {
        onSuccess: () => {
          toast.success("Added to group")
          setAddOpen(false)
        },
        onError: () => toast.error("Failed to add resource"),
      }
    )
  }

  return (
    <>
      <div className="rounded-xl border border-border bg-card overflow-hidden transition-all duration-200 hover:border-primary/20">
        {/* Header row */}
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-2 flex-1 min-w-0 text-left"
          >
            <span className="font-medium text-sm text-foreground truncate">{group.name}</span>
            <Badge variant="secondary" className="shrink-0 text-xs font-normal">
              {group.resources.length}
            </Badge>
            {expanded ? (
              <ChevronUp className="size-4 text-muted-foreground ml-auto shrink-0" />
            ) : (
              <ChevronDown className="size-4 text-muted-foreground ml-auto shrink-0" />
            )}
          </button>

          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon-xs"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => setRenameOpen(true)}
              aria-label="Rename group"
            >
              <Pencil className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              onClick={handleDelete}
              disabled={deleting}
              aria-label="Delete group"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        </div>

        {/* Expanded section */}
        {expanded && (
          <>
            <Separator />
            <div className="px-4 py-3 flex flex-col gap-3">
              {/* Resource chips */}
              {group.resources.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {group.resources.map((resource) => (
                    <div
                      key={resource.id}
                      className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/50 pl-2 pr-1 py-1"
                    >
                      <ResourceTypeIcon type={resource.type} size="sm" />
                      <span className="text-xs text-foreground max-w-[120px] truncate">
                        {resource.name}
                      </span>
                      <button
                        onClick={() => handleRemove(resource.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors p-0.5 rounded"
                        aria-label={`Remove ${resource.name}`}
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No resources in this group yet.</p>
              )}

              {/* Add resource */}
              {availableToAdd.length > 0 && (
                <div className="relative">
                  {addOpen ? (
                    <div className="rounded-lg border border-border bg-popover shadow-md p-1 max-h-48 overflow-y-auto">
                      {availableToAdd.map((resource) => (
                        <button
                          key={resource.id}
                          onClick={() => handleAdd(resource.id)}
                          disabled={adding}
                          className={cn(
                            "flex items-center gap-2 w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                            "hover:bg-muted"
                          )}
                        >
                          <ResourceTypeIcon type={resource.type} size="sm" />
                          <span className="truncate text-xs">{resource.name}</span>
                        </button>
                      ))}
                      <Separator className="my-1" />
                      <button
                        onClick={() => setAddOpen(false)}
                        className="flex items-center gap-2 w-full rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:bg-muted transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1.5 text-muted-foreground hover:text-foreground h-7 px-2 text-xs"
                      onClick={() => setAddOpen(true)}
                    >
                      <Plus className="size-3.5" />
                      Add resource
                    </Button>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <RenameGroupDialog
        open={renameOpen}
        setOpen={setRenameOpen}
        workspaceId={workspaceId}
        groupId={group.id}
        currentName={group.name}
      />
    </>
  )
}
