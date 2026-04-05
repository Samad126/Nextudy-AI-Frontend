"use client"

import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { Sparkles, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import { Label } from "@/shared/ui/label"
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select"
import { useRegenerateQuestion } from "../../mutations/use-regenerate-question"
import type { ApiQuestion, ApiQuestionDifficulty, ApiQuestionType, AnswerSource } from "@/types"

interface FormValues {
  regenerateFromScratch: boolean
  questionType: ApiQuestionType
  answerSource: AnswerSource
  difficulty: ApiQuestionDifficulty | ""
}

interface RegenerateQuestionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  question: ApiQuestion | null
  workbenchId: number
}

export function RegenerateQuestionDialog({
  open,
  onOpenChange,
  question,
  workbenchId,
}: RegenerateQuestionDialogProps) {
  const { mutate: regenerate, isPending } = useRegenerateQuestion(workbenchId)

  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      regenerateFromScratch: false,
      questionType: question?.question_type ?? "mcq",
      answerSource: (question?.answer_source ?? "ai") as AnswerSource,
      difficulty: (question?.difficulty ?? "") as ApiQuestionDifficulty | "",
    },
  })

  useEffect(() => {
    if (!question) return
    reset({
      regenerateFromScratch: false,
      questionType: question.question_type,
      answerSource: (question.answer_source ?? "ai") as AnswerSource,
      difficulty: (question.difficulty ?? "") as ApiQuestionDifficulty | "",
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question?.id])

  if (!question) return null

  function onSubmit(data: FormValues) {
    regenerate(
      {
        id: question!.id,
        regenerateFromScratch: data.regenerateFromScratch,
        answerSource: data.answerSource,
        questionType: data.questionType,
        difficulty: (data.difficulty as ApiQuestionDifficulty) || undefined,
      },
      { onSuccess: () => onOpenChange(false) }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Regenerate Question</DialogTitle>
        </DialogHeader>

        {isPending ? (
          <div className="flex flex-col items-center justify-center gap-3 py-10">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Regenerating with AI…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 py-2">
            {/* Regeneration mode */}
            <div className="flex flex-col gap-2">
              <Label>Regeneration mode</Label>
              <Controller
                control={control}
                name="regenerateFromScratch"
                render={({ field }) => (
                  <RadioGroup
                    value={field.value ? "scratch" : "answers"}
                    onValueChange={(v) => field.onChange(v === "scratch")}
                    className="flex flex-col gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="answers" id="mode-answers" />
                      <label htmlFor="mode-answers" className="text-sm cursor-pointer">
                        Keep title, regenerate answers only
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="scratch" id="mode-scratch" />
                      <label htmlFor="mode-scratch" className="text-sm cursor-pointer">
                        Full regeneration (new topic + answers)
                      </label>
                    </div>
                  </RadioGroup>
                )}
              />
            </div>

            {/* Question type */}
            <div className="flex flex-col gap-1.5">
              <Label>Question type</Label>
              <Controller
                control={control}
                name="questionType"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(v) => field.onChange(v as ApiQuestionType)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mcq">Multiple Choice (MCQ)</SelectItem>
                      <SelectItem value="open_ended">Open Ended</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Answer source */}
            <div className="flex flex-col gap-1.5">
              <Label>Answer source</Label>
              <Controller
                control={control}
                name="answerSource"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(v) => field.onChange(v as AnswerSource)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ai">AI</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                      <SelectItem value="file">File</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Difficulty */}
            <div className="flex flex-col gap-1.5">
              <Label>Difficulty (optional)</Label>
              <Controller
                control={control}
                name="difficulty"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(v) => field.onChange(v as ApiQuestionDifficulty)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Same as current" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EASY">Easy</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HARD">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <DialogFooter className="gap-2 flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1 gap-1.5">
                <Sparkles className="size-3.5" />
                Regenerate with AI
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
