"use client"

import { useParams } from "next/navigation"
import { WorkbenchDetailLayout } from "@/features/workbench/components/WorkbenchDetailLayout"

export default function WorkbenchDetailPage() {
  const { id, workbenchId } = useParams<{ id: string; workbenchId: string }>()
  const workspaceId = Number(id)
  const wbId = Number(workbenchId)

  return <WorkbenchDetailLayout workbenchId={wbId} workspaceId={workspaceId} />
}
