import { useMutation, useQueryClient } from "@tanstack/react-query"
import { axiosPrivate } from "@/lib/api/client"
import type { Notification } from "@/types/notification"
import { notificationKeys } from "../types"

export function useMarkRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => axiosPrivate.patch(`/notifications/${id}/read`),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.all() })
      const prev = queryClient.getQueryData<Notification[]>(notificationKeys.all())
      queryClient.setQueryData<Notification[]>(notificationKeys.all(), (old) =>
        old?.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      )
      return { prev }
    },
    onError: (_err, _id, ctx) => {
      queryClient.setQueryData(notificationKeys.all(), ctx?.prev)
    },
  })
}
