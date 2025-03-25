"use client";
import React from "react";
import Link from "next/link";
import { useLoginForm } from "../../../../../hooks/account/auth/login/useLoginForm";

interface LoginFormComponentProps {
  onLoginSuccess?: () => void;
}

const LoginFormComponent: React.FC<LoginFormComponentProps> = ({ onLoginSuccess }) => {
  const { credentials, loading, error, handleChange, handleLogin } = useLoginForm({
    onLoginSuccess
  });

  return (
    <>
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
      <Link href="/account/auth/user/signup" className="w-full">
        <button className="w-full border py-2 rounded mt-2" disabled={loading}>Account Created</button>
      </Link>
      <div className="flex justify-between text-sm mt-4">
        <a href="#" className="text-gray-500">Forgot ID?</a>
        <a href="#" className="text-gray-500">Forgot Password?</a>
      </div>
    </>
  );
};

export default LoginFormComponent;
