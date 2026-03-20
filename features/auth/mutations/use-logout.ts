import { useMutation } from "@tanstack/react-query"

import { axiosPrivate } from "@/lib/api/client"
import type { ApiSuccess } from "@/types/api"

async function logoutFn(): Promise<void> {
  await axiosPrivate.post<ApiSuccess<void>>("/auth/logout")
  return
}

export function useLogout() {
  return useMutation({
    mutationFn: logoutFn,
  })
}
