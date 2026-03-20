import { axiosPrivate } from "@/lib/api/client"
import { useAuth } from "@/shared/providers/auth-provider"
import { ApiSuccess, User } from "@/types"
import { useQuery } from "@tanstack/react-query"

async function getUser(): Promise<User> {
  const res = await axiosPrivate.get<ApiSuccess<User>>("/settings/profile/")
  return res.data.data
}

export function useGetUserProfile() {
  const { hasSession, isAccessTokenHydrated } = useAuth()

  console.log("HAS SESSION ", hasSession);
  console.log("IS HYDRATED ", isAccessTokenHydrated);

  return useQuery({
    queryFn: getUser,
    queryKey: ["user-profile"],
    enabled: hasSession && isAccessTokenHydrated,
    staleTime: 0,
    retry: false,
  })
}
