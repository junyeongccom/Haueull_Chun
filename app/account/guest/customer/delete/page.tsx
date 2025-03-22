"use client";
import React from "react";
import DeleteUserComponent from "@/app/components/account/guest/new/DeleteUserComponent";

// 회원 삭제 페이지 - 부모 컴포넌트 (무상태)
export default function DeleteUserPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            회원 삭제
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            삭제할 회원 정보를 선택하세요
          </p>
        </div>
        
        {/* 자식 컴포넌트에 모든 상태와 로직 위임 */} 
        <DeleteUserComponent />
      </div>
    </div>
  );
}
