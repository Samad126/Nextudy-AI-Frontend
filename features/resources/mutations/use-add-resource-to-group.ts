import { axiosPrivate } from "@/lib/api/client"
import { ApiSuccess, ResourceGroup } from "@/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"

async function addResourceToGroup(groupId: number, resourceId: number) {
  const { data } = await axiosPrivate.post<ApiSuccess<ResourceGroup>>(
    `/resource-groups/${groupId}/resources`,
    { resourceId }
  )
  return data.data
}

export function useAddResourceToGroup(workspaceId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ groupId, resourceId }: { groupId: number; resourceId: number }) =>
      addResourceToGroup(groupId, resourceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resource-groups", workspaceId] })
    },
  })
}
