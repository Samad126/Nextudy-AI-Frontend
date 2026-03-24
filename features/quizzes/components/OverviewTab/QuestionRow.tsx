"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import { QuizQuestion } from "../../types/quiz"
import { Badge } from "@/shared/ui/badge"
import { DifficultyBadge } from "@/shared/components/DifficultyBadge"
import { cn } from "@/lib/utils"
import type { Difficulty } from "@/shared/components/DifficultyBadge"

interface QuestionRowProps {
  quizQuestion: QuizQuestion
  index: number
}

export function QuestionRow({ quizQuestion, index }: QuestionRowProps) {
  const [expanded, setExpanded] = useState(false)
  const { question } = quizQuestion

  return (
    <div className="border-b border-border last:border-0">
      <button
        type="button"
        className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-muted/40 transition-colors"
        onClick={() => setExpanded((e) => !e)}
      >
        <span className="text-xs text-muted-foreground w-5 shrink-0 mt-0.5">{index + 1}</span>
        <p className="text-sm flex-1 text-foreground">{question.title}</p>
        <div className="flex items-center gap-1.5 shrink-0">
          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
            {question.question_type === "mcq" ? "MCQ" : "Open-ended"}
          </Badge>
          {question.difficulty && (
            <DifficultyBadge difficulty={question.difficulty as Difficulty} />
          )}
          {expanded ? (
            <ChevronDown className="size-3.5 text-muted-foreground" />
          ) : (
            <ChevronRight className="size-3.5 text-muted-foreground" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-3 pl-12 flex flex-col gap-2">
          {question.question_type === "mcq" && question.mcqChoices && (
            <ul className="flex flex-col gap-1">
              {question.mcqChoices.map((choice) => (
                <li key={choice.id} className="text-xs text-muted-foreground flex gap-2">
                  <span className="font-medium">{choice.choice_order}.</span>
                  {choice.choice_text}
                </li>
              ))}
            </ul>
          )}
          {question.question_type === "open_ended" && question.openEndedAnswer && (
            <div className="rounded-md bg-muted/50 border border-border px-3 py-2">
              <p className="text-xs text-muted-foreground font-medium mb-0.5">Sample answer</p>
              <p className="text-xs text-foreground">{question.openEndedAnswer.sample_answer}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
