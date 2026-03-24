"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Textarea } from "@/shared/ui/textarea"
import { Label } from "@/shared/ui/label"
import { useCreateQuiz } from "../mutations/use-create-quiz"

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
})
type FormValues = z.infer<typeof schema>

interface CreateQuizFromSelectionDialogProps {
  open: boolean
  setOpen: (v: boolean) => void
  workspaceId: number
  questionIds: number[]
  onSuccess?: () => void
}

export function CreateQuizFromSelectionDialog({
  open,
  setOpen,
  workspaceId,
  questionIds,
  onSuccess,
}: CreateQuizFromSelectionDialogProps) {
  const router = useRouter()
  const { mutate: create, isPending } = useCreateQuiz(workspaceId)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  function handleOpenChange(v: boolean) {
    if (!v) reset()
    setOpen(v)
  }

  function onSubmit(values: FormValues) {
    create(
      {
        workspaceId,
        title: values.title,
        description: values.description || undefined,
        questionIds,
      },
      {
        onSuccess: (data) => {
          toast.success("Quiz created!")
          handleOpenChange(false)
          onSuccess?.()
          router.push(`/workspaces/${workspaceId}/quizzes/${data.id}`)
        },
        onError: () => toast.error("Failed to create quiz"),
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Create quiz</DialogTitle>
          <DialogDescription>
            {questionIds.length} question{questionIds.length !== 1 ? "s" : ""} selected
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-1">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="quiz-title-sel">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="quiz-title-sel"
              placeholder="e.g. Midterm Practice Quiz"
              autoFocus
              {...register("title")}
            />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="quiz-desc-sel">Description</Label>
            <Textarea
              id="quiz-desc-sel"
              placeholder="Optional description"
              rows={2}
              className="resize-none"
              {...register("description")}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Quiz"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
