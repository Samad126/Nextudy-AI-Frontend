"use client"

import { Pencil, RefreshCw } from "lucide-react"
import { TypeBadge } from "./TypeBadge"
import { DifficultyBadge } from "./DifficultyBadge"
import { SourceButton } from "./SourceButton"
import { AnswerOption } from "./AnswerOption"
import { IconButton } from "./IconButton"
import { Checkbox } from "@/shared/ui/checkbox"
import { cn } from "@/lib/utils"
import { useCitation } from "../../context/citation-context"
import type { SourceCitation } from "@/types"

export interface QAOption {
  label: string
  text: string
}

export interface QAQuestion {
  id: number
  number: number
  type: "verified" | "ai_plus"
  difficulty: "easy" | "medium" | "hard"
  hasSource: boolean
  sourceCitation?: SourceCitation
  text: string
  options: QAOption[]
  answer: string
  explanation: string
}

interface QAQuestionCardProps {
  question: QAQuestion
  onEdit?: () => void
  onRegenerate?: () => void
  selectMode?: boolean
  selected?: boolean
  onToggleSelect?: () => void
}

export function QAQuestionCard({
  question,
  onEdit,
  onRegenerate,
  selectMode,
  selected,
  onToggleSelect,
}: QAQuestionCardProps) {
  const onSourceClick = useCitation()
  return (
    <div
      className={cn(
        "rounded-xl border bg-card transition-colors",
        selectMode && selected ? "border-primary bg-primary/5" : "border-border",
        selectMode && "cursor-pointer"
      )}
      role={selectMode ? "button" : undefined}
      tabIndex={selectMode ? 0 : undefined}
      onClick={selectMode ? onToggleSelect : undefined}
      onKeyDown={selectMode ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onToggleSelect?.() } } : undefined}
    >
      {/* Card header row */}
      <div className="flex items-center gap-2 px-4 pt-3 pb-2">
        {selectMode && (
          <Checkbox
            checked={selected}
            onCheckedChange={onToggleSelect}
            onClick={(e) => e.stopPropagation()}
            className="shrink-0"
          />
        )}
        <span className="text-[11px] font-medium text-muted-foreground/60">
          #{question.number}
        </span>
        <TypeBadge type={question.type} />
        <DifficultyBadge difficulty={question.difficulty} />
        {question.hasSource && question.sourceCitation && (
          <SourceButton onClick={() => onSourceClick(question.sourceCitation!)} />
        )}
        {!selectMode && (
          <div className="ml-auto flex items-center gap-1">
            <IconButton onClick={onEdit} label="Edit question">
              <Pencil className="size-3.5" />
            </IconButton>
            <IconButton onClick={onRegenerate} label="Regenerate question">
              <RefreshCw className="size-3.5" />
            </IconButton>
          </div>
        )}
      </div>

      {/* Question text */}
      <div className="px-4 pb-3">
        <p className="text-sm font-semibold text-foreground leading-snug">{question.text}</p>
      </div>

      {/* Answer options */}
      {question.options.length > 0 && (
        <div className="px-4 pb-3 grid grid-cols-2 gap-2">
          {question.options.map((opt) => (
            <AnswerOption key={opt.label} option={opt} />
          ))}
        </div>
      )}

      {/* Answer + explanation */}
      <div className="px-4 pb-4 flex flex-col gap-1">
        <p className="text-sm">
          <span className="font-semibold text-(--color-accent-green)">Answer: </span>
          <span className="font-semibold text-(--color-accent-green)">{question.answer}</span>
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed italic">
          {question.explanation}
        </p>
      </div>
    </div>
  )
}
