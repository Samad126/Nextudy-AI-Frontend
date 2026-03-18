import { create } from "zustand"

import { setAccessToken } from "@/lib/api/client"
import type { User } from "@/types/user"

interface AuthStore {
  user: User | null
  setUser: (user: User | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => {
    setAccessToken(null)
    set({ user: null })
  },
}))
