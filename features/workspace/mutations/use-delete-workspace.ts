import { useMutation, useQueryClient } from "@tanstack/react-query"
import { axiosPrivate } from "@/lib/api/client"

export function useDeleteWorkspace() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => axiosPrivate.delete(`/workspaces/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] })
    },
  })
}
