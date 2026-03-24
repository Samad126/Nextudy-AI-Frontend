"use client"

import FullpageSpinner from "@/shared/components/FullpageSpinner"
import { useAuth } from "@/shared/providers/auth-provider"
import { SocketProvider } from "@/shared/providers/socket-provider"

function WorkspaceAuthWrapper({ children }: { children: React.ReactNode }) {
  const { isAccessTokenHydrated } = useAuth()

  if (!isAccessTokenHydrated) {
    return <FullpageSpinner />
  }

  return <SocketProvider>{children}</SocketProvider>
}

export default WorkspaceAuthWrapper
