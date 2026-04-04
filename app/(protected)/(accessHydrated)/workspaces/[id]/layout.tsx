"use client"

import React from "react"
import { useParams } from "next/navigation"
import { WorkspaceRoleProvider } from "@/shared/providers/workspace-role-provider"

function Layout({ children }: { children: React.ReactNode }) {
  const { id } = useParams<{ id: string }>()
  const workspaceId = Number(id)

  return (
    <WorkspaceRoleProvider workspaceId={workspaceId}>
      {children}
    </WorkspaceRoleProvider>
  )
}

export default Layout
