"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, RotateCcw } from "lucide-react"
import { useGetQuizAttempt } from "@/features/quizzes/queries/use-get-quiz-attempt"
import { Button } from "@/shared/ui/button"
import { AttemptDetailSkeleton } from "@/features/quizzes/components/QuizDetail/AttemptDetail/AttemptDetailSkeleton"
import { AttemptScoreSummary } from "@/features/quizzes/components/QuizDetail/AttemptDetail/AttemptScoreSummary"
import { AttemptAnswerCard } from "@/features/quizzes/components/QuizDetail/AttemptDetail/AttemptAnswerCard"

export default function AttemptDetailPage() {
  const { id, quizId, attemptId } = useParams<{ id: string; quizId: string; attemptId: string }>()
  const router = useRouter()
  const { data: attempt, isLoading } = useGetQuizAttempt(Number(quizId), Number(attemptId))

  if (isLoading) return <AttemptDetailSkeleton />
  if (!attempt) return null

  const totalQ = attempt.answers.length
  const correct = attempt.answers.filter((a) => a.isCorrect).length

  return (
    <div className="container flex flex-col gap-6 max-w-2xl mx-auto w-full">
      <div className="flex items-center justify-between">
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
        <Button
          size="sm"
          variant="outline"
          onClick={() => router.push(`/workspaces/${id}/quizzes/${quizId}/take`)}
          className="gap-1.5"
        >
          <RotateCcw className="size-3.5" />
          Retake
        </Button>
      </div>

      <AttemptScoreSummary
        score={attempt.score}
        correct={correct}
        total={totalQ}
        startedAt={attempt.started_at}
      />

      <div className="flex flex-col gap-3">
        {attempt.answers.map((ans, i) => (
          <AttemptAnswerCard key={ans.id} answer={ans} index={i} />
        ))}
      </div>
    </div>
  )
}
