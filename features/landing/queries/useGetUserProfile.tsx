import { axiosPrivate } from "@/lib/api/client"
import { ApiSuccess, User } from "@/types"
import { useQuery } from "@tanstack/react-query"

async function getUser(): Promise<User> {
  const res = await axiosPrivate.get<ApiSuccess<User>>("/settings/profile/")
  return res.data.data
}

export function useGetUserProfile() {
  return useQuery({
    queryFn: getUser,
    queryKey: ["user-profile"],
  })
}
