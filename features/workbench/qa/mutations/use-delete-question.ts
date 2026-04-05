import { axiosPrivate } from "@/lib/api/client"
import { ApiSuccess, ApiQuestion } from "@/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"

async function deleteQuestion(id: number) {
  const { data } = await axiosPrivate.delete<ApiSuccess<ApiQuestion>>(`/questions/${id}`)
  return data.data
}

export function useDeleteQuestion(workbenchId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions", workbenchId] })
    },
  })
}
