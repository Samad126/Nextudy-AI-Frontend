"use client"

import { useEffect } from "react"
import { useForm, useFieldArray, Controller } from "react-hook-form"
import { Plus, Trash2 } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/shared/ui/sheet"
import { Button } from "@/shared/ui/button"
import { Label } from "@/shared/ui/label"
import { Input } from "@/shared/ui/input"
import { Textarea } from "@/shared/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select"
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group"
import { Checkbox } from "@/shared/ui/checkbox"
import { Slider } from "@/shared/ui/slider"
import { useUpdateQuestion } from "../../mutations/use-update-question"
import type { ApiQuestion, ApiQuestionDifficulty } from "@/types"

interface MCQChoiceRow {
  id?: number
  choice_text: string
  choice_order: number
  is_correct: boolean
}

interface KeywordRow {
  id?: number
  keyword: string
  weight: number
  is_required: boolean
}

interface FormValues {
  title: string
  difficulty: ApiQuestionDifficulty | ""
  explanation: string
  choices: MCQChoiceRow[]
  sampleAnswer: string
  keywords: KeywordRow[]
}

interface EditQuestionDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  question: ApiQuestion | null
  workbenchId: number
}

export function EditQuestionDrawer({
  open,
  onOpenChange,
  question,
  workbenchId,
}: EditQuestionDrawerProps) {
  const { mutate: updateQuestion, isPending } = useUpdateQuestion(workbenchId)

  const { register, control, handleSubmit, reset, watch, setValue, getValues } =
    useForm<FormValues>({
      defaultValues: {
        title: "",
        difficulty: "",
        explanation: "",
        choices: [],
        sampleAnswer: "",
        keywords: [],
      },
    })

  const {
    fields: choiceFields,
    append: appendChoice,
    remove: removeChoice,
  } = useFieldArray({ control, name: "choices" })

  const {
    fields: keywordFields,
    append: appendKeyword,
    remove: removeKeyword,
  } = useFieldArray({ control, name: "keywords" })

  useEffect(() => {
    if (!question) return
    const choices: MCQChoiceRow[] =
      question.question_type === "mcq"
        ? [...question.mcqChoices]
            .sort((a, b) => a.choice_order - b.choice_order)
            .map((c) => ({
              id: c.id,
              choice_text: c.choice_text,
              choice_order: c.choice_order,
              is_correct: c.is_correct,
            }))
        : []
    const keywords: KeywordRow[] =
      question.question_type === "open_ended" && question.openEndedAnswer
        ? question.openEndedAnswer.gradingKeywords.map((k) => ({
            id: k.id,
            keyword: k.keyword,
            weight: parseFloat(k.weight as unknown as string),
            is_required: k.is_required,
          }))
        : []
    reset({
      title: question.title,
      difficulty: question.difficulty ?? "",
      explanation: question.explanation ?? "",
      choices,
      sampleAnswer:
        question.question_type === "open_ended" && question.openEndedAnswer
          ? question.openEndedAnswer.sample_answer
          : "",
      keywords,
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question?.id])

  if (!question) return null

  const isMCQ = question.question_type === "mcq"

  function setCorrect(index: number) {
    setValue(
      "choices",
      getValues("choices").map((c, i) => ({ ...c, is_correct: i === index }))
    )
  }

  function onSubmit(data: FormValues) {
    const dto: Parameters<typeof updateQuestion>[0] = {
      id: question!.id,
      title: data.title.trim() || undefined,
      difficulty: (data.difficulty as ApiQuestionDifficulty) || undefined,
      explanation: data.explanation || undefined,
    }
    if (isMCQ) {
      dto.mcqChoices = data.choices.map((c) => ({
        id: c.id,
        choice_text: c.choice_text,
        choice_order: c.choice_order,
        is_correct: c.is_correct,
      }))
    } else {
      dto.sample_answer = data.sampleAnswer
      dto.gradingKeywords = data.keywords.map((k) => ({
        id: k.id,
        keyword: k.keyword,
        weight: k.weight,
        is_required: k.is_required,
      }))
    }
    updateQuestion(dto, {
      onSuccess: () => onOpenChange(false),
    })
  }

  const titleValue = watch("title")
  const choicesValue = watch("choices")
  const correctIndex = choicesValue.findIndex((c) => c.is_correct)
  const canSave =
    titleValue.trim().length > 0 &&
    (!isMCQ || (choicesValue.length >= 2 && choicesValue.some((c) => c.is_correct)))

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col gap-0 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Question</SheetTitle>
        </SheetHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 flex-1 px-4 pb-2"
        >
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <Label>Question</Label>
            <Textarea
              {...register("title")}
              rows={3}
              placeholder="Enter question text"
            />
          </div>

          {/* Difficulty */}
          <div className="flex flex-col gap-1.5">
            <Label>Difficulty</Label>
            <Controller
              control={control}
              name="difficulty"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(v) => field.onChange(v as ApiQuestionDifficulty)}
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
              )}
            />
          </div>

          {/* Explanation */}
          <div className="flex flex-col gap-1.5">
            <Label>Explanation</Label>
            <Textarea
              {...register("explanation")}
              rows={2}
              placeholder="Optional explanation"
            />
          </div>

          {/* MCQ choices */}
          {isMCQ && (
            <div className="flex flex-col gap-2">
              <Label>Answer Choices</Label>
              <RadioGroup
                value={String(correctIndex)}
                onValueChange={(v) => setCorrect(Number(v))}
                className="flex flex-col gap-2"
              >
                {choiceFields.map((field, i) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <RadioGroupItem value={String(i)} id={`choice-${i}`} className="shrink-0" />
                    <Input
                      {...register(`choices.${i}.choice_text`)}
                      placeholder={`Choice ${String.fromCharCode(65 + i)}`}
                      className="flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => removeChoice(i)}
                      className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                      aria-label="Remove choice"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
              </RadioGroup>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  appendChoice({
                    choice_text: "",
                    choice_order: choiceFields.length,
                    is_correct: false,
                  })
                }
                className="w-full mt-1"
              >
                <Plus className="size-3.5 mr-1.5" />
                Add Choice
              </Button>
              {choiceFields.length > 0 && !choicesValue.some((c) => c.is_correct) && (
                <p className="text-xs text-destructive">Select a correct answer</p>
              )}
            </div>
          )}

          {/* Open-ended */}
          {!isMCQ && (
            <>
              <div className="flex flex-col gap-1.5">
                <Label>Sample Answer</Label>
                <Textarea
                  {...register("sampleAnswer")}
                  rows={3}
                  placeholder="Sample answer"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Grading Keywords</Label>
                {keywordFields.map((field, i) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <Input
                      {...register(`keywords.${i}.keyword`)}
                      placeholder="Keyword"
                      className="flex-1"
                    />
                    <Controller
                      control={control}
                      name={`keywords.${i}.weight`}
                      render={({ field: f }) => (
                        <div className="flex items-center gap-1.5 w-28 shrink-0">
                          <Slider
                            value={[f.value]}
                            min={0}
                            max={1}
                            step={0.1}
                            onValueChange={([v]) => f.onChange(v)}
                            className="flex-1"
                          />
                          <span className="text-xs text-muted-foreground w-6">
                            {f.value.toFixed(1)}
                          </span>
                        </div>
                      )}
                    />
                    <Controller
                      control={control}
                      name={`keywords.${i}.is_required`}
                      render={({ field: f }) => (
                        <Checkbox
                          checked={f.value}
                          onCheckedChange={(v) => f.onChange(!!v)}
                        />
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => removeKeyword(i)}
                      className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    appendKeyword({ keyword: "", weight: 1, is_required: false })
                  }
                  className="w-full"
                >
                  <Plus className="size-3.5 mr-1.5" />
                  Add Keyword
                </Button>
              </div>
            </>
          )}

          <SheetFooter className="flex gap-2 flex-row mt-auto">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isPending || !canSave}
            >
              {isPending ? "Saving…" : "Save Changes"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
