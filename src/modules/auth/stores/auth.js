import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      profile: null,
      login: (userProfile) => set({ profile: userProfile }),
      logout: () => set({ profile: null }),
    }),
    {
      name: 'auth-store',
      getStorage: () => sessionStorage,
    }
  )
)