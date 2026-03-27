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
import { useDeleteQuiz } from "../mutations/use-delete-quiz"

interface DeleteQuizDialogProps {
  open: boolean
  setOpen: (v: boolean) => void
  quizId: number
  workspaceId: number
  onDeleted?: () => void
}

export function DeleteQuizDialog({ open, setOpen, quizId, workspaceId, onDeleted }: DeleteQuizDialogProps) {
  const { mutate: deleteQuiz, isPending } = useDeleteQuiz(workspaceId)

  function handleDelete() {
    deleteQuiz(quizId, {
      onSuccess: () => {
        toast.success("Quiz deleted")
        setOpen(false)
        onDeleted?.()
      },
      onError: (err) => toast.error(getApiErrorMessage(err, "Failed to delete quiz")),
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete quiz?</DialogTitle>
          <DialogDescription>
            This will delete the quiz and all attempt history. This cannot be undone.
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
