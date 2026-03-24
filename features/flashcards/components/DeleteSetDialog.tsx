"use client"

import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import { useDeleteFlashcardSet } from "../mutations/use-delete-flashcard-set"

interface DeleteSetDialogProps {
  open: boolean
  setOpen: (v: boolean) => void
  setId: number
  workspaceId: number
  onDeleted?: () => void
}

export function DeleteSetDialog({ open, setOpen, setId, workspaceId, onDeleted }: DeleteSetDialogProps) {
  const { mutate: deleteSet, isPending } = useDeleteFlashcardSet(workspaceId)

  function handleDelete() {
    deleteSet(setId, {
      onSuccess: () => {
        toast.success("Flashcard set deleted")
        setOpen(false)
        onDeleted?.()
      },
      onError: () => toast.error("Failed to delete flashcard set"),
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete flashcard set?</DialogTitle>
          <DialogDescription>
            This will permanently delete the set and all its cards. This cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 mt-2">
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
