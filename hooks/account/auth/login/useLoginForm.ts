"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useUserStore } from "@/store/account/auth/user/store";

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
  user: Member;
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
    // 간단한 유효성 검사
    if (!credentials.accountId || !credentials.password) {
      setError("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      // 요청 데이터 로깅
      console.log("로그인 요청 데이터:", {
        url: "/api/auth/user/login",
        data: {
          user_id: credentials.accountId,
          password: credentials.password
        }
      });
      
      // 백엔드에 로그인 요청
      const response = await api.post<LoginResponse>("/api/auth/user/login", {
        user_id: credentials.accountId,
        password: credentials.password
      });
      
      // 응답 데이터 로깅
      console.log("서버 응답:", response.data);
      
      // 응답 데이터에서 사용자 정보 추출
      const { status, message, user } = response.data;
      
      if (status === "success") {
        // useUserStore에 사용자 정보 저장
        userStore.user_id = user.user_id;
        userStore.email = user.email;
        userStore.name = user.name;
        
        // 세션 스토리지에 사용자 정보 저장
        sessionStorage.setItem("currentUser", JSON.stringify(user));
        
        console.log("로그인 성공:", user);
        
        // 성공 콜백이 있으면 호출, 없으면 대시보드로 이동
        if (onLoginSuccess) {
          onLoginSuccess();
        } else {
          // 대시보드로 이동
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
        // 서버가 응답을 반환한 경우
        const statusCode = err.response.status;
        const message = err.response.data?.message || '로그인 중 오류가 발생했습니다.';
        
        if (statusCode === 401) {
          setError("아이디 또는 비밀번호가 일치하지 않습니다.");
        } else if (statusCode === 404) {
          setError("사용자를 찾을 수 없습니다.");
        } else {
          setError(`서버 오류: ${statusCode} - ${message}`);
        }
      } else if (err.request) {
        // 요청이 전송되었지만 응답이 없는 경우
        console.error("요청은 전송됐으나 응답 없음:", {
          request: err.request,
          config: err.config
        });
        setError("서버에 연결할 수 없습니다. 네트워크를 확인해주세요.");
      } else {
        // 요청 설정 중 오류가 발생한 경우
        setError("로그인 요청 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    credentials,
    loading,
    error,
    handleChange,
    handleLogin
  };
};
