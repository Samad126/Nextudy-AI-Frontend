"use client"

import { CheckCircle, XCircle } from "lucide-react"
import { Quiz, QuizAttempt } from "../../types/quiz"
import { Button } from "@/shared/ui/button"
import { cn } from "@/lib/utils"

interface QuizResultProps {
  quiz: Quiz
  attempt: QuizAttempt
  onRetake: () => void
  onOverview: () => void
}

export function QuizResult({ quiz, attempt, onRetake, onOverview }: QuizResultProps) {
  const totalQ = attempt.answers.length
  const correct = attempt.answers.filter((a) => a.isCorrect).length
  const score = attempt.score ?? Math.round((correct / totalQ) * 100)

  const answerMap = new Map(attempt.answers.map((a) => [a.quizQuestionId, a]))

  return (
    <div className="flex flex-col gap-8 max-w-2xl mx-auto w-full">
      {/* Score */}
      <div className="flex flex-col items-center gap-3 py-6">
        <div
          className={cn(
            "flex items-center justify-center w-28 h-28 rounded-full border-4 text-3xl font-bold",
            score >= 80
              ? "border-green-500 text-green-600 bg-green-50 dark:bg-green-950/30"
              : score >= 50
              ? "border-yellow-500 text-yellow-600 bg-yellow-50 dark:bg-yellow-950/30"
              : "border-red-500 text-red-600 bg-red-50 dark:bg-red-950/30"
          )}
        >
          {score}%
        </div>
        <p className="text-sm text-muted-foreground">
          {correct} of {totalQ} correct
        </p>
      </div>

      {/* Per-question breakdown */}
      <div className="flex flex-col gap-3">
        <p className="font-medium text-sm">Question breakdown</p>
        {(quiz.questions ?? []).map((qq, i) => {
          const userAnswer = answerMap.get(qq.id)
          if (!userAnswer) return null

          const q = qq.question
          const isCorrect = userAnswer.isCorrect

          // For MCQ — find the choice text for the user's answer
          let userAnswerText = String(userAnswer.userAnswer)
          if (q.question_type === "mcq" && q.mcqChoices) {
            const choiceId = Number(userAnswer.userAnswer)
            const match = q.mcqChoices.find((c) => c.id === choiceId)
            if (match) userAnswerText = match.choice_text
          }

          // For MCQ incorrect — find correct choice (we don't have is_correct, so skip)
          // The spec says highlight correct choice for MCQ incorrect — but is_correct is NOT sent
          // We show explanation instead

          return (
            <div
              key={qq.id}
              className={cn(
                "rounded-xl border p-4 flex flex-col gap-2",
                isCorrect ? "border-green-300/60 bg-green-50/50 dark:bg-green-950/20" : "border-red-300/60 bg-red-50/50 dark:bg-red-950/20"
              )}
            >
              <div className="flex items-start gap-2">
                {isCorrect ? (
                  <CheckCircle className="size-4 text-green-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="size-4 text-red-500 shrink-0 mt-0.5" />
                )}
                <div className="flex flex-col gap-1 flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {i + 1}. {q.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Your answer:{" "}
                    <span className="text-foreground">{userAnswerText || "—"}</span>
                  </p>
                  {!isCorrect && q.explanation && (
                    <div className="mt-1 rounded-md bg-background/60 border border-border px-3 py-2">
                      <p className="text-xs text-muted-foreground font-medium mb-0.5">Explanation</p>
                      <p className="text-xs text-foreground">{q.explanation}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex gap-3">
        <Button onClick={onRetake}>Retake Quiz</Button>
        <Button variant="outline" onClick={onOverview}>Back to Overview</Button>
      </div>
    </div>
  )
}
