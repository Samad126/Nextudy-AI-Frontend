import { useMutation, useQueryClient } from "@tanstack/react-query"
import { axiosPrivate } from "@/lib/api/client"

interface UpdateWorkspaceInput {
  id: number
  name?: string
  description?: string
}

export function useUpdateWorkspace() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateWorkspaceInput) =>
      axiosPrivate.put(`/workspaces/${id}`, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] })
    },
  })
}
