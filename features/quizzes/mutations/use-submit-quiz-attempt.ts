import { axiosPrivate } from "@/lib/api/client"
import { ApiSuccess } from "@/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { QuizAttempt, quizKeys } from "../types/quiz"

export interface SubmitAnswer {
  quizQuestionId: number
  userAnswer: string | number
}

interface SubmitQuizAttemptInput {
  quizId: number
  answers: SubmitAnswer[]
}

async function submitQuizAttempt({ quizId, answers }: SubmitQuizAttemptInput) {
  const { data } = await axiosPrivate.post<ApiSuccess<QuizAttempt>>(
    `/quizzes/${quizId}/attempts/submit`,
    { answers }
  )
  return data.data
}

export function useSubmitQuizAttempt(quizId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: submitQuizAttempt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quizKeys.attempts(quizId) })
    },
  })
}
