// 컨테이너 > 컴포넌트(입력 ui+버튼) > 커스텀 훅(상태 관리+로그인 로직) > handleLogin()
// 버튼 누르면 훅 안의 handleLogin() 실행되고, 이 함수 안에서 백엔드로 요청 보내고 응답 처리까지
// 응답 처리 후 훅 안의 상태 변경되고, 이 상태가 변경되면 컴포넌트에서 그 상태를 반영해서 화면에 보여줌
// 로그인 컴포넌트 불러와서 화면에 보여줌

"use client";
import React from "react";
import LoginFormComponent from "@/components/account/auth/user/login/LoginFormComponent";

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center">天 재무 시스템</h2>
        <LoginFormComponent />
      </div>
    </div>
  );
}

