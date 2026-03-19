import { axiosPrivate } from "@/lib/api/client"
import { useAuthStore } from "@/store/auth.store"
import { useHasSession } from "@/shared/providers/auth-provider"
import { ApiSuccess, User } from "@/types"
import { useQuery } from "@tanstack/react-query"

async function getUser(): Promise<User> {
  const res = await axiosPrivate.get<ApiSuccess<User>>("/settings/profile/")
  return res.data.data
}

export function useGetUserProfile() {
  const hasSession = useHasSession()
  const isHydrated = useAuthStore((s) => s.isHydrated)

  console.log("HAS SESSION ", hasSession);
  console.log("IS HYDRATED ", isHydrated);

  return useQuery({
    queryFn: getUser,
    queryKey: ["user-profile"],
    enabled: hasSession && isHydrated,
    staleTime: 0,
    retry: false,
  })
}
