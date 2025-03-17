"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createUser } from "../../../../api/users";

export default function CreateGuest() {
  const [formData, setFormData] = useState({
    user_id: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    // 기본 유효성 검사
    if (!formData.user_id || !formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("모든 필드를 입력해주세요.");
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    
    if (formData.password.length < 6) {
      setError("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }
    
    try {
      setLoading(true);
      
      // API 함수 호출
      const userData = {
        user_id: formData.user_id,
        name: formData.name,
        email: formData.email,
        password: formData.password
      };
      
      const result = await createUser(userData);
      
      if (!result) {
        throw new Error("회원가입에 실패했습니다.");
      }
      
      setSuccess("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
      
      // 3초 후 로그인 페이지로 이동
      setTimeout(() => {
        router.push("/login");
      }, 3000);
      
    } catch (err) {
      console.error("회원가입 오류:", err);
      setError("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center">天 재무 시스템</h2>
        <h3 className="text-xl text-center mt-2 mb-4">회원가입</h3>
        
        {error && (
          <div className="mt-4 p-2 bg-red-100 text-red-600 rounded text-sm">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mt-4 p-2 bg-green-100 text-green-600 rounded text-sm">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <label className="block text-sm font-medium">사용자 ID</label>
            <input
              type="text"
              name="user_id"
              placeholder="사용할 ID를 입력하세요"
              value={formData.user_id}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
              disabled={loading}
            />
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium">이름</label>
            <input
              type="text"
              name="name"
              placeholder="이름을 입력하세요"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
              disabled={loading}
            />
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium">이메일</label>
            <input
              type="email"
              name="email"
              placeholder="이메일을 입력하세요"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
              disabled={loading}
            />
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium">비밀번호</label>
            <input
              type="password"
              name="password"
              placeholder="비밀번호를 입력하세요"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
              disabled={loading}
            />
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium">비밀번호 확인</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="비밀번호를 다시 입력하세요"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
              disabled={loading}
            />
          </div>
          
          <button
            type="submit"
            className={`w-full bg-black text-white py-2 rounded mt-6 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? '처리 중...' : '회원가입'}
          </button>
          
          <div className="text-center mt-4">
            <Link href="/login" className="text-sm text-indigo-600 hover:text-indigo-800">
              이미 계정이 있으신가요? 로그인하기
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
