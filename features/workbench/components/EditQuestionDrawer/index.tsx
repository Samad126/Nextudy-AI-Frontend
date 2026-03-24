"use client"

import { useEffect, useState } from "react"
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

  const [title, setTitle] = useState("")
  const [difficulty, setDifficulty] = useState<ApiQuestionDifficulty | "">("")
  const [explanation, setExplanation] = useState("")
  const [choices, setChoices] = useState<MCQChoiceRow[]>([])
  const [sampleAnswer, setSampleAnswer] = useState("")
  const [keywords, setKeywords] = useState<KeywordRow[]>([])

  useEffect(() => {
    if (!question) return
    setTitle(question.title)
    setDifficulty(question.difficulty ?? "")
    setExplanation(question.explanation ?? "")
    if (question.question_type === "mcq") {
      const sorted = [...question.mcqChoices].sort((a, b) => a.choice_order - b.choice_order)
      setChoices(sorted.map((c) => ({ id: c.id, choice_text: c.choice_text, choice_order: c.choice_order, is_correct: c.is_correct })))
    }
    if (question.question_type === "open_ended" && question.openEndedAnswer) {
      setSampleAnswer(question.openEndedAnswer.sample_answer)
      setKeywords(
        question.openEndedAnswer.gradingKeywords.map((k) => ({
          id: k.id,
          keyword: k.keyword,
          weight: parseFloat(k.weight as unknown as string),
          is_required: k.is_required,
        }))
      )
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question?.id])

  if (!question) return null

  const isMCQ = question.question_type === "mcq"

  function updateChoice(index: number, patch: Partial<MCQChoiceRow>) {
    setChoices((prev) => prev.map((c, i) => (i === index ? { ...c, ...patch } : c)))
  }

  function setCorrect(index: number) {
    setChoices((prev) =>
      prev.map((c, i) => ({ ...c, is_correct: i === index }))
    )
  }

  function addChoice() {
    setChoices((prev) => [
      ...prev,
      { choice_text: "", choice_order: prev.length, is_correct: false },
    ])
  }

  function removeChoice(index: number) {
    setChoices((prev) => prev.filter((_, i) => i !== index).map((c, i) => ({ ...c, choice_order: i })))
  }

  function updateKeyword(index: number, patch: Partial<KeywordRow>) {
    setKeywords((prev) => prev.map((k, i) => (i === index ? { ...k, ...patch } : k)))
  }

  function addKeyword() {
    setKeywords((prev) => [...prev, { keyword: "", weight: 1, is_required: false }])
  }

  function removeKeyword(index: number) {
    setKeywords((prev) => prev.filter((_, i) => i !== index))
  }

  function handleSave() {
    if (!question) return
    const dto: Parameters<typeof updateQuestion>[0] = {
      id: question.id,
      title: title.trim() || undefined,
      difficulty: (difficulty as ApiQuestionDifficulty) || undefined,
      explanation: explanation || undefined,
    }
    if (isMCQ) {
      dto.mcqChoices = choices.map((c) => ({
        id: c.id,
        choice_text: c.choice_text,
        choice_order: c.choice_order,
        is_correct: c.is_correct,
      }))
    } else {
      dto.sample_answer = sampleAnswer
      dto.gradingKeywords = keywords.map((k) => ({
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

  const correctIndex = choices.findIndex((c) => c.is_correct)
  const canSave =
    title.trim().length > 0 &&
    (!isMCQ || (choices.length >= 2 && choices.some((c) => c.is_correct)))

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col gap-0 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Question</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-5 flex-1 px-4 pb-2">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <Label>Question</Label>
            <Textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              rows={3}
              placeholder="Enter question text"
            />
          </div>

          {/* Difficulty */}
          <div className="flex flex-col gap-1.5">
            <Label>Difficulty</Label>
            <Select
              value={difficulty}
              onValueChange={(v) => setDifficulty(v as ApiQuestionDifficulty)}
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

          {/* Explanation */}
          <div className="flex flex-col gap-1.5">
            <Label>Explanation</Label>
            <Textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
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
                {choices.map((choice, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <RadioGroupItem value={String(i)} id={`choice-${i}`} className="shrink-0" />
                    <Input
                      value={choice.choice_text}
                      onChange={(e) => updateChoice(i, { choice_text: e.target.value })}
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
                onClick={addChoice}
                className="w-full mt-1"
              >
                <Plus className="size-3.5 mr-1.5" />
                Add Choice
              </Button>
              {choices.length > 0 && !choices.some((c) => c.is_correct) && (
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
                  value={sampleAnswer}
                  onChange={(e) => setSampleAnswer(e.target.value)}
                  rows={3}
                  placeholder="Sample answer"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Grading Keywords</Label>
                {keywords.map((kw, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input
                      value={kw.keyword}
                      onChange={(e) => updateKeyword(i, { keyword: e.target.value })}
                      placeholder="Keyword"
                      className="flex-1"
                    />
                    <div className="flex items-center gap-1.5 w-28 shrink-0">
                      <Slider
                        value={[kw.weight]}
                        min={0}
                        max={1}
                        step={0.1}
                        onValueChange={([v]) => updateKeyword(i, { weight: v })}
                        className="flex-1"
                      />
                      <span className="text-xs text-muted-foreground w-6">{kw.weight.toFixed(1)}</span>
                    </div>
                    <Checkbox
                      checked={kw.is_required}
                      onCheckedChange={(v) => updateKeyword(i, { is_required: !!v })}
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
                  onClick={addKeyword}
                  className="w-full"
                >
                  <Plus className="size-3.5 mr-1.5" />
                  Add Keyword
                </Button>
              </div>
            </>
          )}
        </div>

        <SheetFooter className="flex gap-2 flex-row">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1"
            disabled={isPending || !canSave}
          >
            {isPending ? "Saving…" : "Save Changes"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
