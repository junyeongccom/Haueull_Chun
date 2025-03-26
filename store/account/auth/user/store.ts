'use client'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type UserType = {
    user_id: string
    email: string
    name: string
    isLoggedIn: boolean
    setUser: (user: { user_id: string; email: string; name: string }) => void
    reset: () => void
}

export const useUserStore = create<UserType>()(
    persist((set) => ({
        user_id: "",
        email: "",
        name: "",
        isLoggedIn: false,
        setUser: (user) => set({ 
            user_id: user.user_id,
            email: user.email,
            name: user.name,
            isLoggedIn: true
        }),
        reset: () => set({ 
            user_id: "", 
            email: "",  
            name: "", 
            isLoggedIn: false 
        }),
    }),
    {
        name: "user-storage",
        storage: createJSONStorage(() => localStorage),
    })
)

