"use client";
import { useState } from "react";
<<<<<<< HEAD
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
=======
import api, { tokenService } from "@/lib/axios";
import { useUserStore } from "@/store/account/auth/user/store";
>>>>>>> 321e26b098c22d142ea7139f04988629777611ac


export async function login(email: string, password: string) {
  const response = await api.post('/api/customer/create', { email, password })
  const token = response.data.accessToken
<<<<<<< HEAD
  useAuthStore.getState().setAccessToken(token)
=======
  tokenService.setToken(token)
>>>>>>> 321e26b098c22d142ea7139f04988629777611ac
}

// 회원가입 폼 인터페이스
export interface SignupFormData {
  user_id: string;
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}

// 커스텀 훅의 반환 타입 정의
interface UseSignupFormReturn {
  formData: SignupFormData;
  loading: boolean;
  error: string | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

// 커스텀 훅 인터페이스
interface UseSignupFormProps {
  onSignupSuccess: () => void;
}

// 커스텀 훅 함수 
export const useSignupForm = ({ onSignupSuccess }: UseSignupFormProps): UseSignupFormReturn => {
  const [formData, setFormData] = useState<SignupFormData>({
    user_id: "",
    email: "",
    password: "",
    confirmPassword: "",
    name: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

<<<<<<< HEAD
=======
  // useUserStore 사용
  const userStore = useUserStore();

>>>>>>> 321e26b098c22d142ea7139f04988629777611ac
  // 입력 필드 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 비밀번호 확인
    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 필수 필드 확인
    if (!formData.user_id || !formData.email || !formData.password || !formData.name) {
      setError("모든 필드를 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // 백엔드 서버 연결 실패 처리 - 로컬 스토리지에 저장
      console.log("회원가입 요청 데이터:", {
        user_id: formData.user_id,
        email: formData.email,
        password: formData.password,
        name: formData.name
      });
      
      try {
        // 백엔드 서버 API 요청 - API 경로 수정 (상대 경로 사용)
<<<<<<< HEAD
        const response = await api.post("/api/customer/create", {
=======
        const response = await api.post("/api/account/customer/create", {
>>>>>>> 321e26b098c22d142ea7139f04988629777611ac
          user_id: formData.user_id,
          email: formData.email,
          password: formData.password,
          name: formData.name
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 3000 // 3초 타임아웃 설정
        });
        
        console.log("회원가입 성공 응답:", response.data);
        
<<<<<<< HEAD
        // 토큰이 있다면 Zustand 스토어에 저장
        if (response.data && response.data.accessToken) {
          useAuthStore.getState().setAccessToken(response.data.accessToken);
        } else {
          // 서버가 토큰을 제공하지 않는 경우 목업 토큰 생성
          const mockToken = `mock_token_${formData.user_id}_${Date.now()}`;
          useAuthStore.getState().setAccessToken(mockToken);
        }
        
=======
        // 토큰이 있다면 저장
        if (response.data && response.data.accessToken) {
          tokenService.setToken(response.data.accessToken);
        } else {
          // 서버가 토큰을 제공하지 않는 경우 목업 토큰 생성
          const mockToken = `mock_token_${formData.user_id}_${Date.now()}`;
          tokenService.setToken(mockToken);
        }
        
        // useUserStore에 사용자 정보 저장
        userStore.user_id = formData.user_id;
        userStore.email = formData.email;
        userStore.name = formData.name;
        
>>>>>>> 321e26b098c22d142ea7139f04988629777611ac
        // 성공 시 콜백 호출
        onSignupSuccess();
      } catch (apiError) {
        console.warn("백엔드 서버 연결 실패, 로컬 스토리지에 저장합니다:", apiError);
        
        // API 요청 실패 시 로컬 스토리지 사용
        const users = JSON.parse(localStorage.getItem('localUsers') || '[]');
        
        // 중복 ID 확인
        const duplicateUser = users.find((user: any) => 
          user.user_id === formData.user_id || user.email === formData.email
        );
        
        if (duplicateUser) {
          setError("이미 등록된 사용자 ID 또는 이메일입니다.");
          return;
        }
        
        // 로컬 스토리지에 사용자 정보 저장
        users.push({
          user_id: formData.user_id,
          email: formData.email,
          password: formData.password,
          name: formData.name,
          created_at: new Date().toISOString()
        });
        
        localStorage.setItem('localUsers', JSON.stringify(users));
        console.log("로컬 스토리지에 회원 정보 저장 완료");
        
<<<<<<< HEAD
=======
        // useUserStore에 사용자 정보 저장
        userStore.user_id = formData.user_id;
        userStore.email = formData.email;
        userStore.name = formData.name;
        
>>>>>>> 321e26b098c22d142ea7139f04988629777611ac
        // 성공 시 콜백 호출
        onSignupSuccess();
      }
    } catch (err) {
      console.error("회원가입 처리 중 오류 발생:", err);
      setError("회원가입 처리 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    error,
    handleChange,
    handleSubmit
  };
}; 