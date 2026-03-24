import { useMutation, useQueryClient } from "@tanstack/react-query"
import { axiosPrivate } from "@/lib/api/client"
import type { Role } from "../types/workspace"
import { workspaceMemberKeys } from "../queries/use-get-members"

interface UpdateRoleInput {
  workspaceId: number
  memberId: number
  role: Exclude<Role, "owner">
}

export function useUpdateMemberRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ workspaceId, memberId, role }: UpdateRoleInput) =>
      axiosPrivate.patch(`/workspaces/${workspaceId}/members/${memberId}/role`, { role }),
    onSuccess: (_data, { workspaceId }) => {
      queryClient.invalidateQueries({ queryKey: workspaceMemberKeys.all(workspaceId) })
    },
  })
}
