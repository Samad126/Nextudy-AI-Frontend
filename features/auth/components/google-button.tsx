"use client"

import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { useGoogleLogin } from "@react-oauth/google"
import { Button } from "@/shared/ui/button"
import { axiosBase, setAccessToken } from "@/lib/api/client"
import { useAuth } from "@/shared/providers/auth-provider"
import { GoogleIcon } from "./google-icon"
import type { ApiSuccess } from "@/types"

interface GoogleAuthData {
  accessToken: string
  refreshToken: string
}

export function GoogleButton({
  label = "Continue with Google",
}: {
  label?: string
}) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { markSessionActive } = useAuth()

  const login = useGoogleLogin({
    onSuccess: async ({ access_token }) => {
      const res = await axiosBase.post<ApiSuccess<GoogleAuthData>>("/auth/google", {
        accessToken: access_token,
      })
      setAccessToken(res.data.data.accessToken)
      markSessionActive()
      queryClient.resetQueries()
      router.push("/")
    },
    onError: () => {},
  })

  return (
    <Button
      type="button"
      variant="outline"
      className="h-10 w-full cursor-pointer gap-2"
      onClick={() => login()}
    >
      <GoogleIcon />
      {label}
    </Button>
  )
}
