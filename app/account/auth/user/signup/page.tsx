"use client";
import React from "react";
import Link from "next/link";
import SignupFormComponent from "@/app/components/account/guest/new/SignupFormComponent";

// 무상태 함수형 부모 컴포넌트
export default function CreateGuestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            계정 만들기
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            이미 계정이 있으신가요?{" "}
            <Link href="/account/auth/user/login" className="font-medium text-blue-600 hover:text-blue-500">
              로그인하기
            </Link>
          </p>
        </div>
        
        {/* 자식 컴포넌트에 모든 상태와 로직 위임 */} 
        <SignupFormComponent />
      </div>
    </div>
  );
}
