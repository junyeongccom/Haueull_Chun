// src/lib/axios.ts
import axios from 'axios'
import { tokenService } from './auth_token'

// 앱 시작 시 토큰 초기화
tokenService.init()

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false,
  timeout: 8000
})

// 요청 시 access_token 자동 추가
api.interceptors.request.use((config) => {
  const token = tokenService.getToken()
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }

  console.log('📡 API 요청:', {
    url: config.url,
    method: config.method,
    data: config.data,
    headers: config.headers
  })

  return config
})

export default api
