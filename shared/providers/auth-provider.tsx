"use client"

import { createContext, useContext, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

import { axiosBase, axiosPrivate, RefreshTokenResponse, setAccessToken } from "@/lib/api/client"
import { useAuthStore } from "@/store/auth.store"
import type { ApiSuccess, User } from "@/types"

const OPTIONAL_AUTH_PATHS = ["/", "/about", "/pricing"]

const HasSessionContext = createContext(false)
export const useHasSession = () => useContext(HasSessionContext)

interface AuthProviderProps {
  children: React.ReactNode
  hasSession: boolean
}

export function AuthProvider({ children, hasSession }: AuthProviderProps) {
  const { setUser, setHydrated, logout } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!hasSession) {
      setHydrated()
      return
    }

    async function restoreSession() {
      try {
        const { data } = await axiosBase.post<ApiSuccess<RefreshTokenResponse>>("/auth/refresh")
        setAccessToken(data.data.accessToken)
        const { data: userData } = await axiosPrivate.get<ApiSuccess<User>>("/settings/profile/")
        setUser(userData.data)
      } catch {
        // session invalid — user stays null
      } finally {
        setHydrated()
      }
    }

    restoreSession()
  }, [hasSession, setUser, setHydrated])

  useEffect(() => {
    function handleSessionExpired() {
      logout()

      const isOptional = OPTIONAL_AUTH_PATHS.some(
        (p) => pathname === p || pathname.startsWith(p + "/")
      )

      if (!isOptional) {
        router.push("/login")
      }
    }

    window.addEventListener("auth:session-expired", handleSessionExpired)
    return () => window.removeEventListener("auth:session-expired", handleSessionExpired)
  }, [pathname, router, logout])

  return (
    <HasSessionContext.Provider value={hasSession}>
      {children}
    </HasSessionContext.Provider>
  )
}
