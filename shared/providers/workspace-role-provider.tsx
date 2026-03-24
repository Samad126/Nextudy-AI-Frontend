"use client"

import { createContext, useContext } from "react"
import { useMyRoleInWorkspace } from "@/features/workspace/hooks/use-workspace-role"
import type { Role } from "@/features/workspace/types/workspace"

interface WorkspaceRoleContextValue {
  role: Role | undefined
}

const WorkspaceRoleContext = createContext<WorkspaceRoleContextValue>({
  role: undefined,
})

export function useWorkspaceRole() {
  return useContext(WorkspaceRoleContext)
}

export function WorkspaceRoleProvider({
  children,
  workspaceId,
}: {
  children: React.ReactNode
  workspaceId: number
}) {
  const role = useMyRoleInWorkspace(workspaceId)
  return (
    <WorkspaceRoleContext.Provider value={{ role }}>
      {children}
    </WorkspaceRoleContext.Provider>
  )
}
