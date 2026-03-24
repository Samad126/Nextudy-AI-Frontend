"use client"

import { useParams } from "next/navigation"
import { useGetQuiz } from "@/features/quizzes/queries/use-get-quiz"
import { AttemptsTab } from "@/features/quizzes/components/AttemptsTab"

export default function QuizAttemptsPage() {
  const { quizId } = useParams<{ quizId: string }>()
  const { data: quiz } = useGetQuiz(Number(quizId))

  if (!quiz) return null
  return <AttemptsTab quiz={quiz} />
}
