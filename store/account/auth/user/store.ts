'use client'
import { create } from 'zustand'
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import api from "@/lib/axios";

// 상태 타입 정의
type UserState = {
    user_id: string
    email: string
    name: string
    isLoading: boolean
    error: string | null
}

// 액션 타입 정의
type UserActions = {
    setUser: (user: UserState) => void
    signup: (userData: { user_id: string; email: string; password: string; name: string }) => Promise<void>
    updateEmail: (email: UserState['email']) => Promise<void>
    updateName: (name: UserState['name']) => Promise<void>
    reset: () => void
    setError: (error: string | null) => void
}

// 사용자 스토어 생성
export const useUserStore = create<UserState & UserActions>()(
 subscribeWithSelector(
    devtools(
        persist(
            immer(
                (set) => ({
                    // 초기 상태
                    user_id: "",
                    email: "",
                    name: "",
                    isLoading: false,
                    error: null,

                    // 액션
                    setUser: (user) =>
                        set((state) => {
                          state.user_id = user.user_id;
                          state.email = user.email;
                          state.name = user.name;
                        }, false, 'user/setUser'),
                    
                    signup: async (userData) => {
                        set((state) => { state.isLoading = true; state.error = null; });
                        try {
                            const response = await api.post("/auth/user/signup", userData);
                            if (response.data.status === "success") {
                                set((state) => {
                                    state.user_id = userData.user_id;
                                    state.email = userData.email;
                                    state.name = userData.name;
                                    state.isLoading = false;
                                }, false, 'user/signup/success');
                            }
                        } catch (error: any) {
                            set((state) => {
                                state.error = error.response?.data?.message || "회원가입 중 오류가 발생했습니다.";
                                state.isLoading = false;
                            }, false, 'user/signup/error');
                            throw error;
                        }
                    },
            
                    updateEmail: async (email) => {
                        await new Promise((res) => setTimeout(res, 200));
                        set((state) => {
                          state.email = email;
                        }, false, 'user/updateEmail');
                    },
            
                    updateName: async (name) => {
                        await new Promise((res) => setTimeout(res, 200));
                        set((state) => {
                          state.name = name;
                        }, false, 'user/updateName');
                    },
            
                    reset: () =>
                        set((state) => {
                          state.user_id = '';
                          state.email = '';
                          state.name = '';
                          state.error = null;
                        }, false, 'user/reset'),

                    setError: (error) =>
                        set((state) => {
                            state.error = error;
                        }, false, 'user/setError')
                    })),
                    {
                      name: 'user-storage',
                      storage: createJSONStorage(() => localStorage),
                    }
                  ),
                  { name: 'UserStore' }
                )
              )
            );