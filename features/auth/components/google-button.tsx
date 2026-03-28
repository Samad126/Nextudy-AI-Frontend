"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { useGoogleLogin } from "@react-oauth/google"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Button } from "@/shared/ui/button"
import { axiosBase, setAccessToken } from "@/lib/api/client"
import { getApiErrorMessage } from "@/lib/api/get-api-error"
import { useAuth } from "@/shared/providers/auth-provider"
import { GoogleIcon } from "./google-icon"
import type { ApiSuccess } from "@/types"
import { trackLogin } from "@/lib/analytics"

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
  const [isLoading, setIsLoading] = useState(false)

  const login = useGoogleLogin({
    onSuccess: async ({ access_token }) => {
      try {
        const res = await axiosBase.post<ApiSuccess<GoogleAuthData>>("/auth/google", {
          accessToken: access_token,
        })
        setAccessToken(res.data.data.accessToken)
        markSessionActive()
        trackLogin("google")
        queryClient.resetQueries()
        router.push("/")
      } catch (err) {
        toast.error(getApiErrorMessage(err, "Failed to sign in with Google"))
      } finally {
        setIsLoading(false)
      }
    },
    onError: () => {
      setIsLoading(false)
    },
    onNonOAuthError: () => {
      setIsLoading(false)
    },
  })

  return (
    <Button
      type="button"
      variant="outline"
      className="h-10 w-full cursor-pointer gap-2"
      onClick={() => {
        setIsLoading(true)
        login()
      }}
      disabled={isLoading}
    >
      {isLoading ? <Loader2 className="size-4 animate-spin" /> : <GoogleIcon />}
      {label}
    </Button>
  )
}
