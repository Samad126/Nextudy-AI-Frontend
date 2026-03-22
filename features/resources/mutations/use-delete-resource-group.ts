import { axiosPrivate } from "@/lib/api/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"

async function deleteResourceGroup(groupId: number) {
  await axiosPrivate.delete(`/resource-groups/${groupId}`)
}

export function useDeleteResourceGroup(workspaceId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (groupId: number) => deleteResourceGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resource-groups", workspaceId] })
    },
  })
}
