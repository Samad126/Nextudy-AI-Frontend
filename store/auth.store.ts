import { create } from "zustand"

import { setAccessToken } from "@/lib/api/client"

interface AuthStore {
  isHydrated: boolean
  setHydrated: (val: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  isHydrated: false,
  setHydrated: (val) => set({ isHydrated: val }),
  logout: () => {
    setAccessToken(null)
    set({ isHydrated: false })
  },
}))
