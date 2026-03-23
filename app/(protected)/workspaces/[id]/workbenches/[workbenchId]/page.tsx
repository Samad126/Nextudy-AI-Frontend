"use client"

import { useParams } from "next/navigation"
import { WorkbenchResourcesManager } from "@/features/workbench/components/WorkbenchResourcesManager"

export default function WorkbenchDetailPage() {
  const { id, workbenchId } = useParams<{ id: string; workbenchId: string }>()
  const workspaceId = Number(id)
  const wbId = Number(workbenchId)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">
          Workbench Resources
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage resources assigned to this workbench.
        </p>
      </div>
      <WorkbenchResourcesManager workbenchId={wbId} workspaceId={workspaceId} />
    </div>
  )
}
