"use client"

import FullpageSpinner from "@/shared/components/FullpageSpinner"
import { useAuth } from "@/shared/providers/auth-provider"

function WorkspaceAuthWrapper({ children }: { children: React.ReactNode }) {
  const { isAccessTokenHydrated } = useAuth()

  if (!isAccessTokenHydrated) {
    return <FullpageSpinner />
  }

  return <>{children}</>
}

export default WorkspaceAuthWrapper
