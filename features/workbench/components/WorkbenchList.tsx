"use client"

import { useState } from "react"
import { Plus, LayoutDashboard } from "lucide-react"
import { Button } from "@/shared/ui/button"
import { Skeleton } from "@/shared/ui/skeleton"
import { useGetWorkbenches } from "../queries/use-get-workbenches"
import { WorkbenchCard } from "./WorkbenchCard"
import { CreateWorkbenchDialog } from "./CreateWorkbenchDialog"
import { useWorkspaceRole } from "@/shared/providers/workspace-role-provider"
import { can } from "@/lib/permissions"

interface WorkbenchListProps {
  workspaceId: number
}

export function WorkbenchList({ workspaceId }: WorkbenchListProps) {
  const [createOpen, setCreateOpen] = useState(false)
  const { data: workbenches, isLoading } = useGetWorkbenches(workspaceId)
  const { role } = useWorkspaceRole()
  const canEdit = role !== undefined && can.editContent(role)

  return (
    <div className="flex flex-col gap-4">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {isLoading ? (
            <Skeleton className="h-4 w-24" />
          ) : (
            <>
              {workbenches?.length ?? 0} workbench{workbenches?.length !== 1 ? "es" : ""}
            </>
          )}
        </span>
        {canEdit && (
          <Button size="sm" onClick={() => setCreateOpen(true)} className="gap-1.5">
            <Plus className="size-3.5" />
            New Workbench
          </Button>
        )}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-border px-4 py-4 flex flex-col gap-2"
            >
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-64" />
              <Skeleton className="h-3 w-20 self-end mt-1" />
            </div>
          ))}
        </div>
      ) : workbenches && workbenches.length > 0 ? (
        <div className="flex flex-col gap-2">
          {workbenches.map((workbench) => (
            <WorkbenchCard
              key={workbench.id}
              workbench={workbench}
              workspaceId={workspaceId}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-muted">
            <LayoutDashboard className="size-6 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">No workbenches yet</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Create a workbench to organize your study sessions
            </p>
          </div>
          {canEdit && (
            <Button size="sm" variant="outline" onClick={() => setCreateOpen(true)} className="mt-1">
              Create a workbench
            </Button>
          )}
        </div>
      )}

      <CreateWorkbenchDialog
        open={createOpen}
        setOpen={setCreateOpen}
        workspaceId={workspaceId}
      />
    </div>
  )
}
