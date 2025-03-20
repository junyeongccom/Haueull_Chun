"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useSignupForm, SignupFormData } from "../../../../../hooks/account/guest/new/useSignupForm";

interface SignupFormComponentProps {
  onSignupSuccess?: () => void;
}

const SignupFormComponent: React.FC<SignupFormComponentProps> = ({ onSignupSuccess }) => {
  const router = useRouter();
  
  const handleSuccess = () => {
    if (onSignupSuccess) {
      onSignupSuccess();
    } else {
      alert("회원가입 성공!");
      router.push("/login");
    }
  };

  // Custom hook 사용
  const { formData, loading, error, handleChange, handleSubmit } = useSignupForm({ 
    onSignupSuccess: handleSuccess 
  });

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

export default SignupFormComponent; 