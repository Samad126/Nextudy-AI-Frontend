"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import { useRouter, usePathname } from "next/navigation"

import {
  axiosBase,
  getAccessToken,
  RefreshTokenResponse,
  setAccessToken,
} from "@/lib/api/client"
import type { ApiSuccess } from "@/types"
import { useLogout } from "@/features/auth/mutations/use-logout"
import { useQueryClient } from "@tanstack/react-query"

const OPTIONAL_AUTH_PATHS = ["/", "/about", "/pricing"]

interface AuthContextValue {
  hasSession: boolean
  isAccessTokenHydrated: boolean
  handleLogout: () => void
  markSessionActive: () => void
}

const AuthContext = createContext<AuthContextValue>({
  hasSession: false,
  isAccessTokenHydrated: false,
  handleLogout: () => {},
  markSessionActive: () => {},
})

export const useAuth = () => useContext(AuthContext)

interface AuthProviderProps {
  children: React.ReactNode
  hasSession: boolean
}

export function AuthProvider({ children, hasSession: initialHasSession }: AuthProviderProps) {
  const [hasSession, setHasSession] = useState(initialHasSession)
  const [isAccessTokenHydrated, setAccessTokenHydrated] = useState(false)
  const router = useRouter()
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const { mutateAsync: triggerLogout } = useLogout()
  const isCleaningUp = useRef(false)

  const handleRedirect = useCallback(() => {
    const isOptional = OPTIONAL_AUTH_PATHS.some(
      (p) => pathname === p || pathname.startsWith(p + "/")
    )

    if (!isOptional) {
      router.push("/login");
    }
  }, [pathname, router])

  const clearToken = useCallback(async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
    } finally {
      setAccessToken(null)
      setAccessTokenHydrated(false)
    }
  }, [])

  const handleSessionExpire = useCallback(async () => {
    if (isCleaningUp.current) return
    isCleaningUp.current = true
    try {
      await clearToken()
    } finally {
      setHasSession(false)
      handleRedirect()
      router.refresh()
      isCleaningUp.current = false
    }
  }, [clearToken, handleRedirect, router])

  useEffect(() => {
    async function restoreToken() {
      if (!hasSession) {
        return
      }

      if (getAccessToken()) {
        setAccessTokenHydrated(true)
        return
      }

      try {
        const { data } =
          await axiosBase.post<ApiSuccess<RefreshTokenResponse>>(
            "/auth/refresh"
          )
        setAccessToken(data.data.accessToken)
        setAccessTokenHydrated(true)
      } catch {
        await handleSessionExpire()
      }
    }

    restoreToken()
  }, [hasSession, handleSessionExpire])

  const handleLogout = useCallback(async () => {
    if (isCleaningUp.current) return
    isCleaningUp.current = true
    try {
      await triggerLogout()
    } catch {
      // backend call failed (e.g. token already expired) — proceed with local cleanup
    }
    try {
      await clearToken()
    } finally {
      setHasSession(false)
      queryClient.removeQueries()
      handleRedirect()
      router.refresh()
      isCleaningUp.current = false
    }
  }, [triggerLogout, clearToken, queryClient, handleRedirect, router])

  useEffect(() => {
    window.addEventListener("auth:session-expired", handleSessionExpire)
    return () =>
      window.removeEventListener("auth:session-expired", handleSessionExpire)
  }, [handleSessionExpire])

  const markSessionActive = useCallback(() => setHasSession(true), [])

  return (
    <AuthContext.Provider
      value={{ hasSession, isAccessTokenHydrated, handleLogout, markSessionActive }}
    >
      {children}
    </AuthContext.Provider>
  )
}
