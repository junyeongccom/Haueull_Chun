'use client'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

// 사용자 정보 인터페이스
interface UserState {
    user_id: string
    email: string
    name: string
    created_at?: string
    setUser: (user: Partial<UserState>) => void
    clearUser: () => void
}

// 사용자 스토어 생성
export const useUserStore = create<UserState>((set) => ({
    user_id: "",
    email: "",
    name: "",
    created_at: undefined,
    
    // 사용자 정보 설정
    setUser: (user) => set((state) => ({ ...state, ...user })),
    
    // 사용자 정보 초기화
    clearUser: () => set({ user_id: "", email: "", name: "", created_at: undefined })
}))

