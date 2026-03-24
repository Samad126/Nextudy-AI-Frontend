"use client"

import { useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { Plus, Loader2, Settings, LogOut, Trash2, Pencil, Users } from "lucide-react"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { Badge } from "@/shared/ui/badge"
import { Skeleton } from "@/shared/ui/skeleton"
import { Textarea } from "@/shared/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/shared/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import { useGetWorkspaces } from "@/features/workspace/queries/use-get-workspaces"
import { useCreateWorkspace } from "@/features/workspace/mutations/use-create-workspace"
import { useUpdateWorkspace } from "@/features/workspace/mutations/use-update-workspace"
import { useDeleteWorkspace } from "@/features/workspace/mutations/use-delete-workspace"
import { useLeaveWorkspace } from "@/features/workspace/mutations/use-leave-workspace"
import { useMyRoleInWorkspace } from "@/features/workspace/hooks/use-workspace-role"
import { can } from "@/lib/permissions"
import type { Workspace } from "@/features/workspace/types/workspace"

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

/* ── Edit Dialog ──────────────────────────────────────── */
function EditWorkspaceDialog({
  workspace,
  open,
  onClose,
}: {
  workspace: Workspace
  open: boolean
  onClose: () => void
}) {
  const [name, setName] = useState(workspace.name)
  const [desc, setDesc] = useState(workspace.description ?? "")
  const { mutate, isPending } = useUpdateWorkspace()

  function handleSave() {
    const patch: { name?: string; description?: string } = {}
    if (name !== workspace.name) patch.name = name
    if (desc !== (workspace.description ?? "")) patch.description = desc
    if (Object.keys(patch).length === 0) { onClose(); return }

    mutate(
      { id: workspace.id, ...patch },
      {
        onSuccess: () => { toast.success("Workspace updated"); onClose() },
        onError: () => toast.error("Failed to update workspace"),
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Workspace</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="ws-name">Name</Label>
            <Input id="ws-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ws-desc">Description</Label>
            <Textarea
              id="ws-desc"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={isPending || !name.trim()}>
            {isPending && <Loader2 className="size-4 mr-2 animate-spin" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/* ── Delete Dialog ────────────────────────────────────── */
function DeleteWorkspaceDialog({
  workspace,
  open,
  onClose,
}: {
  workspace: Workspace
  open: boolean
  onClose: () => void
}) {
  const { mutate, isPending } = useDeleteWorkspace()

  function handleDelete() {
    mutate(workspace.id, {
      onSuccess: () => { toast.success("Workspace deleted"); onClose() },
      onError: () => toast.error("Failed to delete workspace"),
    })
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Workspace</DialogTitle>
          <DialogDescription>
            This will permanently delete <strong>{workspace.name}</strong> and all its content. This cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
            {isPending && <Loader2 className="size-4 mr-2 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/* ── Leave Dialog ─────────────────────────────────────── */
function LeaveWorkspaceDialog({
  workspace,
  open,
  onClose,
}: {
  workspace: Workspace
  open: boolean
  onClose: () => void
}) {
  const { mutate, isPending } = useLeaveWorkspace()

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Leave Workspace</DialogTitle>
          <DialogDescription>
            You will lose access to <strong>{workspace.name}</strong>.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={() =>
              mutate(workspace.id, {
                onSuccess: () => { toast.success("Left workspace"); onClose() },
                onError: () => toast.error("Failed to leave workspace"),
              })
            }
          >
            {isPending && <Loader2 className="size-4 mr-2 animate-spin" />}
            Leave
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/* ── Create Workspace Form ────────────────────────────── */
function CreateWorkspaceSection() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [desc, setDesc] = useState("")
  const { mutate, isPending } = useCreateWorkspace()

  function handleCreate() {
    if (!name.trim()) return
    mutate(
      { name: name.trim(), description: desc.trim() || undefined },
      {
        onSuccess: () => {
          toast.success("Workspace created")
          setName("")
          setDesc("")
          setOpen(false)
        },
        onError: () => toast.error("Failed to create workspace"),
      }
    )
  }

  return (
    <div>
      {!open ? (
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          <Plus className="size-4 mr-2" />
          New Workspace
        </Button>
      ) : (
        <div className="rounded-lg border border-border p-4 space-y-3">
          <p className="text-sm font-medium text-foreground">Create Workspace</p>
          <div className="space-y-1.5">
            <Label htmlFor="new-ws-name">Name *</Label>
            <Input
              id="new-ws-name"
              placeholder="e.g. CS Study Group"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="new-ws-desc">Description</Label>
            <Input
              id="new-ws-desc"
              placeholder="Optional description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleCreate} disabled={!name.trim() || isPending}>
              {isPending && <Loader2 className="size-3.5 mr-1.5 animate-spin" />}
              Create
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Workspace Card ───────────────────────────────────── */
function WorkspaceCard({ workspace, contextId }: { workspace: Workspace; contextId: string }) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [leaveOpen, setLeaveOpen] = useState(false)
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
              <DropdownMenuItem onClick={() => setEditOpen(true)}>
                <Pencil className="size-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setDeleteOpen(true)}
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
            onClick={() => setLeaveOpen(true)}
          >
            <LogOut className="size-3 mr-1" />
            Leave workspace
          </Button>
        </div>
      )}

      {editOpen && (
        <EditWorkspaceDialog workspace={workspace} open onClose={() => setEditOpen(false)} />
      )}
      {deleteOpen && (
        <DeleteWorkspaceDialog workspace={workspace} open onClose={() => setDeleteOpen(false)} />
      )}
      {leaveOpen && (
        <LeaveWorkspaceDialog workspace={workspace} open onClose={() => setLeaveOpen(false)} />
      )}
    </div>
  )
}

/* ── Main Tab ─────────────────────────────────────────── */
export function WorkspacesTab({ contextId }: { contextId: string }) {
  const { data: workspaces = [], isLoading } = useGetWorkspaces()

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
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
