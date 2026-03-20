"use client"

import React from "react"
import { WorkspaceHeader } from "@/features/workspace/components/WorkspaceHeader"

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <WorkspaceHeader />
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  )
}

export default Layout
