import { axiosPrivate } from "@/lib/api/client"
import { ApiSuccess } from "@/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Quiz, quizKeys } from "../types/quiz"

export interface CreateQuizInput {
  workspaceId: number
  title: string
  description?: string
  questionIds: number[]
}

async function createQuiz(input: CreateQuizInput) {
  const { data } = await axiosPrivate.post<ApiSuccess<Quiz>>("/quizzes", input)
  return data.data
}

export function useCreateQuiz(workspaceId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createQuiz,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quizKeys.all(workspaceId) })
    },
  })
}
