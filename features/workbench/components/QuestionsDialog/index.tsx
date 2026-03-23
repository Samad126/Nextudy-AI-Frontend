"use client"

import { useState } from "react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import { Label } from "@/shared/ui/label"
import { Input } from "@/shared/ui/input"
import { useCreateQuestions } from "../../mutations/use-create-questions"
import type {
  GenerationMode,
  AnswerSource,
  AnswerSchema,
  GenerationScope,
  ApiQuestionDifficultyMixed,
  CreateQuestionsInput,
} from "@/types"

interface QuestionsDialogProps {
  open: boolean
  setOpen: (v: boolean) => void
  workbenchId: number
  /** When true, the title says "Regenerate Questions" instead of "Generate Questions" */
  isRegenerate?: boolean
}

const SEGMENT_BASE =
  "flex-1 rounded-md py-1 text-xs font-medium transition-colors cursor-pointer"
const SEGMENT_ACTIVE = "bg-background shadow-sm text-foreground"
const SEGMENT_INACTIVE = "text-muted-foreground hover:text-foreground"

function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T
  onChange: (v: T) => void
  options: { label: string; value: T }[]
}) {
  return (
    <div className="flex gap-0.5 rounded-lg bg-muted p-0.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`${SEGMENT_BASE} ${value === opt.value ? SEGMENT_ACTIVE : SEGMENT_INACTIVE}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

function SelectField<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: T
  onChange: (v: T) => void
  options: { label: string; value: T }[]
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs font-medium">{label}</Label>
      <div className="flex gap-1.5 flex-wrap">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`rounded-md border px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
              value === opt.value
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/30"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export function QuestionsDialog({
  open,
  setOpen,
  workbenchId,
  isRegenerate = false,
}: QuestionsDialogProps) {
  const { mutate: createQuestions, isPending } = useCreateQuestions(workbenchId)

  const [generationMode, setGenerationMode] = useState<GenerationMode>("AI_GENERATED")
  const [answerSource, setAnswerSource] = useState<AnswerSource>("file")
  const [userQuestions, setUserQuestions] = useState("")
  const [answerSchema, setAnswerSchema] = useState<AnswerSchema>("MCQ")
  const [difficulty, setDifficulty] = useState<ApiQuestionDifficultyMixed>("MIXED")
  const [generationScope, setGenerationScope] = useState<GenerationScope>("FIXED")
  const [count, setCount] = useState<string>("10")

  function handleClose() {
    setOpen(false)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const input: CreateQuestionsInput = {
      workbenchId,
      generationMode,
      answerSource,
    }

    if (generationMode === "USER_PROVIDED") {
      input.questions = userQuestions
    } else {
      input.answerSchema = answerSchema
      input.difficulty = difficulty
      input.generationScope = generationScope
      if (generationScope === "FIXED") {
        const parsed = parseInt(count)
        input.count = isNaN(parsed) ? 10 : Math.max(1, Math.min(50, parsed))
      }
    }

    createQuestions(input, {
      onSuccess: () => {
        toast.success(isRegenerate ? "Questions regenerated" : "Questions generated")
        setOpen(false)
      },
      onError: () => toast.error("Failed to generate questions"),
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isRegenerate ? "Regenerate Questions" : "Generate Questions"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-2">
          {/* Generation mode */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium">Mode</Label>
            <SegmentedControl
              value={generationMode}
              onChange={setGenerationMode}
              options={[
                { label: "AI Generated", value: "AI_GENERATED" },
                { label: "User Provided", value: "USER_PROVIDED" },
              ]}
            />
          </div>

          {/* Answer source */}
          <SelectField
            label="Answer Source"
            value={answerSource}
            onChange={setAnswerSource}
            options={[
              { label: "From File", value: "file" },
              { label: "AI", value: "ai" },
              { label: "Mixed", value: "mixed" },
            ]}
          />

          {generationMode === "USER_PROVIDED" ? (
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium">Your Questions</Label>
              <textarea
                value={userQuestions}
                onChange={(e) => setUserQuestions(e.target.value)}
                placeholder="Enter your questions, one per line or separated by numbers..."
                rows={5}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
              />
            </div>
          ) : (
            <>
              <SelectField
                label="Answer Schema"
                value={answerSchema}
                onChange={setAnswerSchema}
                options={[
                  { label: "MCQ", value: "MCQ" },
                  { label: "Open Ended", value: "OPEN_ENDED" },
                  { label: "Mixed", value: "MIXED" },
                ]}
              />

              <SelectField
                label="Difficulty"
                value={difficulty}
                onChange={setDifficulty}
                options={[
                  { label: "Easy", value: "EASY" },
                  { label: "Medium", value: "MEDIUM" },
                  { label: "Hard", value: "HARD" },
                  { label: "Mixed", value: "MIXED" },
                ]}
              />

              <SelectField
                label="Generation Scope"
                value={generationScope}
                onChange={setGenerationScope}
                options={[
                  { label: "Fixed Count", value: "FIXED" },
                  { label: "Exhaustive", value: "EXHAUSTIVE" },
                ]}
              />

              {generationScope === "FIXED" && (
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-medium">
                    Number of Questions{" "}
                    <span className="text-muted-foreground font-normal">(1–50)</span>
                  </Label>
                  <Input
                    type="number"
                    min={1}
                    max={50}
                    value={count}
                    onChange={(e) => setCount(e.target.value)}
                    className="h-8 text-sm w-24"
                  />
                </div>
              )}
            </>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? isRegenerate
                  ? "Regenerating..."
                  : "Generating..."
                : isRegenerate
                  ? "Regenerate"
                  : "Generate"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
