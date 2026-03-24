"use client"

import { useState } from "react"
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
} from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import { useGetWorkspaceQuestions } from "../../queries/use-get-workspace-questions"
import { useCreateQuiz } from "../../mutations/use-create-quiz"
import { StepDetails } from "./StepDetails"
import { StepQuestions } from "./StepQuestions"

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  questionIds: z.array(z.number()).min(1, "Select at least 1 question"),
})

export type CreateQuizFormValues = z.infer<typeof schema>

interface CreateQuizModalProps {
  open: boolean
  setOpen: (v: boolean) => void
  workspaceId: number
}

export function CreateQuizModal({ open, setOpen, workspaceId }: CreateQuizModalProps) {
  const [step, setStep] = useState<1 | 2>(1)
  const router = useRouter()
  const { data: questions = [] } = useGetWorkspaceQuestions(workspaceId)
  const { mutate: create, isPending } = useCreateQuiz(workspaceId)

  const form = useForm<CreateQuizFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { questionIds: [] },
  })

  function handleOpenChange(v: boolean) {
    if (!v) {
      form.reset()
      setStep(1)
    }
    setOpen(v)
  }

  async function handleNext() {
    const valid = await form.trigger(["title", "description"])
    if (valid) setStep(2)
  }

  function onSubmit(values: CreateQuizFormValues) {
    create(
      {
        workspaceId,
        title: values.title,
        description: values.description || undefined,
        questionIds: values.questionIds,
      },
      {
        onSuccess: (data) => {
          toast.success("Quiz created!")
          handleOpenChange(false)
          router.push(`/workspaces/${workspaceId}/quizzes/${data.id}`)
        },
        onError: () => toast.error("Failed to create quiz"),
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {step === 1 ? "New quiz" : "Select questions"}
          </DialogTitle>
        </DialogHeader>

        {/* Step indicators */}
        <div className="flex gap-1.5 mb-1">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors ${
                s <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {step === 1 ? (
            <StepDetails form={form} />
          ) : (
            <StepQuestions form={form} questions={questions} />
          )}

          <div className="flex justify-between gap-2">
            {step === 2 ? (
              <Button type="button" variant="ghost" onClick={() => setStep(1)}>
                Back
              </Button>
            ) : (
              <div />
            )}

            {step === 1 ? (
              <Button type="button" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Create Quiz"}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
