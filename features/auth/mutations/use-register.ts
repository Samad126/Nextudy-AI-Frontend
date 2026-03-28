import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import type { AxiosError } from "axios"

import { axiosBase, setAccessToken } from "@/lib/api/client"
import type { RegisterFormValues } from "@/lib/validations/auth"
import type { ApiSuccess, ApiError } from "@/types/api"
import { useAuth } from "@/shared/providers/auth-provider"
import { trackSignUp } from "@/lib/analytics"

interface RegisterData {
  accessToken: string
  refreshToken: string
}

async function registerFn(data: RegisterFormValues): Promise<RegisterData> {
  const { confirmPassword, terms, ...body } = data
  const res = await axiosBase.post<ApiSuccess<RegisterData>>("/auth/register", body)
  return res.data.data
}

export function useRegister() {
  const router = useRouter()
  const { markSessionActive } = useAuth()

  return useMutation<RegisterData, AxiosError<ApiError>, RegisterFormValues>({
    mutationFn: registerFn,
    onSuccess: (data) => {
      setAccessToken(data.accessToken)
      markSessionActive()
      trackSignUp("email")
      router.push("/")
    },
  })
}
