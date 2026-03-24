"use client"

import React from "react"
import { useParams } from "next/navigation"
import { WorkspaceHeader } from "@/features/workspace/components/WorkspaceHeader"
import { WorkspaceRoleProvider } from "@/shared/providers/workspace-role-provider"

function Layout({ children }: { children: React.ReactNode }) {
  const { id } = useParams<{ id: string }>()
  const workspaceId = Number(id)

  return (
    <WorkspaceRoleProvider workspaceId={workspaceId}>
      <WorkspaceHeader />
      <main className="flex flex-1 flex-col mx-auto px-4 py-8 pb-20 sm:px-6 xl:w-7xl">{children}</main>
    </WorkspaceRoleProvider>
  )
}

export default Layout
