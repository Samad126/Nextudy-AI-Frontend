"use client"

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"
import type { Socket } from "socket.io-client"
import { getSocket, destroySocket } from "@/lib/socket/client"
import { useAuth } from "@/shared/providers/auth-provider"
import { axiosBase, setAccessToken } from "@/lib/api/client"
import type { ApiSuccess } from "@/types"
import type { RefreshTokenResponse } from "@/lib/api/client"

interface SocketContextValue {
  socket: Socket | null
  isConnected: boolean
}

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  isConnected: false,
})

export const useSocket = () => useContext(SocketContext)

export function SocketProvider({ children }: { children: ReactNode }) {
  const { isAccessTokenHydrated, hasSession } = useAuth()
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  // prevent concurrent token refresh attempts on the socket level
  const isRefreshingRef = useRef(false)

  useEffect(() => {
    if (!isAccessTokenHydrated || !hasSession) return

    const sock = getSocket()
    setSocket(sock)

    function onConnect() {
      setIsConnected(true)
    }

    function onDisconnect() {
      setIsConnected(false)
    }

    // NestJS WS gateway throws `exception` events for auth errors
    async function onException(data: { status?: number; message?: string }) {
      const isAuthError =
        data?.status === 401 ||
        data?.message?.toLowerCase().includes("unauthorized")

      if (!isAuthError || isRefreshingRef.current) return

      isRefreshingRef.current = true
      try {
        const { data: res } =
          await axiosBase.post<ApiSuccess<RefreshTokenResponse>>("/auth/refresh")
        setAccessToken(res.data.accessToken)
        // Disconnect and reconnect — the auth callback will pick up the new token
        sock.disconnect()
        sock.connect()
      } catch {
        window.dispatchEvent(new CustomEvent("auth:session-expired"))
      } finally {
        isRefreshingRef.current = false
      }
    }

    sock.on("connect", onConnect)
    sock.on("disconnect", onDisconnect)
    sock.on("exception", onException)

    return () => {
      sock.off("connect", onConnect)
      sock.off("disconnect", onDisconnect)
      sock.off("exception", onException)
      destroySocket()
      setSocket(null)
      setIsConnected(false)
    }
  }, [isAccessTokenHydrated, hasSession])

  // Disconnect socket when the session expires
  useEffect(() => {
    function handleExpire() {
      destroySocket()
      setSocket(null)
      setIsConnected(false)
    }
    window.addEventListener("auth:session-expired", handleExpire)
    return () => window.removeEventListener("auth:session-expired", handleExpire)
  }, [])

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  )
}
