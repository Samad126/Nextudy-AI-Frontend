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
  DialogDescription,
  DialogFooter,
} from "@/shared/ui/dialog"
import { useRemoveMember } from "@/features/workspace/mutations/use-remove-member"
import type { WorkspaceMember } from "@/features/workspace/types/workspace"

interface RemoveMemberDialogProps {
  member: WorkspaceMember
  workspaceId: number
  open: boolean
  onClose: () => void
}

export function RemoveMemberDialog({ member, workspaceId, open, onClose }: RemoveMemberDialogProps) {
  const { mutate, isPending } = useRemoveMember()

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove Member</DialogTitle>
          <DialogDescription>
            Remove <strong>{member.user.firstName} {member.user.lastName}</strong> from this workspace?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={() =>
              mutate(
                { workspaceId, memberId: member.id },
                {
                  onSuccess: () => { toast.success("Member removed"); onClose() },
                  onError: (err) => toast.error(getApiErrorMessage(err, "Failed to remove member")),
                }
              )
            }
          >
            {isPending && <Loader2 className="size-4 mr-2 animate-spin" />}
            Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
