"use client"

import {
  createContext,
  startTransition,
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

  useEffect(() => {
    if (!isAccessTokenHydrated || !hasSession) return

    const sock = getSocket()
    startTransition(() => setSocket(sock))

    function onConnect() {
      setIsConnected(true)
    }

    async function onDisconnect(reason: string) {
      if (reason === "io server disconnect") {
        try {
          const { data: res } =
            await axiosBase.post<ApiSuccess<RefreshTokenResponse>>(
              "/auth/refresh"
            )
          setAccessToken(res.data.accessToken)
          sock.connect();
        } catch {
          window.dispatchEvent(new CustomEvent("auth:session-expired"))
        }
      }
    }

    sock.on("connect", onConnect)
    sock.on("disconnect", onDisconnect)

    return () => {
      sock.off("connect", onConnect)
      sock.off("disconnect", onDisconnect)
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
    return () =>
      window.removeEventListener("auth:session-expired", handleExpire)
  }, [])

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  )
}
