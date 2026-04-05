"use client"

import { Skeleton } from "@/shared/ui/skeleton"
import { useGetWorkspaces } from "@/features/workspace/queries/use-get-workspaces"
import { CreateWorkspaceSection } from "./CreateWorkspaceSection"
import { WorkspaceCard } from "./WorkspaceCard"

export function WorkspacesTab({ contextId }: { contextId: string }) {
  const { data: workspaces = [], isLoading } = useGetWorkspaces()

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">My Workspaces</h2>
          <p className="text-sm text-muted-foreground">Manage your workspaces and members.</p>
        </div>
        <CreateWorkspaceSection />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => <Skeleton key={i} className="h-28 rounded-lg" />)}
        </div>
      ) : workspaces.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border py-12 text-center text-muted-foreground">
          No workspaces yet. Create one above!
        </div>
      ) : (
        <div className="space-y-3">
          {workspaces.map((ws) => (
            <WorkspaceCard key={ws.id} workspace={ws} contextId={contextId} />
          ))}
        </div>
      )}
    </div>
  )
}
