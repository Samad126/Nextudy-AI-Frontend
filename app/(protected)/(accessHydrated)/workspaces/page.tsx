"use client"
import WorkspaceGrid from "@/features/workspace/components/grid/WorkspaceGrid"

export default function WorkspacesPage() {
  return (
    <div className="container">
      <h1 className="text-3xl font-bold text-foreground">
        Choose your workspace
      </h1>
      <p className="mt-2 text-muted-foreground">
        Select a study context to begin. Workspaces isolate your documents and
        progress.
      </p>

      {/* Workspace Grid */}
      <WorkspaceGrid />
    </div>
  )
}
