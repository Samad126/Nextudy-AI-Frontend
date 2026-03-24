import { useQuery } from "@tanstack/react-query"
import { axiosPrivate } from "@/lib/api/client"
import { useAuth } from "@/shared/providers/auth-provider"
import type { ApiSuccess } from "@/types"

export interface UserProfile {
  id: number
  firstName: string
  lastName: string
  email: string
  created_at: string
}

export const settingsKeys = {
  profile: () => ["settings", "profile"] as const,
}

async function getProfile(): Promise<UserProfile> {
  const { data } = await axiosPrivate.get<ApiSuccess<UserProfile>>("/settings/profile")
  return data.data
}

export function useGetProfile() {
  const { hasSession, isAccessTokenHydrated } = useAuth()
  return useQuery({
    queryKey: settingsKeys.profile(),
    queryFn: getProfile,
    enabled: hasSession && isAccessTokenHydrated,
  })
}
