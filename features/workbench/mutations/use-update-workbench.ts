import { axiosPrivate } from "@/lib/api/client"
import { ApiSuccess, Workbench } from "@/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"

interface UpdateWorkbenchInput {
  id: number
  name?: string
  description?: string
}

async function updateWorkbench({ id, ...body }: UpdateWorkbenchInput) {
  const { data } = await axiosPrivate.patch<ApiSuccess<Workbench>>(`/workbenches/${id}`, body)
  return data.data
}

export function useUpdateWorkbench(workspaceId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateWorkbench,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workbenches", workspaceId] })
    },
  })
}
