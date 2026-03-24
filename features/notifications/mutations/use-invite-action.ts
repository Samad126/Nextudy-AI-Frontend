import { useMutation, useQueryClient } from "@tanstack/react-query"
import { axiosPrivate } from "@/lib/api/client"
import { notificationKeys } from "../types"

interface InviteActionInput {
  inviteId: number
  action: "accept" | "reject"
}

export function useInviteAction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ inviteId, action }: InviteActionInput) =>
      axiosPrivate.post(`/notifications/invites/${inviteId}/${action}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all() })
      queryClient.invalidateQueries({ queryKey: ["workspaces"] })
    },
  })
}
