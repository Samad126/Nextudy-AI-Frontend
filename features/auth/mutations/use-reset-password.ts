import { useMutation } from "@tanstack/react-query"
import type { AxiosError } from "axios"

import { axiosBase } from "@/lib/api/client"

export interface ResetPasswordPayload {
  userId: number
  token: string
  newPassword: string
}

interface ResetPasswordResponse {
  message: string
}

interface ResetPasswordError {
  message: string
}

async function resetPasswordFn(payload: ResetPasswordPayload): Promise<ResetPasswordResponse> {
  const res = await axiosBase.post<ResetPasswordResponse>("/auth/reset-password", payload)
  return res.data
}

export function useResetPassword() {
  return useMutation<ResetPasswordResponse, AxiosError<ResetPasswordError>, ResetPasswordPayload>({
    mutationFn: resetPasswordFn,
  })
}
