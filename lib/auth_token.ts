// src/lib/auth_token.ts

let accessToken: string | null = null

export const tokenService = {
  getToken: (): string | null => {
    return accessToken || (typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null)
  },

  setToken: (token: string | null) => {
    accessToken = token
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('accessToken', token)
      } else {
        localStorage.removeItem('accessToken')
      }
    }
    // ✅ 로그 출력
    if (token) {
        console.log('🔐 Access Token 저장됨:', token)
        } else {
        console.log('🗑️ Access Token 제거됨')
        }
  },

  init: () => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('accessToken')
      if (storedToken) {
        accessToken = storedToken
      }
    }
  }
}
