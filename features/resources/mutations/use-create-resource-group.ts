import { axiosPrivate } from "@/lib/api/client"
import { ApiSuccess, ResourceGroup } from "@/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"

interface CreateGroupInput {
  name: string
  description?: string
}

async function createResourceGroup(workspaceId: number, input: CreateGroupInput) {
  const { data } = await axiosPrivate.post<ApiSuccess<ResourceGroup>>("/resource-groups", {
    workspaceId,
    ...input,
  })
  return data.data
}

export function useCreateResourceGroup(workspaceId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateGroupInput) => createResourceGroup(workspaceId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resource-groups", workspaceId] })
    },
  })
}
