"use client"

import Header from "@/features/workspace/components/Header"
import WorkspaceGrid from "@/features/workspace/components/WorkspaceGrid"

export default function WorkspacesPage() {
  return (
    <>
      {/* Header */}
      <Header />

      {/* Main */}
      <main className="flex flex-1 flex-col items-center px-6 py-16">
        <div className="w-full max-w-3xl">
          <h1 className="text-3xl font-bold text-foreground">
            Choose your workspace
          </h1>
          <p className="mt-2 text-muted-foreground">
            Select a study context to begin. Workspaces isolate your documents
            and progress.
          </p>

          {/* Workspace Grid */}
          <WorkspaceGrid />
        </div>
      </main>
    </>
  )
}
