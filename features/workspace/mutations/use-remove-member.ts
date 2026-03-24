import { useMutation, useQueryClient } from "@tanstack/react-query"
import { axiosPrivate } from "@/lib/api/client"
import { workspaceMemberKeys } from "../queries/use-get-members"

interface RemoveMemberInput {
  workspaceId: number
  memberId: number
}

export function useRemoveMember() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ workspaceId, memberId }: RemoveMemberInput) =>
      axiosPrivate.delete(`/workspaces/${workspaceId}/members/${memberId}`),
    onSuccess: (_data, { workspaceId }) => {
      queryClient.invalidateQueries({ queryKey: workspaceMemberKeys.all(workspaceId) })
    },
  })
}
