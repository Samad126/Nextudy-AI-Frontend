import { useMutation } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { axiosBase } from "@/lib/api/client"
import type { ApiError, ApiSuccess } from "@/types/api"

export interface ContactPayload {
  name: string
  email: string
  message: string
}

async function contactFn(data: ContactPayload): Promise<void> {
  await axiosBase.post<ApiSuccess<void>>("/contact", data)
}

export function useContact() {
  return useMutation<void, AxiosError<ApiError>, ContactPayload>({
    mutationFn: contactFn,
  })
}
