"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginUser } from "../api/users";

export default function Login() {
  const [accountId, setAccountId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    // 간단한 유효성 검사
    if (!accountId || !password) {
      setError("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      // API 함수 호출하여 로그인 시도
      const loginData = {
        user_id: accountId,
        password: password
      };
      
      const user = await loginUser(loginData);
      
      if (!user) {
        setError("아이디 또는 비밀번호가 일치하지 않습니다.");
        return;
      }
      
      console.log("로그인 성공:", user);
      
      // 로그인 성공 시 대시보드로 이동
      // replace 옵션을 사용하여 히스토리 스택에 현재 페이지를 남기지 않음
      router.replace("/dashboard/common/user/templates");
    } catch (err) {
      console.error("로그인 오류:", err);
      setError("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
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
            disabled={loading}
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
            disabled={loading}
          />
        </div>
        <button
          onClick={handleLogin}
          className={`w-full bg-black text-white py-2 rounded mt-4 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? '로그인 중...' : 'SIGN IN'}
        </button>
        <Link href="/account/guest/templates/create_guest">
          <button className="w-full border py-2 rounded mt-2" disabled={loading}>Account Created</button>
        </Link>
        <div className="flex justify-between text-sm mt-4">
          <a href="#" className="text-gray-500">Forgot ID?</a>
          <a href="#" className="text-gray-500">Forgot Password?</a>
        </div>
      </div>
    </div>
  );
}
