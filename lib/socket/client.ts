import { io, type Socket } from "socket.io-client"
import { getAccessToken } from "@/lib/api/client"

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000"

let socketInstance: Socket | null = null

export function getSocket(): Socket {
  if (!socketInstance) {
    socketInstance = io(`${SOCKET_URL}/chat`, {
      autoConnect: false,
      withCredentials: true,
      // auth is a callback so it's re-evaluated on every (re)connect —
      // this means a refreshed token is picked up automatically
      auth: (cb) => {
        cb({ token: getAccessToken() })
      },
    })
  }
  return socketInstance
}

export function destroySocket() {
  if (socketInstance) {
    socketInstance.disconnect()
    socketInstance.removeAllListeners()
    socketInstance = null
  }
}
