"use client"

import { useState } from "react"
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

  const [regenerateFromScratch, setRegenerateFromScratch] = useState(false)
  const [questionType, setQuestionType] = useState<ApiQuestionType>(question?.question_type ?? "mcq")
  const [answerSource, setAnswerSource] = useState<AnswerSource>(question?.answer_source ?? "ai")
  const [difficulty, setDifficulty] = useState<ApiQuestionDifficulty | "">(question?.difficulty ?? "")

  if (!question) return null

  const fileDisabled = questionType === "mcq"

  function handleRegenerate() {
    if (!question) return
    regenerate(
      {
        id: question.id,
        regenerateFromScratch,
        answerSource: fileDisabled && answerSource === "file" ? "ai" : answerSource,
        questionType,
        difficulty: (difficulty as ApiQuestionDifficulty) || undefined,
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
          <div className="flex flex-col gap-5 py-2">
            {/* Regeneration mode */}
            <div className="flex flex-col gap-2">
              <Label>Regeneration mode</Label>
              <RadioGroup
                value={regenerateFromScratch ? "scratch" : "answers"}
                onValueChange={(v) => setRegenerateFromScratch(v === "scratch")}
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
            </div>

            {/* Question type */}
            <div className="flex flex-col gap-1.5">
              <Label>Question type</Label>
              <Select
                value={questionType}
                onValueChange={(v) => setQuestionType(v as ApiQuestionType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mcq">Multiple Choice (MCQ)</SelectItem>
                  <SelectItem value="open_ended">Open Ended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Answer source */}
            <div className="flex flex-col gap-1.5">
              <Label>Answer source</Label>
              <Select
                value={answerSource}
                onValueChange={(v) => setAnswerSource(v as AnswerSource)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ai">AI</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                  <SelectItem value="file" disabled={fileDisabled}>
                    File {fileDisabled ? "(unavailable for MCQ)" : ""}
                  </SelectItem>
                </SelectContent>
              </Select>
              {fileDisabled && answerSource === "file" && (
                <p className="text-xs text-destructive">
                  File-verbatim answers are not supported for MCQ
                </p>
              )}
            </div>

            {/* Difficulty */}
            <div className="flex flex-col gap-1.5">
              <Label>Difficulty (optional)</Label>
              <Select
                value={difficulty}
                onValueChange={(v) => setDifficulty(v as ApiQuestionDifficulty)}
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
            </div>
          </div>
        )}

        {!isPending && (
          <DialogFooter className="gap-2 flex-row">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button onClick={handleRegenerate} className="flex-1 gap-1.5">
              <Sparkles className="size-3.5" />
              Regenerate with AI
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
