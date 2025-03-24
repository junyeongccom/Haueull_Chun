"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api, { tokenService } from "@/lib/axios";
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
  password?: string; // 로컬 스토리지 인증에서만 사용됨
  created_at?: string;
}

// 로그인 응답 인터페이스
interface LoginResponse {
  status: string;
  message: string;
  accessToken: string;
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
      
      // 표준 JWT 인증을 위한 로그인 요청
      const response = await api.post<LoginResponse>("/api/auth/login", {
        user_id: credentials.accountId,
        password: credentials.password
      }, {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      });
      
      // 응답 데이터에서 토큰과 사용자 정보 추출
      const { accessToken, user } = response.data;
      
      // 토큰이 없는 경우 오류 처리
      if (!accessToken) {
        throw new Error("인증 토큰을 받지 못했습니다.");
      }
      
      // axios의 tokenService를 통해 토큰 저장
      tokenService.setToken(accessToken);
      
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
      
    } catch (err: any) {
      console.error("로그인 오류:", err);
      
      // 백엔드 API 연결 불가능한 경우 로컬 스토리지 인증으로 폴백
      if (err.code === 'ECONNABORTED' || err.message === 'Network Error') {
        console.warn("백엔드 서버 연결 실패, 로컬 스토리지에서 인증 시도");
        
        try {
          // 로컬 스토리지에서 사용자 조회
          const localUsersStr = localStorage.getItem('localUsers');
          if (localUsersStr) {
            const localUsers = JSON.parse(localUsersStr);
            
            // 사용자 검증
            const user = localUsers.find(
              (member: Member) => 
                member.user_id.toLowerCase() === credentials.accountId.toLowerCase() && 
                member.password === credentials.password
            );
            
            if (user) {
              // 로컬 인증 성공 - 목업 토큰 생성
              const mockToken = `mock_token_${user.user_id}_${Date.now()}`;
              tokenService.setToken(mockToken);
              
              // useUserStore에 사용자 정보 저장
              userStore.user_id = user.user_id;
              userStore.email = user.email;
              userStore.name = user.name;
              
              // 세션 스토리지에 사용자 정보 저장
              sessionStorage.setItem("currentUser", JSON.stringify(user));
              
              console.log("로컬 인증 성공:", user);
              
              // 성공 콜백이 있으면 호출, 없으면 대시보드로 이동
              if (onLoginSuccess) {
                onLoginSuccess();
              } else {
                router.push("/dashboard/common/user/templates");
              }
              return;
            } else {
              setError("아이디 또는 비밀번호가 일치하지 않습니다.");
            }
          } else {
            setError("사용자 정보를 찾을 수 없습니다.");
          }
        } catch (localErr) {
          console.error("로컬 인증 오류:", localErr);
          setError("로그인 처리 중 오류가 발생했습니다.");
        }
      } else if (err.response) {
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
