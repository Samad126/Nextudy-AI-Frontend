"use client"

import { ArrowLeft, CheckCircle, XCircle } from "lucide-react"
import { Quiz, QuizAttempt } from "../../types/quiz"
import { Button } from "@/shared/ui/button"
import { cn } from "@/lib/utils"

interface AttemptResultViewProps {
  quiz: Quiz
  attempt: QuizAttempt
  onBack: () => void
}

export function AttemptResultView({ quiz, attempt, onBack }: AttemptResultViewProps) {
  const totalQ = attempt.answers.length
  const correct = attempt.answers.filter((a) => a.isCorrect).length
  const score = attempt.score ?? Math.round((correct / totalQ) * 100)

  const answerMap = new Map(attempt.answers.map((a) => [a.quizQuestionId, a]))

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon-sm" onClick={onBack} className="-ml-1">
          <ArrowLeft className="size-4" />
        </Button>
        <span className="font-medium">Attempt result</span>
      </div>

      <div className="flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4">
        <div
          className={cn(
            "flex items-center justify-center w-14 h-14 rounded-full border-2 text-xl font-bold shrink-0",
            score >= 80
              ? "border-green-500 text-green-600 bg-green-50 dark:bg-green-950/30"
              : score >= 50
              ? "border-yellow-500 text-yellow-600 bg-yellow-50 dark:bg-yellow-950/30"
              : "border-red-500 text-red-600 bg-red-50 dark:bg-red-950/30"
          )}
        >
          {score}%
        </div>
        <div className="flex flex-col gap-0.5">
          <p className="font-medium">{correct} of {totalQ} correct</p>
          <p className="text-xs text-muted-foreground">
            {new Date(attempt.started_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {(quiz.questions ?? []).map((qq, i) => {
          const userAnswer = answerMap.get(qq.id)
          if (!userAnswer) return null

          const q = qq.question
          const isCorrect = userAnswer.isCorrect

          let userAnswerText = String(userAnswer.userAnswer)
          if (q.question_type === "mcq" && q.mcqChoices) {
            const match = q.mcqChoices.find((c) => c.id === Number(userAnswer.userAnswer))
            if (match) userAnswerText = match.choice_text
          }

          return (
            <div
              key={qq.id}
              className={cn(
                "rounded-xl border p-4 flex flex-col gap-1.5",
                isCorrect
                  ? "border-green-300/60 bg-green-50/50 dark:bg-green-950/20"
                  : "border-red-300/60 bg-red-50/50 dark:bg-red-950/20"
              )}
            >
              <div className="flex items-center gap-2">
                {isCorrect ? (
                  <CheckCircle className="size-4 text-green-600 shrink-0" />
                ) : (
                  <XCircle className="size-4 text-red-500 shrink-0" />
                )}
                <p className="text-sm font-medium">
                  {i + 1}. {q.title}
                </p>
              </div>
              <p className="text-xs text-muted-foreground pl-6">
                Your answer: <span className="text-foreground">{userAnswerText || "—"}</span>
              </p>
              {!isCorrect && q.explanation && (
                <div className="ml-6 mt-1 rounded-md bg-background/60 border border-border px-3 py-2">
                  <p className="text-xs text-muted-foreground font-medium mb-0.5">Explanation</p>
                  <p className="text-xs">{q.explanation}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
