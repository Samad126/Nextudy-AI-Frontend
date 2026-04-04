"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { getApiErrorMessage } from "@/lib/api/get-api-error"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Textarea } from "@/shared/ui/textarea"
import { Label } from "@/shared/ui/label"
import { useUpdateFlashcardSet } from "../mutations/use-update-flashcard-set"

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
})
type FormValues = z.infer<typeof schema>

interface EditSetDialogProps {
  open: boolean
  setOpen: (v: boolean) => void
  set: { id: number; title: string; description?: string }
  workspaceId: number
}

export function EditSetDialog({ open, setOpen, set, workspaceId }: EditSetDialogProps) {
  const { mutate: update, isPending } = useUpdateFlashcardSet(workspaceId)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: set.title,
      description: set.description ?? "",
    },
  })

  useEffect(() => {
    reset({
      title: set.title,
      description: set.description ?? "",
    })
  }, [set, reset])

  function onSubmit(values: FormValues) {
    update(
      {
        id: set.id,
        title: values.title,
        description: values.description || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Set updated")
          setOpen(false)
        },
        onError: (err) => toast.error(getApiErrorMessage(err, "Failed to update set")),
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit flashcard set</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 mt-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input id="edit-title" {...register("title")} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-desc">Description</Label>
            <Textarea
              id="edit-desc"
              rows={3}
              className="resize-none"
              {...register("description")}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
