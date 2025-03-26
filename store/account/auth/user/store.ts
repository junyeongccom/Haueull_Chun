'use client'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type UserType = {
    user_id: string
    email: string
<<<<<<< HEAD
    name: string
    isLoggedIn: boolean
    setUser: (user: { user_id: string; email: string; name: string }) => void
    reset: () => void
=======
    password: string
    name: string
    reset: () => void;
>>>>>>> 321e26b098c22d142ea7139f04988629777611ac
}

export const useUserStore = create<UserType>()(
    persist((set) => ({
        user_id: "",
        email: "",
<<<<<<< HEAD
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
=======
        password: "",
        name: "",
        reset: () => set({ user_id: "", email: "", password: "", name: "" }),
        }),
        {
        name: "user-storage",
        storage: createJSONStorage(() => localStorage),
        }
        )
>>>>>>> 321e26b098c22d142ea7139f04988629777611ac
)

