"use client"

import { useParams } from "next/navigation"
import { WorkbenchList } from "@/features/workbench/components/WorkbenchList"

export default function WorkbenchesPage() {
  const { id } = useParams<{ id: string }>()
  const workspaceId = Number(id)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">Workbenches</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Organize your study sessions with focused workbenches.
        </p>
      </div>
      <WorkbenchList workspaceId={workspaceId} />
    </div>
  )
}
