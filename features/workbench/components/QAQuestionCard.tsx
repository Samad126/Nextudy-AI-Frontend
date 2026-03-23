"use client"

import { Eye, Pencil, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

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
  text: string
  options: QAOption[]
  answer: string
  explanation: string
}

interface QAQuestionCardProps {
  question: QAQuestion
  onEdit?: () => void
  onRegenerate?: () => void
}

export function QAQuestionCard({ question, onEdit, onRegenerate }: QAQuestionCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Card header row */}
      <div className="flex items-center gap-2 px-4 pt-3 pb-2">
        <span className="text-[11px] font-medium text-muted-foreground/60">
          #{question.number}
        </span>
        <TypeBadge type={question.type} />
        <DifficultyBadge difficulty={question.difficulty} />
        {question.hasSource && <SourceButton />}
        <div className="ml-auto flex items-center gap-1">
          <IconButton onClick={onEdit} label="Edit question">
            <Pencil className="size-3.5" />
          </IconButton>
          <IconButton onClick={onRegenerate} label="Regenerate question">
            <RefreshCw className="size-3.5" />
          </IconButton>
        </div>
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
          <span className="font-semibold text-[color:var(--color-teal)]">Answer: </span>
          <span className="font-semibold text-[color:var(--color-teal)]">{question.answer}</span>
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed italic">
          {question.explanation}
        </p>
      </div>
    </div>
  )
}

function TypeBadge({ type }: { type: QAQuestion["type"] }) {
  if (type === "verified") {
    return (
      <span className="inline-flex items-center rounded-md border border-green-300 bg-green-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-green-700 dark:border-green-700 dark:bg-green-950 dark:text-green-300">
        Verified
      </span>
    )
  }
  return (
    <span className="inline-flex items-center rounded-md border border-primary/30 bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
      AI+
    </span>
  )
}

function DifficultyBadge({ difficulty }: { difficulty: QAQuestion["difficulty"] }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        difficulty === "easy" && "border-sage/40 bg-sage/10 text-sage-700",
        difficulty === "medium" && "border-yellow-300/60 bg-yellow-50 text-yellow-700 dark:border-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
        difficulty === "hard" && "border-border bg-muted/50 text-muted-foreground"
      )}
    >
      {difficulty}
    </span>
  )
}

function SourceButton() {
  return (
    <button className="flex items-center gap-1 text-[11px] font-medium text-primary/80 hover:text-primary transition-colors">
      <Eye className="size-3" />
      Source
    </button>
  )
}

function AnswerOption({ option }: { option: QAOption }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2">
      <span className="text-[11px] font-semibold text-muted-foreground shrink-0 mt-px">
        {option.label}.
      </span>
      <span className="text-xs text-foreground leading-relaxed">{option.text}</span>
    </div>
  )
}

function IconButton({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode
  onClick?: () => void
  label: string
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
    >
      {children}
    </button>
  )
}
