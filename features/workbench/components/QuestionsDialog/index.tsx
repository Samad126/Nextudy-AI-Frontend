"use client"

import { useForm, Controller } from "react-hook-form"
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

interface FormValues {
  generationMode: GenerationMode
  answerSource: AnswerSource
  userQuestions: string
  answerSchema: AnswerSchema
  difficulty: ApiQuestionDifficultyMixed
  generationScope: GenerationScope
  count: string
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

  const { control, handleSubmit, watch, register } = useForm<FormValues>({
    defaultValues: {
      generationMode: "AI_GENERATED",
      answerSource: "file",
      userQuestions: "",
      answerSchema: "MCQ",
      difficulty: "MIXED",
      generationScope: "FIXED",
      count: "10",
    },
  })

  const generationMode = watch("generationMode")
  const generationScope = watch("generationScope")

  function onSubmit(data: FormValues) {
    const input: CreateQuestionsInput = {
      workbenchId,
      generationMode: data.generationMode,
      answerSource: data.answerSource,
    }

    if (data.generationMode === "USER_PROVIDED") {
      input.questions = data.userQuestions
    } else {
      input.answerSchema = data.answerSchema
      input.difficulty = data.difficulty
      input.generationScope = data.generationScope
      if (data.generationScope === "FIXED") {
        const parsed = parseInt(data.count)
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

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 mt-2">
          {/* Generation mode */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium">Mode</Label>
            <Controller
              control={control}
              name="generationMode"
              render={({ field }) => (
                <SegmentedControl
                  value={field.value}
                  onChange={field.onChange}
                  options={[
                    { label: "AI Generated", value: "AI_GENERATED" },
                    { label: "User Provided", value: "USER_PROVIDED" },
                  ]}
                />
              )}
            />
          </div>

          {/* Answer source */}
          <Controller
            control={control}
            name="answerSource"
            render={({ field }) => (
              <SelectField
                label="Answer Source"
                value={field.value}
                onChange={field.onChange}
                options={[
                  { label: "From File", value: "file" },
                  { label: "AI", value: "ai" },
                  { label: "Mixed", value: "mixed" },
                ]}
              />
            )}
          />

          {generationMode === "USER_PROVIDED" ? (
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium">Your Questions</Label>
              <textarea
                {...register("userQuestions")}
                placeholder="Enter your questions, one per line or separated by numbers..."
                rows={5}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
              />
            </div>
          ) : (
            <>
              <Controller
                control={control}
                name="answerSchema"
                render={({ field }) => (
                  <SelectField
                    label="Answer Schema"
                    value={field.value}
                    onChange={field.onChange}
                    options={[
                      { label: "MCQ", value: "MCQ" },
                      { label: "Open Ended", value: "OPEN_ENDED" },
                      { label: "Mixed", value: "MIXED" },
                    ]}
                  />
                )}
              />

              <Controller
                control={control}
                name="difficulty"
                render={({ field }) => (
                  <SelectField
                    label="Difficulty"
                    value={field.value}
                    onChange={field.onChange}
                    options={[
                      { label: "Easy", value: "EASY" },
                      { label: "Medium", value: "MEDIUM" },
                      { label: "Hard", value: "HARD" },
                      { label: "Mixed", value: "MIXED" },
                    ]}
                  />
                )}
              />

              <Controller
                control={control}
                name="generationScope"
                render={({ field }) => (
                  <SelectField
                    label="Generation Scope"
                    value={field.value}
                    onChange={field.onChange}
                    options={[
                      { label: "Fixed Count", value: "FIXED" },
                      { label: "Exhaustive", value: "EXHAUSTIVE" },
                    ]}
                  />
                )}
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
                    {...register("count")}
                    className="h-8 text-sm w-24"
                  />
                </div>
              )}
            </>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
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
