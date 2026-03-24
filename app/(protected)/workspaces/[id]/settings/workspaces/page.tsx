"use client"

import { use } from "react"
import { WorkspacesTab } from "@/features/settings/components/WorkspacesTab"

export default function WorkspacesSettingsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  return <WorkspacesTab contextId={id} />
}
