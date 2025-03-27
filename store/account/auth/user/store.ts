'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type UserType = {
    user_id: string
    email: string
    name: string
    setUser: (user: { user_id: string; email: string; name: string }) => void;
    reset: () => void;
}

export const useUserStore = create<UserType>()(
    persist((set) => ({
        user_id: "",
        email: "",
        name: "",
        setUser: (user) => set({ 
            user_id: user.user_id,
            email: user.email,
            name: user.name
        }),
        reset: () => set({ user_id: "", email: "", name: "" }),
        }),
        {
        name: "user-storage",
        storage: createJSONStorage(() => localStorage),
        }
    )
)
