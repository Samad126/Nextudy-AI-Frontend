"use client"

import React from "react"
import { WorkspaceHeader } from "@/features/workspace/components/WorkspaceHeader"

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <WorkspaceHeader />
      <main className="flex flex-1 flex-col mx-auto px-4 py-8 sm:px-6 xl:w-7xl">{children}</main>
    </>
  )
}

export default Layout
