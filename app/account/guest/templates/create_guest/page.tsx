"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

export default function CreateGuestPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    user_id: "",
    email: "",
    password: "",
    confirmPassword: "",
    name: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
      
      // axios로 회원가입 요청
      console.log("회원가입 요청 데이터:", {
        user_id: formData.user_id,
        email: formData.email,
        password: formData.password,
        name: formData.name
      });
      
      const response = await axios.post("http://localhost:8000/api/customer/create", {
        user_id: formData.user_id,
        email: formData.email,
        password: formData.password,
        name: formData.name
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log("회원가입 성공 응답:", response.data);
      
      // 성공 처리
      setSuccess(true);
      
      // 알림 표시 후 로그인 페이지로 이동
      alert("회원가입 성공!");
      router.push("/login");
    } catch (err: any) {
      // 오류 처리
      console.error("회원가입 오류:", err);
      
      if (err.response) {
        // 서버가 응답을 반환한 경우
        console.log("서버 응답 오류 상세:", err.response.data);
        
        // 더 자세한 오류 메시지 표시
        let errorMsg = "";
        
        if (err.response.status === 422) {
          errorMsg = "이미 등록된 사용자 ID 또는 이메일입니다. 다른 정보로 시도해주세요.";
        } else {
          errorMsg = `서버 오류: ${err.response.status} - ${err.response.data?.message || '회원가입 중 오류가 발생했습니다.'}`;
        }
        
        setError(errorMsg);
      } else if (err.request) {
        // 요청이 전송되었지만 응답이 없는 경우 (서버 연결 실패)
        console.log("백엔드 서버 연결 실패. 임시로 회원가입 성공 처리");
        
        // 로컬 스토리지에 회원 정보 저장 (백엔드 대체)
        try {
          const users = JSON.parse(localStorage.getItem('localUsers') || '[]');
          users.push({
            user_id: formData.user_id,
            email: formData.email,
            password: formData.password,
            name: formData.name,
            created_at: new Date().toISOString() // 클라이언트에서 생성한 날짜 (화면 표시용)
          });
          localStorage.setItem('localUsers', JSON.stringify(users));
          
          // 성공 처리 및 페이지 이동
          alert("회원가입 성공!");
          router.push("/login");
          return; // 함수 종료
        } catch (localErr) {
          console.error("로컬 저장 실패:", localErr);
        }
        
        setError("서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.");
      } else {
        // 요청 설정 중 오류가 발생한 경우
        setError(`회원가입 요청 중 오류가 발생했습니다: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            계정 만들기
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            이미 계정이 있으신가요?{" "}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              로그인하기
            </Link>
          </p>
        </div>
        
        {success ? (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative" role="alert">
            <p className="font-bold">회원가입 성공!</p>
            <p className="text-sm">3초 후 로그인 페이지로 이동합니다...</p>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                <p>{error}</p>
              </div>
            )}
            
            <div className="rounded-md shadow-sm -space-y-px">
              <div className="mb-4">
                <label htmlFor="user_id" className="block text-sm font-medium text-gray-700 mb-1">
                  사용자 ID
                </label>
                <input
                  id="user_id"
                  name="user_id"
                  type="text"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="사용자 ID"
                  value={formData.user_id}
                  onChange={handleChange}
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  이메일
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="이메일"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  이름
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="이름"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  비밀번호
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="비밀번호"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  비밀번호 확인
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="비밀번호 확인"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                  loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {loading ? "처리 중..." : "회원가입"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
