import { useMutation, useQueryClient } from "@tanstack/react-query"
import { axiosPrivate } from "@/lib/api/client"
import type { Notification } from "@/types/notification"
import { notificationKeys } from "../types"

export function useMarkAllRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => axiosPrivate.patch("/notifications/read-all"),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.all() })
      const prev = queryClient.getQueryData<Notification[]>(notificationKeys.all())
      queryClient.setQueryData<Notification[]>(notificationKeys.all(), (old) =>
        old?.map((n) => ({ ...n, is_read: true }))
      )
      return { prev }
    },
    onError: (_err, _vars, ctx) => {
      queryClient.setQueryData(notificationKeys.all(), ctx?.prev)
    },
  })
}
