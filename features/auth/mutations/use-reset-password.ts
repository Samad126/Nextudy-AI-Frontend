import { useMutation } from "@tanstack/react-query"
import type { AxiosError } from "axios"

import { axiosBase } from "@/lib/api/client"
import type { ApiSuccess, ApiError } from "@/types/api"

export interface ResetPasswordPayload {
  userId: number
  token: string
  newPassword: string
}

interface ResetPasswordResponse {
  message: string
}

async function resetPasswordFn(payload: ResetPasswordPayload): Promise<ResetPasswordResponse> {
  const res = await axiosBase.post<ApiSuccess<ResetPasswordResponse>>("/auth/reset-password", payload)
  return res.data.data
}

export function useResetPassword() {
  return useMutation<ResetPasswordResponse, AxiosError<ApiError>, ResetPasswordPayload>({
    mutationFn: resetPasswordFn,
  })
}
