"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

import {
  axiosBase,
  getAccessToken,
  RefreshTokenResponse,
  setAccessToken,
} from "@/lib/api/client"
import type { ApiSuccess } from "@/types"

const OPTIONAL_AUTH_PATHS = ["/", "/about", "/pricing"]

interface AuthContextValue {
  hasSession: boolean
  isHydrated: boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextValue>({
  hasSession: false,
  isHydrated: false,
  logout: () => {},
})

export const useAuth = () => useContext(AuthContext)

interface AuthProviderProps {
  children: React.ReactNode
  hasSession: boolean
}

export function AuthProvider({ children, hasSession }: AuthProviderProps) {
  console.log("AUTH PROVIDER RE-RENDERED");

  const [isHydrated, setHydrated] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  function logout() {
    setAccessToken(null)
    setHydrated(false)
  }

  useEffect(() => {
    async function restoreToken() {
      if (!hasSession) {
        return
      }

      if (getAccessToken()) {
        setHydrated(true)
        return
      }

      try {
        const { data } =
          await axiosBase.post<ApiSuccess<RefreshTokenResponse>>(
            "/auth/refresh"
          )
        setAccessToken(data.data.accessToken)
        setHydrated(true)
      } catch {
        window.dispatchEvent(new CustomEvent("auth:session-expired"))
      }
    }

    restoreToken()
  }, [hasSession])

  useEffect(() => {
    function handleSessionExpired() {
      fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }).then(() => {
        logout()
        console.log("TRIGGERED FETCH")

        const isOptional = OPTIONAL_AUTH_PATHS.some(
          (p) => pathname === p || pathname.startsWith(p + "/")
        )

        if (!isOptional) {
          router.push("/login")
        }

        router.refresh()
      })
    }

    addEventListener("auth:session-expired", handleSessionExpired)
    return () =>
      removeEventListener("auth:session-expired", handleSessionExpired)
  }, [pathname, router])

  return (
    <AuthContext.Provider value={{ hasSession, isHydrated, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
