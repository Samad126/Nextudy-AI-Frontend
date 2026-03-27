"use client"

import { useParams } from "next/navigation"
import { WorkbenchDetailLayout } from "@/features/workbench/components/WorkbenchDetailLayout"
import { SocketProvider } from "@/shared/providers/socket-provider"

export default function WorkbenchDetailPage() {
  const { id, workbenchId } = useParams<{ id: string; workbenchId: string }>()
  const workspaceId = Number(id)
  const wbId = Number(workbenchId)

  return (
    <SocketProvider>
      <WorkbenchDetailLayout workbenchId={wbId} workspaceId={workspaceId} />
    </SocketProvider>
  )
}
