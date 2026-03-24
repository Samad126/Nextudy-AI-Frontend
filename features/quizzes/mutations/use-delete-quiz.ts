import { axiosPrivate } from "@/lib/api/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { quizKeys } from "../types/quiz"

async function deleteQuiz(id: number) {
  await axiosPrivate.delete(`/quizzes/${id}`)
}

export function useDeleteQuiz(workspaceId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteQuiz,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quizKeys.all(workspaceId) })
    },
  })
}
