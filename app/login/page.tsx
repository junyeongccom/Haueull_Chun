"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

// 사용자 입력을 위한 인터페이스
interface LoginCredentials {
  accountId: string;
  password: string;
}

// 사용자 데이터를 위한 인터페이스
interface Member {
  user_id: string;
  email: string;
  name: string;
  password: string;
  created_at?: string;
}

//onChange={function(e){setAccountId(e.target.value)}}
export default function Login() {
  // 사용자 입력 상태
  const [credentials, setCredentials] = useState<LoginCredentials>({
    accountId: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
      
      // 모든 회원 데이터를 저장할 배열
      let allMembers: Member[] = [];
      
      // 1. 백엔드 서버에서 회원 데이터 가져오기
      try {
        const response = await axios.get("http://localhost:8000/api/customer/list", {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          timeout: 3000 // 3초 타임아웃
        });
        
        console.log("서버에서 가져온 회원 목록:", response.data);
        allMembers = [...response.data];
      } catch (apiError) {
        console.warn("백엔드 서버에서 회원 목록을 가져오지 못했습니다:", apiError);
      }
      
      // 2. 로컬 스토리지에서 회원 데이터 가져오기
      try {
        const localUsersStr = localStorage.getItem('localUsers');
        if (localUsersStr) {
          const localUsers = JSON.parse(localUsersStr);
          console.log("로컬 스토리지에서 가져온 회원 목록:", localUsers);
          
          // 로컬 스토리지 데이터를 allMembers에 추가
          allMembers = [...allMembers, ...localUsers];
        }
      } catch (localError) {
        console.warn("로컬 스토리지에서 회원 목록을 가져오지 못했습니다:", localError);
      }
      
      console.log("로그인에 사용할 전체 회원 목록:", allMembers);
      
      // 사용자 인증 확인 - 대소문자 구분 없이 비교
      const user = allMembers.find(
        (member: Member) => 
          member.user_id.toLowerCase() === credentials.accountId.toLowerCase() && 
          member.password === credentials.password
      );

      if (user) {
        // 로그인 성공
        console.log("로그인 성공:", user);
        
        // 세션 스토리지에 사용자 정보 저장
        sessionStorage.setItem("currentUser", JSON.stringify(user));
        
        // 대시보드로 이동
        router.push("/dashboard/common/user/templates");
      } else {
        // 로그인 실패
        setError("아이디 또는 비밀번호가 일치하지 않습니다.");
      }
    } catch (err: any) {
      console.error("로그인 오류:", err);
      // axios 에러 처리 개선
      if (err.response) {
        // 서버가 응답을 반환한 경우
        setError(`서버 오류: ${err.response.status} - ${err.response.data.message || '로그인 중 오류가 발생했습니다.'}`);
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

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center">天 재무 시스템</h2>
        {error && (
          <div className="mt-4 p-2 bg-red-100 text-red-600 rounded text-sm">
            {error}
          </div>
        )}
        <div className="mt-4">
          <label className="block text-sm font-medium">Account ID</label>
          <input
            type="text"
            name="accountId"
            placeholder="Enter your ID"
            value={credentials.accountId}
            onChange={handleChange}
            className="w-full p-2 border rounded mt-1"
            disabled={loading}
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium">Account Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={credentials.password}
            onChange={handleChange}
            className="w-full p-2 border rounded mt-1"
            disabled={loading}
          />
        </div>
        <button
          onClick={handleLogin}
          className={`w-full bg-black text-white py-2 rounded mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? "로그인 중..." : "SIGN IN"}
        </button>
        <Link href="/account/guest/new" className="w-full">
          <button className="w-full border py-2 rounded mt-2" disabled={loading}>Account Created</button>
        </Link>
        <div className="flex justify-between text-sm mt-4">
          <a href="#" className="text-gray-500">Forgot ID?</a>
          <a href="#" className="text-gray-500">Forgot Password?</a>
        </div>
      </div>
    </div>
  );
}
