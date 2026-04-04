"use client"

import { use } from "react"
import { MembersPage } from "@/features/settings/components/MembersPage"

export default function MembersRoute({
  params,
}: {
  params: Promise<{ id: string; workspaceId: string }>
}) {
  const { id, workspaceId } = use(params)
  return <div className="container"><MembersPage contextId={id} workspaceId={Number(workspaceId)} /></div>
}
