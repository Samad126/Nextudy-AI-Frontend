"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { getApiErrorMessage } from "@/lib/api/get-api-error"
import { Loader2, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import { useGetResources } from "@/features/resources/queries/use-get-resources"
import { useCreateFlashcardSet } from "../../mutations/use-create-flashcard-set"
import { StepDetails } from "./StepDetails"
import { StepResources } from "./StepResources"
import type { Difficulty } from "../../types/flashcard"

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).optional(),
  count: z.number().min(1).max(20),
  resourceIds: z.array(z.number()).min(1, "Select at least 1 resource"),
})

export type CreateSetFormValues = z.infer<typeof schema>

interface CreateFlashcardSetModalProps {
  open: boolean
  setOpen: (v: boolean) => void
  workspaceId: number
}

export function CreateFlashcardSetModal({ open, setOpen, workspaceId }: CreateFlashcardSetModalProps) {
  const [step, setStep] = useState<1 | 2>(1)
  const router = useRouter()
  const { data: resources = [] } = useGetResources(workspaceId)
  const { mutate: create, isPending } = useCreateFlashcardSet(workspaceId)

  const form = useForm<CreateSetFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { count: 5, resourceIds: [] },
  })

  function handleOpenChange(v: boolean) {
    if (!v) {
      form.reset()
      setStep(1)
    }
    setOpen(v)
  }

  async function handleNext() {
    const valid = await form.trigger(["title", "description", "difficulty", "count"])
    if (valid) setStep(2)
  }

  function onSubmit(values: CreateSetFormValues) {
    create(
      {
        workspaceId,
        title: values.title,
        description: values.description || undefined,
        difficulty: values.difficulty as Difficulty | undefined,
        count: values.count,
        resourceIds: values.resourceIds,
      },
      {
        onSuccess: (data) => {
          toast.success("Flashcard set created!")
          handleOpenChange(false)
          router.push(`/workspaces/${workspaceId}/flashcards/${data.id}`)
        },
        onError: (err) => toast.error(getApiErrorMessage(err, "Failed to create flashcard set")),
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === 1 ? "New flashcard set" : "Select resources"}
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

        {isPending ? (
          <div className="flex flex-col items-center gap-3 py-10">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground text-center">
              Generating flashcards with AI… this may take a moment.
            </p>
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
            {step === 1 ? (
              <StepDetails form={form} />
            ) : (
              <StepResources form={form} resources={resources} />
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
                  <Sparkles className="size-3.5 mr-1.5" />
                  Generate with AI
                </Button>
              )}
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
