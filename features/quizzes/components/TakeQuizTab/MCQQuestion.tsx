"use client"

import { MCQChoice } from "../../types/quiz"
import { cn } from "@/lib/utils"

interface MCQQuestionProps {
  choices: MCQChoice[]
  selected: number | null
  onSelect: (id: number) => void
}

export function MCQQuestion({ choices, selected, onSelect }: MCQQuestionProps) {
  return (
    <div className="flex flex-col gap-2.5">
      {choices.map((choice) => (
        <button
          key={choice.id}
          type="button"
          onClick={() => onSelect(choice.id)}
          className={cn(
            "w-full text-left rounded-xl border px-4 py-3 text-sm transition-all",
            selected === choice.id
              ? "border-primary bg-primary/10 text-foreground font-medium"
              : "border-border bg-card hover:border-primary/40 hover:bg-muted/40 text-foreground"
          )}
        >
          <span className="font-medium text-muted-foreground mr-2 text-xs">
            {String.fromCharCode(64 + choice.choice_order)}.
          </span>
          {choice.choice_text}
        </button>
      ))}
    </div>
  )
}
