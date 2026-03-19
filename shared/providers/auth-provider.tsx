"use client"

import { createContext, useContext, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

import {
  axiosBase,
  getAccessToken,
  RefreshTokenResponse,
  setAccessToken,
} from "@/lib/api/client"
import { useAuthStore } from "@/store/auth.store"
import type { ApiSuccess } from "@/types"

const OPTIONAL_AUTH_PATHS = ["/", "/about", "/pricing"]

const HasSessionContext = createContext(false)
export const useHasSession = () => useContext(HasSessionContext)

interface AuthProviderProps {
  children: React.ReactNode
  hasSession: boolean
}

export function AuthProvider({ children, hasSession }: AuthProviderProps) {
  const { setHydrated, logout } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()

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
        // refresh failed — token stays null, queries will get 401
      }
    }

    restoreToken()
  }, [hasSession, setHydrated])

  useEffect(() => {
    function handleSessionExpired() {
      fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }).then(() => {
        logout();
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
  }, [pathname, router, logout, setHydrated])

  return (
    <HasSessionContext.Provider value={hasSession}>
      {children}
    </HasSessionContext.Provider>
  )
}
