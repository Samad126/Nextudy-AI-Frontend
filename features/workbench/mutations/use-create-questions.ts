import { axiosPrivate } from "@/lib/api/client"
import { ApiSuccess, ApiQuestion, CreateQuestionsInput } from "@/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"

async function createQuestions(input: CreateQuestionsInput) {
  const { data } = await axiosPrivate.post<ApiSuccess<ApiQuestion[]>>("/questions", input)
  return data.data
}

export function useCreateQuestions(workbenchId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createQuestions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions", workbenchId] })
    },
  })
}
