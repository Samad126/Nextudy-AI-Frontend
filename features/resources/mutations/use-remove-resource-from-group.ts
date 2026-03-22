import { axiosPrivate } from "@/lib/api/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"

async function removeResourceFromGroup(groupId: number, resourceId: number) {
  await axiosPrivate.delete(`/resource-groups/${groupId}/resources/${resourceId}`)
}

export function useRemoveResourceFromGroup(workspaceId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ groupId, resourceId }: { groupId: number; resourceId: number }) =>
      removeResourceFromGroup(groupId, resourceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resource-groups", workspaceId] })
    },
  })
}
