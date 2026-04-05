"use client"

import { usePathname } from "next/navigation"
import FullpageSpinner from "@/shared/components/FullpageSpinner"
import { useAuth } from "@/shared/providers/auth-provider"
import { WorkspaceHeader } from "@/features/workspace/components/header/WorkspaceHeader"

function AccessTokenHydratedRoute({ children }: { children: React.ReactNode }) {
  const { isAccessTokenHydrated } = useAuth()
  const pathname = usePathname()

  const isInWorkspace = /^\/workspaces\/\d+/.test(pathname)

  if (!isAccessTokenHydrated) {
    return <FullpageSpinner />
  }

  return (
    <>
      <WorkspaceHeader variant={isInWorkspace ? "workspace" : "simple"} />
      <main className="flex flex-1 flex-col items-center px-6 py-16">
        {children}
      </main>
    </>
  )
}

export default AccessTokenHydratedRoute
