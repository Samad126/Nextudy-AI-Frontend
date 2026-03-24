import { axiosPrivate } from "@/lib/api/client"
import { ApiSuccess } from "@/types"
import { useQuery } from "@tanstack/react-query"
import { QuizAttempt, quizKeys } from "../types/quiz"

async function getQuizAttempts(quizId: number) {
  const { data } = await axiosPrivate.get<ApiSuccess<QuizAttempt[]>>(
    `/quizzes/${quizId}/attempts`
  )
  return data.data
}

export function useGetQuizAttempts(quizId: number) {
  return useQuery({
    queryKey: quizKeys.attempts(quizId),
    queryFn: () => getQuizAttempts(quizId),
  })
}
