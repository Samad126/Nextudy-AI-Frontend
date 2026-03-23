import { axiosPrivate } from "@/lib/api/client"
import { ApiSuccess, Workbench } from "@/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"

interface CreateWorkbenchInput {
  name: string
  workspaceId: number
  description?: string
}

async function createWorkbench(input: CreateWorkbenchInput) {
  const { data } = await axiosPrivate.post<ApiSuccess<Workbench>>("/workbenches", input)
  return data.data
}

export function useCreateWorkbench(workspaceId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createWorkbench,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workbenches", workspaceId] })
    },
  })
}
