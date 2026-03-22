import { axiosPrivate } from "@/lib/api/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"

async function renameResourceGroup(groupId: number, name: string) {
  await axiosPrivate.put(`/resource-groups/${groupId}`, { name })
}

export function useRenameResourceGroup(workspaceId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ groupId, name }: { groupId: number; name: string }) =>
      renameResourceGroup(groupId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resource-groups", workspaceId] })
    },
  })
}
