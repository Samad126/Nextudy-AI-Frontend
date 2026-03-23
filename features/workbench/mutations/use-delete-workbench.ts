import { axiosPrivate } from "@/lib/api/client"
import { ApiSuccess, Workbench } from "@/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"

async function deleteWorkbench(id: number) {
  const { data } = await axiosPrivate.delete<ApiSuccess<Workbench>>(`/workbenches/${id}`)
  return data.data
}

export function useDeleteWorkbench(workspaceId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteWorkbench,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workbenches", workspaceId] })
    },
  })
}
