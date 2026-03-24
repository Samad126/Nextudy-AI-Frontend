"use client"

import { useParams, useRouter } from "next/navigation"
import { useGetQuiz } from "@/features/quizzes/queries/use-get-quiz"
import { TakeQuizTab } from "@/features/quizzes/components/TakeQuizTab"

export default function QuizTakePage() {
  const { id, quizId } = useParams<{ id: string; quizId: string }>()
  const router = useRouter()
  const { data: quiz } = useGetQuiz(Number(quizId))

  if (!quiz) return null
  return (
    <TakeQuizTab
      quiz={quiz}
      onOverview={() => router.push(`/workspaces/${id}/quizzes/${quizId}`)}
    />
  )
}
