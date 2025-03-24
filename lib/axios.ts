// src/lib/axios.ts
import axios from 'axios'

// 토큰 관리를 위한 변수와 함수
let accessToken: string | null = null

// 토큰 관리 함수
export const tokenService = {
  getToken: () => accessToken,
  setToken: (token: string | null) => {
    accessToken = token
    // 로컬 스토리지에도 저장 (페이지 새로고침 시에도 유지)
    if (token) {
      localStorage.setItem('accessToken', token)
    } else {
      localStorage.removeItem('accessToken')
    }
  },
  // 초기화 함수 - 앱 시작 시 로컬 스토리지에서 토큰 복원
  init: () => {
    if (typeof window !== 'undefined') { // SSR 환경에서 오류 방지
      const storedToken = localStorage.getItem('accessToken')
      if (storedToken) {
        accessToken = storedToken
      }
    }
  }
}

// 초기화 실행
tokenService.init()

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
})

api.interceptors.request.use((config) => {
  const token = tokenService.getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api