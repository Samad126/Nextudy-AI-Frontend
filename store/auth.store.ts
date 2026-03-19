import { create } from "zustand"

import { setAccessToken } from "@/lib/api/client"
import type { User } from "@/types/user"

interface AuthStore {
  user: User | null
  isHydrated: boolean
  setUser: (user: User | null) => void
  setHydrated: () => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isHydrated: false,
  setUser: (user) => set({ user }),
  setHydrated: () => set({ isHydrated: true }),
  logout: () => {
    setAccessToken(null)
    set({ user: null })
  },
}))
