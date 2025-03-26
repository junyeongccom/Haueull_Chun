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
