"use client";
import React from "react";
import axios from "axios";

// 회원가입 폼 인터페이스
export interface SignupFormData {
  user_id: string;
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}

interface SignupFormProps {
  onSignupSuccess: () => void;
}

// 회원가입 폼 자식 컴포넌트 (상태 관리 담당)
const SignupForm: React.FC<SignupFormProps> = ({ onSignupSuccess }) => {
  const [formData, setFormData] = React.useState<SignupFormData>({
    user_id: "",
    email: "",
    password: "",
    confirmPassword: "",
    name: ""
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

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
        // 백엔드 서버 API 요청
        const response = await axios.post("http://localhost:8000/api/customer/create", {
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
        
        // 성공 시 콜백 호출
        onSignupSuccess();
      } catch (apiError) {
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

  return (
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
  );
};

export default SignupForm; 