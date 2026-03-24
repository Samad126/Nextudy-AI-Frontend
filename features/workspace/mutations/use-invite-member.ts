import { useMutation } from "@tanstack/react-query"
import { axiosPrivate } from "@/lib/api/client"

interface InviteMemberInput {
  workspaceId: number
  email: string
}

export function useInviteMember() {
  return useMutation({
    mutationFn: ({ workspaceId, email }: InviteMemberInput) =>
      axiosPrivate.post(`/workspaces/${workspaceId}/invite`, { email }),
  })
}
