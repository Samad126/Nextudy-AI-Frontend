import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import type { AxiosError } from "axios"

import { axiosBase, setAccessToken } from "@/lib/api/client"
import type { LoginFormValues } from "@/lib/validations/auth"
import type { ApiSuccess, ApiError } from "@/types/api"
import { useAuth } from "@/shared/providers/auth-provider"
import { trackLogin } from "@/lib/analytics"

interface LoginData {
  accessToken: string
  refreshToken: string
}

async function loginFn(data: LoginFormValues): Promise<LoginData> {
  const res = await axiosBase.post<ApiSuccess<LoginData>>("/auth/login", data)
  return res.data.data
}

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { markSessionActive } = useAuth()

  return useMutation<LoginData, AxiosError<ApiError>, LoginFormValues>({
    mutationFn: loginFn,
    onSuccess: (data) => {
      setAccessToken(data.accessToken)
      markSessionActive()
      trackLogin("email")
      queryClient.resetQueries();
      router.push("/workspaces")
    },
  })
}
