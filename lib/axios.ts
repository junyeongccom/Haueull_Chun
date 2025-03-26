// src/lib/axios.ts
import axios from 'axios'

// API 기본 설정
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api