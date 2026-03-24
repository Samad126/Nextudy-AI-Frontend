import { useMutation, useQueryClient } from "@tanstack/react-query"
import { axiosPrivate } from "@/lib/api/client"

export function useLeaveWorkspace() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => axiosPrivate.post(`/workspaces/${id}/leave`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] })
    },
  })
}
