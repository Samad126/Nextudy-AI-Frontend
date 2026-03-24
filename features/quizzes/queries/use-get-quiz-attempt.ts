import { axiosPrivate } from "@/lib/api/client"
import { ApiSuccess } from "@/types"
import { useQuery } from "@tanstack/react-query"
import { QuizAttempt, quizKeys } from "../types/quiz"

async function getQuizAttempt(quizId: number, attemptId: number) {
  const { data } = await axiosPrivate.get<ApiSuccess<QuizAttempt>>(
    `/quizzes/${quizId}/attempts/${attemptId}`
  )
  return data.data
}

export function useGetQuizAttempt(quizId: number, attemptId: number) {
  return useQuery({
    queryKey: quizKeys.attempt(quizId, attemptId),
    queryFn: () => getQuizAttempt(quizId, attemptId),
    enabled: !!attemptId,
  })
}
