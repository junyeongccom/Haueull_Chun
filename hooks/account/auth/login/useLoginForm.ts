"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";
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
  password: string;
  created_at?: string;
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
  const setAccessToken = useAuthStore(state => state.setAccessToken);

  // 백엔드 API 설정
  const BACKEND_URL = 'http://localhost:8000'; // FastAPI 서버 URL
  const LOGIN_API_PATH = '/api/customer/list'; // 올바른 API 경로

  // 로컬 스토리지 데이터 확인 (컴포넌트 마운트 시)
  useEffect(() => {
    try {
      const localUsers = localStorage.getItem('localUsers');
      console.log('로컬 스토리지 회원 데이터:', localUsers ? JSON.parse(localUsers) : '데이터 없음');
    } catch (err) {
      console.error('로컬 스토리지 읽기 오류:', err);
    }
  }, []);

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
      
      // 백엔드 API 호출 데이터 준비
      const loginData = {
        username: credentials.accountId,
        password: credentials.password
      };
      
      console.log("로그인 요청 데이터:", loginData);
      
      // 백엔드 로그인 API 직접 호출
      const response = await axios.post(`${BACKEND_URL}${LOGIN_API_PATH}`, loginData, {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      });
      
      console.log("로그인 응답:", response.data);

      const message = response.data.message;
      const logged_in_user = response.data.user;

      // zustand 저장
      if (logged_in_user) {
        useUserStore.getState().setUser({
          user_id: logged_in_user.user_id,
          email: logged_in_user.email,
          name: logged_in_user.name
        });
        console.log("사용자 정보가 store에 저장되었습니다.");
      }

      // 서버 응답 확인
      if (response.data && response.status === 200) {
        // 로그인 성공 처리
        // 세션 스토리지에 사용자 정보 저장
        sessionStorage.setItem("currentUser", JSON.stringify(response.data));
        
        console.log("로그인 성공!");
        
        // 로그인 성공 메시지를 보여주기 위한 지연
        setLoading(false); // 로딩 상태 해제
        
        // 지연 후 리다이렉트 처리
        setTimeout(() => {
          // 성공 콜백이 있으면 호출, 없으면 대시보드로 이동
          if (onLoginSuccess) {
            onLoginSuccess();
          } else {
            // 대시보드로 이동
            router.push("/dashboard/common/user/templates");
          }
        }, 1500); // 1.5초 지연
        
        // 함수 종료 (setLoading(false)를 두 번 호출하지 않도록)
        return;
      } else {
        // 예상치 못한 응답 형식
        setError("로그인 응답이 올바르지 않습니다.");
      }
    } catch (err: any) {
      console.error("로그인 오류:", err);
      
      // axios 에러 처리
      if (err.response) {
        // 서버가 응답을 반환한 경우 (예: 401 Unauthorized)
        if (err.response.status === 401) {
          setError("아이디 또는 비밀번호가 일치하지 않습니다.");
        } else if (err.response.status === 404) {
          setError("로그인 API를 찾을 수 없습니다.");
        } else {
          setError(`서버 오류: ${err.response.status} - ${err.response.data?.message || '로그인 중 오류가 발생했습니다.'}`);
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
