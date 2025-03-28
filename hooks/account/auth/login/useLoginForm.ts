"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useUserStore } from "@/store/account/auth/user/store";
import { tokenService } from "@/lib/auth_token";

// 사용자 입력을 위한 인터페이스
export interface LoginCredentials {
  accountId: string;
  password: string;
}

// 사용자 데이터를 위한 인터페이스
export interface Member {
  user_id: string;
  email: string;
  name: string;
  created_at?: string;
}

// 로그인 응답 인터페이스
interface LoginResponse {
  status: string;
  message: string;
  access_token: string;
  user: {
    user_id: string;
    email: string;
    name: string;
  }
}

// 훅의 반환 타입 정의
interface UseLoginFormReturn {
  credentials: LoginCredentials;
  loading: boolean;
  error: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLogin: () => Promise<void>;
}

// 훅 props 인터페이스
interface UseLoginFormProps {
  onLoginSuccess?: () => void;
}

// 로그인 커스텀 훅
export const useLoginForm = ({ onLoginSuccess }: UseLoginFormProps = {}): UseLoginFormReturn => {
  // 사용자 입력 상태
  const [credentials, setCredentials] = useState<LoginCredentials>({
    accountId: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  // useUserStore 사용
  const userStore = useUserStore();

  // 입력 필드 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async () => {
    if (!credentials.accountId || !credentials.password) {
      setError("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }
  
    try {
      setLoading(true);
      setError("");
  
      console.log("로그인 요청 데이터:", {
        url: "/api/account/user/login",
        data: {
          user_id: credentials.accountId,
          password: credentials.password
        }
      });
  
      // ✅ refresh_token 쿠키 수신을 위해 withCredentials 설정
      const response = await api.post<LoginResponse>(
        "/api/account/user/login",
        {
          user_id: credentials.accountId,
          password: credentials.password
        },
        { withCredentials: true }
      );
  
      console.log("서버 응답:", response.data);
  
      const { status, message, user, access_token } = response.data;
  
      if (status === "success") {
        // ✅ access_token 저장 (axios 인터셉터에서 자동 사용됨)
        tokenService.setToken(access_token);
  
        // ✅ 사용자 정보 저장
        userStore.setUser({
          user_id: user.user_id,
          email: user.email,
          name: user.name
        });
  
        sessionStorage.setItem("currentUser", JSON.stringify(user));
        console.log("로그인에 성공했습니다:", user);
  
        if (onLoginSuccess) {
          onLoginSuccess();
        } else {
          router.push("/dashboard/common/user/templates");
        }
      } else {
        setError(message || "로그인에 실패했습니다.");
      }
    } catch (err: any) {
      console.error("로그인 오류 상세:", {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        config: {
          url: err.config?.url,
          method: err.config?.method,
          baseURL: err.config?.baseURL,
          headers: err.config?.headers
        }
      });
  
      if (err.response) {
        const statusCode = err.response.status;
        const message = err.response.data?.message || "로그인 중 오류가 발생했습니다.";
  
        if (statusCode === 401) {
          setError("아이디 또는 비밀번호가 일치하지 않습니다.");
        } else if (statusCode === 404) {
          setError("사용자를 찾을 수 없습니다.");
        } else {
          setError(`서버 오류: ${statusCode} - ${message}`);
        }
      } else if (err.request) {
        setError("서버에 연결할 수 없습니다. 네트워크를 확인해주세요.");
      } else {
        setError("로그인 요청 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  return { credentials, loading, error, handleChange, handleLogin };
};