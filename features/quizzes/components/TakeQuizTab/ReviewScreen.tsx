"use client"

import { QuizQuestion } from "../../types/quiz"
import { Button } from "@/shared/ui/button"
import { Badge } from "@/shared/ui/badge"
import { cn } from "@/lib/utils"

type Answers = Record<number, string | number>

interface ReviewScreenProps {
  questions: QuizQuestion[]
  answers: Answers
  onGoBack: (index: number) => void
  onSubmit: () => void
  isSubmitting: boolean
}

export function ReviewScreen({ questions, answers, onGoBack, onSubmit, isSubmitting }: ReviewScreenProps) {
  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h3 className="font-medium mb-1">Review your answers</h3>
        <p className="text-sm text-muted-foreground">Check your answers before submitting.</p>
      </div>

      <div className="rounded-lg border border-border overflow-hidden divide-y divide-border">
        {questions.map((qq, i) => {
          const answer = answers[qq.id]
          const answered = answer !== undefined && answer !== "" && answer !== null

          return (
            <div key={qq.id} className="flex items-center gap-3 px-4 py-3">
              <span className="text-xs text-muted-foreground w-5 shrink-0">{i + 1}</span>
              <p className="text-sm flex-1 line-clamp-1">{qq.question.title}</p>
              <Badge
                variant={answered ? "secondary" : "outline"}
                className={cn(
                  "text-[10px] shrink-0",
                  !answered && "text-muted-foreground"
                )}
              >
                {answered ? "Answered" : "Skipped"}
              </Badge>
              <button
                type="button"
                className="text-xs text-primary hover:underline shrink-0"
                onClick={() => onGoBack(i)}
              >
                Edit
              </button>
            </div>
          )
        })}
      </div>

      <div className="flex gap-3">
        <Button onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Grading your quiz..." : "Submit Quiz"}
        </Button>
      </div>
    </div>
  )
}
