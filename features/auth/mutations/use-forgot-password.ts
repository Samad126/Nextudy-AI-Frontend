import { useMutation } from "@tanstack/react-query"
import type { AxiosError } from "axios"

import { axiosBase } from "@/lib/api/client"
import type { ForgotPasswordFormValues } from "@/lib/validations/auth"

interface ForgotPasswordResponse {
  message: string
}

async function forgotPasswordFn(data: ForgotPasswordFormValues): Promise<ForgotPasswordResponse> {
  const res = await axiosBase.post<ForgotPasswordResponse>("/auth/forgot-password", data)
  return res.data
}

export function useForgotPassword() {
  return useMutation<ForgotPasswordResponse, AxiosError, ForgotPasswordFormValues>({
    mutationFn: forgotPasswordFn,
  })
}
