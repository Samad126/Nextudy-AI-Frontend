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
import { useLeaveWorkspace } from "@/features/workspace/mutations/use-leave-workspace"
import type { Workspace } from "@/features/workspace/types/workspace"

interface LeaveWorkspaceDialogProps {
  workspace: Workspace
  open: boolean
  onClose: () => void
}

export function LeaveWorkspaceDialog({ workspace, open, onClose }: LeaveWorkspaceDialogProps) {
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
                onError: (err) => toast.error(getApiErrorMessage(err, "Failed to leave workspace")),
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
