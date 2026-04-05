"use client"

import { useParams, useRouter } from "next/navigation"
import { useGetQuiz } from "@/features/quizzes/queries/use-get-quiz"
import { Button } from "@/shared/ui/button"
import { QuestionRow } from "@/features/quizzes/components/QuizDetail/Overview/QuestionRow"

export default function QuizOverviewPage() {
  const { id, quizId } = useParams<{ id: string; quizId: string }>()
  const router = useRouter()
  const { data: quiz } = useGetQuiz(Number(quizId))

  if (!quiz) return null

  return (
    <div className="container flex flex-col gap-6 max-w-2xl mx-auto w-full">
      {quiz.description && (
        <p className="text-sm text-muted-foreground">{quiz.description}</p>
      )}

      <div>
        <p className="text-sm font-medium mb-3">
          Questions ({(quiz.questions ?? []).length})
        </p>
        <div className="rounded-lg border border-border overflow-hidden">
          {(quiz.questions ?? []).map((qq, i) => (
            <QuestionRow key={qq.id} quizQuestion={qq} index={i} />
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={() => router.push(`/workspaces/${id}/quizzes/${quizId}/take`)}>
          Take Quiz
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push(`/workspaces/${id}/quizzes/${quizId}/attempts`)}
        >
          View Attempts
        </Button>
      </div>
    </div>
  )
}
