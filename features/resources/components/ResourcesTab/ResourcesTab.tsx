"use client"

import { useState } from "react"
import { Upload } from "lucide-react"
import { Skeleton } from "@/shared/ui/skeleton"
import { Button } from "@/shared/ui/button"
import { toast } from "sonner"
import { getApiErrorMessage } from "@/lib/api/get-api-error"
import { useGetResources } from "../../queries/use-get-resources"
import { useGetResourceGroups } from "../../queries/use-get-resource-groups"
import { useUploadResource } from "../../mutations/use-upload-resource"
import { useWorkspaceRole } from "@/shared/providers/workspace-role-provider"
import { can } from "@/lib/permissions"
import { ResourceCard } from "./ResourceCard"
import { UploadDialog } from "./UploadDialog"
import { ResourcesLoadingSkeleton } from "./ResourcesLoadingSkeleton"
import { ResourcesDropZone } from "./ResourcesDropZone"
import { ResourcesEmptyState } from "./ResourcesEmptyState"

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

  function handleDrop(file: File) {
    upload(file, {
      onSuccess: () => toast.success("Resource uploaded"),
      onError: (err) => toast.error(getApiErrorMessage(err, "Failed to upload resource")),
    })
  }

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

      {/* Grid / empty states */}
      {isLoading ? (
        <ResourcesLoadingSkeleton />
      ) : resources && resources.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} workspaceId={workspaceId} groups={groups} />
          ))}
        </div>
      ) : canEdit ? (
        <ResourcesDropZone onDrop={handleDrop} onUploadClick={() => setUploadOpen(true)} />
      ) : (
        <ResourcesEmptyState />
      )}

      <UploadDialog open={uploadOpen} setOpen={setUploadOpen} workspaceId={workspaceId} />
    </div>
  )
}
