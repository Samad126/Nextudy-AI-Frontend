"use client"

import { useEffect } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { getApiErrorMessage } from "@/lib/api/get-api-error"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/shared/ui/sheet"
import { Button } from "@/shared/ui/button"
import { Label } from "@/shared/ui/label"
import { Textarea } from "@/shared/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select"
import { Flashcard } from "../../types/flashcard"
import { useUpdateFlashcard } from "../../mutations/use-update-flashcard"

const schema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).optional(),
})
type FormValues = z.infer<typeof schema>

interface EditCardSheetProps {
  open: boolean
  setOpen: (v: boolean) => void
  card: Flashcard
  setId: number
}

export function EditCardSheet({ open, setOpen, card, setId }: EditCardSheetProps) {
  const { mutate: update, isPending } = useUpdateFlashcard(setId)

  const { register, handleSubmit, reset, setValue, control, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      question: card.question,
      answer: card.answer,
      difficulty: card.difficulty,
    },
  })

  const difficulty = useWatch({ control, name: "difficulty" })

  useEffect(() => {
    reset({ question: card.question, answer: card.answer, difficulty: card.difficulty })
  }, [card, reset])

  function onSubmit(values: FormValues) {
    update(
      { setId, cardId: card.id, ...values },
      {
        onSuccess: () => {
          toast.success("Card updated")
          setOpen(false)
        },
        onError: (err) => toast.error(getApiErrorMessage(err, "Failed to update card")),
      }
    )
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="flex flex-col gap-0 sm:max-w-md">
        <SheetHeader className="pb-4 border-b border-border">
          <SheetTitle>Edit card</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 py-5 flex-1 overflow-y-auto">
          <div className="flex flex-col gap-1.5">
            <Label>Question <span className="text-destructive">*</span></Label>
            <Textarea
              rows={4}
              className="resize-none"
              {...register("question")}
            />
            {errors.question && <p className="text-xs text-destructive">{errors.question.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Answer <span className="text-destructive">*</span></Label>
            <Textarea
              rows={4}
              className="resize-none"
              {...register("answer")}
            />
            {errors.answer && <p className="text-xs text-destructive">{errors.answer.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Difficulty</Label>
            <Select
              value={difficulty ?? ""}
              onValueChange={(v) =>
                setValue("difficulty", v as "EASY" | "MEDIUM" | "HARD" | undefined)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EASY">Easy</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HARD">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 mt-auto pt-4 border-t border-border">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
