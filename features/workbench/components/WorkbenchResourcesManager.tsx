"use client"

import { useState, useEffect } from "react"
import { X, Save, PackageOpen } from "lucide-react"
import { toast } from "sonner"
import { Resource } from "@/types"
import { Button } from "@/shared/ui/button"
import { Skeleton } from "@/shared/ui/skeleton"
import { Separator } from "@/shared/ui/separator"
import { cn } from "@/lib/utils"
import { useGetWorkbenchResources } from "../queries/use-get-workbench-resources"
import { useUpdateWorkbenchResources } from "../mutations/use-update-workbench-resources"
import { useGetResources } from "@/features/resources/queries/use-get-resources"

interface WorkbenchResourcesManagerProps {
  workbenchId: number
  workspaceId: number
}

export function WorkbenchResourcesManager({
  workbenchId,
  workspaceId,
}: WorkbenchResourcesManagerProps) {
  const { data: currentResources, isLoading: loadingCurrent } =
    useGetWorkbenchResources(workbenchId)
  const { data: allResources = [], isLoading: loadingAll } = useGetResources(workspaceId)
  const { mutate: saveResources, isPending: saving } = useUpdateWorkbenchResources(workbenchId)

  // Local selected IDs — initialised from server data once loaded
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [initialised, setInitialised] = useState(false)

  useEffect(() => {
    if (currentResources && !initialised) {
      setSelectedIds(new Set(currentResources.map((r) => r.id)))
      setInitialised(true)
    }
  }, [currentResources, initialised])

  const isLoading = loadingCurrent || loadingAll

  const selectedResources = allResources.filter((r) => selectedIds.has(r.id))
  const availableResources = allResources.filter((r) => !selectedIds.has(r.id))

  function handleRemove(id: number) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  function handleAdd(id: number) {
    setSelectedIds((prev) => new Set(prev).add(id))
  }

  function handleSave() {
    saveResources(
      { workbenchId, resourceIds: Array.from(selectedIds) },
      {
        onSuccess: () => toast.success("Resources saved"),
        onError: () => toast.error("Failed to save resources"),
      }
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="rounded-xl border border-border p-4 flex flex-col gap-3">
          <Skeleton className="h-4 w-32" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-7 w-24 rounded-lg" />
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-border p-4 flex flex-col gap-3">
          <Skeleton className="h-4 w-40" />
          <div className="flex flex-col gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full rounded-md" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Current resources */}
      <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-foreground">
            Assigned resources
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              ({selectedResources.length})
            </span>
          </p>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={saving}
            className="gap-1.5 h-7 px-3 text-xs"
          >
            <Save className="size-3.5" />
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </div>

        <Separator />

        {selectedResources.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {selectedResources.map((resource) => (
              <ResourceChip
                key={resource.id}
                resource={resource}
                onRemove={() => handleRemove(resource.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <PackageOpen className="size-5 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">
              No resources assigned yet. Add some below.
            </p>
          </div>
        )}
      </div>

      {/* Available resources to add */}
      {availableResources.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-3">
          <p className="text-sm font-medium text-foreground">
            Available resources
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              click to add
            </span>
          </p>

          <Separator />

          <div className="flex flex-col gap-1">
            {availableResources.map((resource) => (
              <button
                key={resource.id}
                onClick={() => handleAdd(resource.id)}
                className={cn(
                  "flex items-center gap-2 w-full rounded-lg px-3 py-2 text-left transition-colors",
                  "hover:bg-muted text-sm text-foreground"
                )}
              >
                <span className="flex size-6 items-center justify-center rounded-md bg-muted shrink-0">
                  <ResourceTypeLabel type={resource.type} />
                </span>
                <span className="truncate text-xs">{resource.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {allResources.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border py-12 text-center">
          <PackageOpen className="size-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No resources found in this workspace.
          </p>
        </div>
      )}
    </div>
  )
}

function ResourceChip({
  resource,
  onRemove,
}: {
  resource: Resource
  onRemove: () => void
}) {
  return (
    <div className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/50 pl-2 pr-1 py-1">
      <span className="flex size-5 items-center justify-center shrink-0">
        <ResourceTypeLabel type={resource.type} />
      </span>
      <span className="text-xs text-foreground max-w-[140px] truncate">{resource.name}</span>
      <button
        onClick={onRemove}
        className="text-muted-foreground hover:text-destructive transition-colors p-0.5 rounded"
        aria-label={`Remove ${resource.name}`}
      >
        <X className="size-3" />
      </button>
    </div>
  )
}

function ResourceTypeLabel({ type }: { type: string }) {
  const map: Record<string, string> = {
    pdf: "PDF",
    video: "VID",
    audio: "AUD",
    image: "IMG",
    link: "URL",
    note: "TXT",
  }
  return (
    <span className="text-[9px] font-semibold text-muted-foreground leading-none">
      {map[type] ?? type.slice(0, 3).toUpperCase()}
    </span>
  )
}
