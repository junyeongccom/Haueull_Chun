"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/axios";

interface User {
  user_id: string;
  email: string;
  name: string;
  created_at?: string;
}

export default function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`/auth/user/${id}`);
        setUser(response.data.user);
      } catch (err) {
        console.error("사용자 정보 조회 실패:", err);
        setError("사용자 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>사용자를 찾을 수 없습니다.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">사용자 상세 정보</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">이름</h2>
          <p>{user.name}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">이메일</h2>
          <p>{user.email}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">사용자 ID</h2>
          <p>{user.user_id}</p>
        </div>
        {user.created_at && (
          <div>
            <h2 className="text-lg font-semibold">가입일</h2>
            <p>{new Date(user.created_at).toLocaleDateString()}</p>
          </div>
        )}
      </div>
    </div>
  );
}
