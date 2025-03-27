"use client";
import React from "react";
import UserList from "@/components/dashboard/UserList";

// 서버 컴포넌트
export default function UserTemplatesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">회원 관리</h1>
      <UserList />
    </div>
  );
} 