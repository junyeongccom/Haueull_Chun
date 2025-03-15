"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [accountId, setAccountId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    // 간단한 유효성 검사
    if (!accountId || !password) {
      setError("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }

    // 실제 환경에서는 API 호출을 통해 인증을 처리해야 합니다.
    // 여기서는 간단한 예시로 아이디와 비밀번호가 모두 입력되면 로그인 성공으로 간주합니다.
    console.log("Logging in with:", accountId, password);
    
    // 로그인 성공 시 대시보드로 이동
    router.push("/dashboard");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center">天 재무 시스템</h2>
        {error && (
          <div className="mt-4 p-2 bg-red-100 text-red-600 rounded text-sm">
            {error}
          </div>
        )}
        <div className="mt-4">
          <label className="block text-sm font-medium">Account ID</label>
          <input
            type="text"
            placeholder="Enter your ID"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            className="w-full p-2 border rounded mt-1"
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium">Account Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded mt-1"
          />
        </div>
        <button
          onClick={handleLogin}
          className="w-full bg-black text-white py-2 rounded mt-4"
        >
          SIGN IN
        </button>
        <button className="w-full border py-2 rounded mt-2">Account Created</button>
        <div className="flex justify-between text-sm mt-4">
          <a href="#" className="text-gray-500">Forgot ID?</a>
          <a href="#" className="text-gray-500">Forgot Password?</a>
        </div>
      </div>
    </div>
  );
}
