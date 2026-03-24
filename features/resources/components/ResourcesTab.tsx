"use client"

import { useState } from "react"
import { useDrop } from "react-dnd"
import { NativeTypes } from "react-dnd-html5-backend"
import { Upload } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/shared/ui/button"
import { Skeleton } from "@/shared/ui/skeleton"
import { useGetResources } from "../queries/use-get-resources"
import { useGetResourceGroups } from "../queries/use-get-resource-groups"
import { useUploadResource } from "../mutations/use-upload-resource"
import { ResourceCard } from "./ResourceCard"
import { UploadDialog } from "./UploadDialog"
import { toast } from "sonner"
import { useWorkspaceRole } from "@/shared/providers/workspace-role-provider"
import { can } from "@/lib/permissions"

interface ResourcesTabProps {
  workspaceId: number
}

export function ResourcesTab({ workspaceId }: ResourcesTabProps) {
  const [uploadOpen, setUploadOpen] = useState(false)
  const { data: resources, isLoading } = useGetResources(workspaceId)
  const { data: groups = [] } = useGetResourceGroups(workspaceId)
  const { mutate: upload } = useUploadResource(workspaceId)
  const { role } = useWorkspaceRole()
  const canEdit = role !== undefined && can.editContent(role)

  const [{ isOver }, dropRef] = useDrop({
    accept: [NativeTypes.FILE],
    drop(item: { files: File[] }) {
      const file = item.files?.[0]
      if (!file) return
      upload(file, {
        onSuccess: () => toast.success("Resource uploaded"),
        onError: () => toast.error("Failed to upload resource"),
      })
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  })

  return (
    <div className="flex flex-col gap-4">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {isLoading ? (
            <Skeleton className="h-4 w-24" />
          ) : (
            <>{resources?.length ?? 0} resource{resources?.length !== 1 ? "s" : ""}</>
          )}
        </span>
        {canEdit && (
          <Button size="sm" onClick={() => setUploadOpen(true)} className="gap-1.5">
            <Upload className="size-3.5" />
            Upload
          </Button>
        )}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl border border-border p-3.5">
              <Skeleton className="size-10 rounded-lg shrink-0" />
              <div className="flex-1 min-w-0 flex flex-col gap-2 pt-0.5">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : resources && resources.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} workspaceId={workspaceId} groups={groups} />
          ))}
        </div>
      ) : canEdit ? (
        <div
          ref={dropRef as unknown as React.RefObject<HTMLDivElement>}
          className={cn(
            "flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed py-16 text-center transition-colors",
            isOver
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/30"
          )}
        >
          <div className={cn(
            "flex size-14 items-center justify-center rounded-full transition-colors",
            isOver ? "bg-primary/10" : "bg-muted"
          )}>
            <Upload className={cn("size-6 transition-colors", isOver ? "text-primary" : "text-muted-foreground")} />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {isOver ? "Drop to upload" : "No resources yet"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isOver ? "Release to start uploading" : "Drag a file here or click upload"}
            </p>
          </div>
          {!isOver && (
            <Button size="sm" variant="outline" onClick={() => setUploadOpen(true)} className="mt-1">
              Upload a file
            </Button>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-muted">
            <Upload className="size-6 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">No resources yet</p>
            <p className="text-xs text-muted-foreground mt-0.5">Resources will appear here once added</p>
          </div>
        </div>
      )}

      <UploadDialog open={uploadOpen} setOpen={setUploadOpen} workspaceId={workspaceId} />
    </div>
  )
}
