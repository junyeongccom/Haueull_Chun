"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/account/auth/user/store";

// 회원가입 폼 데이터 인터페이스
export interface SignupFormData {
  user_id: string;
  email: string;
  password: string;
  name: string;
}

// 회원가입 응답 인터페이스
interface SignupResponse {
  status: string;
  message: string;
  user: {
    user_id: string;
    email: string;
    name: string;
  };
}

// 훅 반환 타입
interface UseSignupFormReturn {
  formData: SignupFormData;
  loading: boolean;
  error: string | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => Promise<void>;
}

// 회원가입 커스텀 훅
export const useSignupForm = (): UseSignupFormReturn => {
  const [formData, setFormData] = useState<SignupFormData>({
    user_id: "",
    email: "",
    password: "",
    name: ""
  });
  
  const { signup, isLoading, error } = useUserStore((state) => ({
    signup: state.signup,
    isLoading: state.isLoading,
    error: state.error
  }));
  
  const router = useRouter();

  // 입력 필드 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 회원가입 제출 핸들러
  const handleSubmit = async () => {
    // 유효성 검사
    if (!formData.user_id || !formData.email || !formData.password || !formData.name) {
      useUserStore.getState().setError("모든 필드를 입력해주세요.");
      return;
    }

    try {
      await signup(formData);
      router.push("/account/auth/user/login");
    } catch (err) {
      console.error("회원가입 오류:", err);
    }
  };

  return {
    formData,
    loading: isLoading,
    error,
    handleChange,
    handleSubmit
  };
}; 