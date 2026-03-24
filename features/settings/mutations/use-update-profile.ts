import { useMutation, useQueryClient } from "@tanstack/react-query"
import { axiosPrivate } from "@/lib/api/client"
import type { ApiSuccess } from "@/types"
import { settingsKeys, type UserProfile } from "../queries/use-get-profile"

interface UpdateProfileInput {
  firstName?: string
  lastName?: string
  email?: string
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: UpdateProfileInput) =>
      axiosPrivate.patch<ApiSuccess<UserProfile>>("/settings/profile", input),
    onSuccess: (res) => {
      queryClient.setQueryData(settingsKeys.profile(), res.data.data)
      queryClient.invalidateQueries({ queryKey: ["user-profile"] })
    },
  })
}
