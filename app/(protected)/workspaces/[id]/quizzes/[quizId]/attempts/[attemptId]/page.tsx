"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react"
import { useGetQuizAttempt } from "@/features/quizzes/queries/use-get-quiz-attempt"
import { Button } from "@/shared/ui/button"
import { Skeleton } from "@/shared/ui/skeleton"
import { cn } from "@/lib/utils"

export default function AttemptDetailPage() {
  const { id, quizId, attemptId } = useParams<{ id: string; quizId: string; attemptId: string }>()
  const router = useRouter()
  const { data: attempt, isLoading } = useGetQuizAttempt(Number(quizId), Number(attemptId))

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 max-w-2xl mx-auto w-full">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-20 w-full rounded-xl" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    )
  }

  if (!attempt) return null

  const totalQ = attempt.answers.length
  const correct = attempt.answers.filter((a) => a.isCorrect).length
  const score = attempt.score

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => router.push(`/workspaces/${id}/quizzes/${quizId}/attempts`)}
          className="-ml-1"
        >
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
        {attempt.answers.map((ans, i) => {
          const q = ans.question
          const isMcq = q.mcqChoices.length > 0
          const userChoiceId = isMcq ? Number(ans.userAnswer) : null

          return (
            <div
              key={ans.id}
              className={cn(
                "rounded-xl border p-4 flex flex-col gap-3",
                ans.isCorrect ? "border-green-300/60" : "border-red-300/60"
              )}
            >
              <div className="flex items-start gap-2">
                {ans.isCorrect ? (
                  <CheckCircle className="size-4 text-green-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="size-4 text-red-500 shrink-0 mt-0.5" />
                )}
                <p className="text-sm font-medium">
                  {i + 1}. {q.title}
                </p>
              </div>

              {isMcq ? (
                <div className="flex flex-col gap-1.5 pl-6">
                  {q.mcqChoices.map((choice) => {
                    const isSelected = choice.id === userChoiceId
                    const isCorrectChoice = choice.is_correct

                    return (
                      <div
                        key={choice.id}
                        className={cn(
                          "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm",
                          isCorrectChoice
                            ? "border-green-400/60 bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-300"
                            : isSelected
                            ? "border-red-400/60 bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-300"
                            : "border-border bg-background/50 text-muted-foreground"
                        )}
                      >
                        {isCorrectChoice ? (
                          <CheckCircle className="size-3.5 shrink-0 text-green-600" />
                        ) : isSelected ? (
                          <XCircle className="size-3.5 shrink-0 text-red-500" />
                        ) : (
                          <span className="size-3.5 shrink-0" />
                        )}
                        {choice.choice_text}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="pl-6 flex flex-col gap-2">
                  <p className="text-xs text-muted-foreground">
                    Your answer: <span className="text-foreground">{ans.userAnswer || "—"}</span>
                  </p>
                  {q.openEndedAnswer && (
                    <div className="rounded-md bg-background/60 border border-border px-3 py-2">
                      <p className="text-xs text-muted-foreground font-medium mb-0.5">Sample answer</p>
                      <p className="text-xs">{q.openEndedAnswer.sample_answer}</p>
                    </div>
                  )}
                </div>
              )}

              {!ans.isCorrect && q.explanation && (
                <div className="ml-6 rounded-md bg-background/60 border border-border px-3 py-2">
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
