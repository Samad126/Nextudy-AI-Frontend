"use client"

import { Button } from "@/shared/ui/button"
import { useGoogleLogin } from "@react-oauth/google"
import { GoogleIcon } from "./google-icon"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export function GoogleButton({
  label = "Continue with Google",
}: {
  label?: string
}) {
  const login = useGoogleLogin({
    onSuccess: async ({ access_token }) => {
      console.log("Access Token: ", access_token)
      const res = await fetch(`${API_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: access_token }),
      })

      console.log(await res.json());
      // const { accessToken, refreshToken } = await res.json()
      // localStorage.setItem("accessToken", accessToken)
      // localStorage.setItem("refreshToken", refreshToken)
    },

    onError: (errResponse => {
      console.log(errResponse);
    })
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
