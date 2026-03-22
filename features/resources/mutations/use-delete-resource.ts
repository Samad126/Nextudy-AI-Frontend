import { axiosPrivate } from "@/lib/api/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"

async function deleteResource(resourceId: number) {
  await axiosPrivate.delete(`/resources/${resourceId}`)
}

export function useDeleteResource(workspaceId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (resourceId: number) => deleteResource(resourceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources", workspaceId] })
      queryClient.invalidateQueries({ queryKey: ["resource-groups", workspaceId] })
    },
  })
}
