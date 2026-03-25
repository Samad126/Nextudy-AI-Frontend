"use client"

import { useState } from "react"
import Link from "next/link"
import { Settings, LogOut, Trash2, Pencil, Users } from "lucide-react"
import { Button } from "@/shared/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import { useMyRoleInWorkspace } from "@/features/workspace/hooks/use-workspace-role"
import { can } from "@/lib/permissions"
import type { Workspace } from "@/features/workspace/types/workspace"
import { EditWorkspaceDialog } from "./EditWorkspaceDialog"
import { DeleteWorkspaceDialog } from "./DeleteWorkspaceDialog"
import { LeaveWorkspaceDialog } from "./LeaveWorkspaceDialog"

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

interface WorkspaceCardProps {
  workspace: Workspace
  contextId: string
}

export function WorkspaceCard({ workspace, contextId }: WorkspaceCardProps) {
  const [activeDialog, setActiveDialog] = useState<"edit" | "delete" | "leave" | null>(null)
  const role = useMyRoleInWorkspace(workspace.id)
  const isAdmin = role !== undefined && can.adminWorkspace(role)
  const canLeave = role !== undefined && can.leaveWorkspace(role)

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-foreground truncate">{workspace.name}</p>
          {workspace.description && (
            <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
              {workspace.description}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1.5">
            Created {formatDate(workspace.created_at)}
          </p>
        </div>
        {isAdmin && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="size-3.5 mr-1.5" />
                Manage
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/workspaces/${contextId}/settings/workspaces/${workspace.id}/members`}>
                  <Users className="size-4 mr-2" />
                  Manage Members
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveDialog("edit")}>
                <Pencil className="size-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setActiveDialog("delete")}
              >
                <Trash2 className="size-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {canLeave && (
        <div className="mt-3 flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground text-xs h-7"
            onClick={() => setActiveDialog("leave")}
          >
            <LogOut className="size-3 mr-1" />
            Leave workspace
          </Button>
        </div>
      )}

      {activeDialog === "edit" && (
        <EditWorkspaceDialog workspace={workspace} open onClose={() => setActiveDialog(null)} />
      )}
      {activeDialog === "delete" && (
        <DeleteWorkspaceDialog workspace={workspace} open onClose={() => setActiveDialog(null)} />
      )}
      {activeDialog === "leave" && (
        <LeaveWorkspaceDialog workspace={workspace} open onClose={() => setActiveDialog(null)} />
      )}
    </div>
  )
}
