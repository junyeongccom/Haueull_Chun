"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

// 회원가입 폼 데이터 인터페이스
export interface SignupFormData {
  user_id: string;
  email: string;
  password: string;
  confirmPassword: string;
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
  error: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => Promise<void>;
}

// 회원가입 커스텀 훅
export const useSignupForm = (): UseSignupFormReturn => {
  const [formData, setFormData] = useState<SignupFormData>({
    user_id: "",
    email: "",
    password: "",
    confirmPassword: "",
    name: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
      setError("모든 필드를 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.post<SignupResponse>("/auth/user/signup", formData);
      
      if (response.data.status === "success") {
        router.push("/auth/login");
      } else {
        setError(response.data.message || "회원가입에 실패했습니다.");
      }
    } catch (err: any) {
      console.error("회원가입 오류:", err);
      setError(err.response?.data?.message || "회원가입 중 오류가 발생했습니다.");
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