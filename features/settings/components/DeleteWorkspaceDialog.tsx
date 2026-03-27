"use client"

import { toast } from "sonner"
import { getApiErrorMessage } from "@/lib/api/get-api-error"
import { Loader2 } from "lucide-react"
import { Button } from "@/shared/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/shared/ui/dialog"
import { useDeleteWorkspace } from "@/features/workspace/mutations/use-delete-workspace"
import type { Workspace } from "@/features/workspace/types/workspace"

interface DeleteWorkspaceDialogProps {
  workspace: Workspace
  open: boolean
  onClose: () => void
}

export function DeleteWorkspaceDialog({ workspace, open, onClose }: DeleteWorkspaceDialogProps) {
  const { mutate, isPending } = useDeleteWorkspace()

  function handleDelete() {
    mutate(workspace.id, {
      onSuccess: () => { toast.success("Workspace deleted"); onClose() },
      onError: (err) => toast.error(getApiErrorMessage(err, "Failed to delete workspace")),
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
