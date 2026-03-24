"use client"

import { useState } from "react"
import { UseFormReturn } from "react-hook-form"
import { Search } from "lucide-react"
import { ApiQuestion } from "@/types"
import { Input } from "@/shared/ui/input"
import { Checkbox } from "@/shared/ui/checkbox"
import { Label } from "@/shared/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select"
import { QuestionSelectItem } from "./QuestionSelectItem"
import type { CreateQuizFormValues } from "./index"

interface StepQuestionsProps {
  form: UseFormReturn<CreateQuizFormValues>
  questions: ApiQuestion[]
}

type TypeFilter = "all" | "mcq" | "open_ended"
type DiffFilter = "all" | "EASY" | "MEDIUM" | "HARD"

export function StepQuestions({ form, questions }: StepQuestionsProps) {
  const { watch, setValue, formState: { errors } } = form
  const selectedIds = watch("questionIds") ?? []

  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all")
  const [diffFilter, setDiffFilter] = useState<DiffFilter>("all")

  const filtered = questions.filter((q) => {
    const matchSearch = q.title.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === "all" || q.question_type === typeFilter
    const matchDiff = diffFilter === "all" || q.difficulty === diffFilter
    return matchSearch && matchType && matchDiff
  })

  function toggleQuestion(id: number) {
    if (selectedIds.includes(id)) {
      setValue("questionIds", selectedIds.filter((x) => x !== id), { shouldValidate: true })
    } else {
      setValue("questionIds", [...selectedIds, id], { shouldValidate: true })
    }
  }

  function toggleAll() {
    const filteredIds = filtered.map((q) => q.id)
    const allSelected = filteredIds.every((id) => selectedIds.includes(id))
    if (allSelected) {
      setValue("questionIds", selectedIds.filter((id) => !filteredIds.includes(id)), { shouldValidate: true })
    } else {
      const merged = Array.from(new Set([...selectedIds, ...filteredIds]))
      setValue("questionIds", merged, { shouldValidate: true })
    }
  }

  const allFilteredSelected =
    filtered.length > 0 && filtered.every((q) => selectedIds.includes(q.id))

  return (
    <div className="flex flex-col gap-3">
      {/* Filters */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            placeholder="Search questions..."
            className="pl-8 h-8 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as TypeFilter)}>
          <SelectTrigger className="h-8 w-32 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="mcq">MCQ</SelectItem>
            <SelectItem value="open_ended">Open-ended</SelectItem>
          </SelectContent>
        </Select>
        <Select value={diffFilter} onValueChange={(v) => setDiffFilter(v as DiffFilter)}>
          <SelectTrigger className="h-8 w-32 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All levels</SelectItem>
            <SelectItem value="EASY">Easy</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="HARD">Hard</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Question list */}
      <div className="rounded-md border border-border overflow-hidden">
        {/* Select all */}
        <div className="flex items-center gap-2.5 px-3 py-2 border-b border-border bg-muted/30">
          <Checkbox
            id="quiz-select-all"
            checked={allFilteredSelected}
            onCheckedChange={toggleAll}
          />
          <Label htmlFor="quiz-select-all" className="text-xs font-medium cursor-pointer">
            Select all ({filtered.length})
          </Label>
          {selectedIds.length > 0 && (
            <span className="ml-auto text-xs text-muted-foreground">
              {selectedIds.length} selected
            </span>
          )}
        </div>

        {/* Items */}
        <div className="max-h-72 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No questions found</p>
          ) : (
            filtered.map((q) => (
              <QuestionSelectItem
                key={q.id}
                question={q}
                selected={selectedIds.includes(q.id)}
                onToggle={() => toggleQuestion(q.id)}
              />
            ))
          )}
        </div>
      </div>

      {errors.questionIds && (
        <p className="text-xs text-destructive">{errors.questionIds.message}</p>
      )}
    </div>
  )
}
