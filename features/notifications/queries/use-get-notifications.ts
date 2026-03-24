import { useQuery } from "@tanstack/react-query"
import { axiosPrivate } from "@/lib/api/client"
import { useAuth } from "@/shared/providers/auth-provider"
import type { ApiSuccess } from "@/types"
import type { Notification } from "@/types/notification"
import { notificationKeys } from "../types"

async function getNotifications(): Promise<Notification[]> {
  const { data } = await axiosPrivate.get<ApiSuccess<Notification[]>>("/notifications")
  return data.data
}

export function useGetNotifications() {
  const { hasSession, isAccessTokenHydrated } = useAuth()
  return useQuery({
    queryKey: notificationKeys.all(),
    queryFn: getNotifications,
    enabled: hasSession && isAccessTokenHydrated,
  })
}
