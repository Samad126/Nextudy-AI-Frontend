"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
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
  console.log("AUTH PROVIDER RE-RENDERED")

  const [hasSession, setHasSession] = useState(initialHasSession)
  const [isAccessTokenHydrated, setAccessTokenHydrated] = useState(false)
  const router = useRouter()
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const { mutate: triggerLogout } = useLogout()

  useEffect(() => {
    async function restoreToken() {
      console.log("TRIGGERED RESTORE TOKEN");
      console.log("HAS SESSION IN RESTORE TOKEN", hasSession);
      console.log("getAccessToken()", getAccessToken());

      if (!hasSession) {
        return
      }

      if (getAccessToken()) {
        setAccessTokenHydrated(true)
        return
      }

      try {
        console.log("TRYING TO REFRESH TOKEN");
        const { data } =
          await axiosBase.post<ApiSuccess<RefreshTokenResponse>>(
            "/auth/refresh"
          )
        setAccessToken(data.data.accessToken)
        setAccessTokenHydrated(true)
      } catch {
        window.dispatchEvent(new CustomEvent("auth:session-expired"))
      }
    }

    restoreToken()
  }, [hasSession])

  const handleRedirect = useCallback(() => {
    const isOptional = OPTIONAL_AUTH_PATHS.some(
      (p) => pathname === p || pathname.startsWith(p + "/")
    )

    if (!isOptional) {
      router.push("/login");
    }
  }, [pathname, router])

  const clearToken = useCallback(async () => {
    return fetch("/api/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(() => {
      setAccessToken(null)
      setAccessTokenHydrated(false)
    })
  }, [])

  const handleLogout = async() => {
    triggerLogout();
    await clearToken()
    setHasSession(false)
    queryClient.removeQueries();
    handleRedirect()
  }

  const handleSessionExpire = useCallback(async () => {
    await clearToken()
    setHasSession(false)
    handleRedirect()
  }, [clearToken, handleRedirect]);

  useEffect(() => {
    addEventListener("auth:session-expired", handleSessionExpire)
    return () =>
      removeEventListener("auth:session-expired", handleSessionExpire)
  }, [pathname, router, handleSessionExpire])

  const markSessionActive = useCallback(() => setHasSession(true), [])

  return (
    <AuthContext.Provider
      value={{ hasSession, isAccessTokenHydrated, handleLogout, markSessionActive }}
    >
      {children}
    </AuthContext.Provider>
  )
}
