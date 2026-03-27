"use client"

import { toast } from "sonner"
import { getApiErrorMessage } from "@/lib/api/get-api-error"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import { useDeleteFlashcard } from "../../mutations/use-delete-flashcard"

interface DeleteCardDialogProps {
  open: boolean
  setOpen: (v: boolean) => void
  setId: number
  cardId: number
}

export function DeleteCardDialog({ open, setOpen, setId, cardId }: DeleteCardDialogProps) {
  const { mutate: deleteCard, isPending } = useDeleteFlashcard(setId)

  function handleDelete() {
    deleteCard(
      { setId, cardId },
      {
        onSuccess: () => {
          toast.success("Card deleted")
          setOpen(false)
        },
        onError: (err) => toast.error(getApiErrorMessage(err, "Failed to delete card")),
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete this card?</DialogTitle>
          <DialogDescription>This cannot be undone.</DialogDescription>
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
