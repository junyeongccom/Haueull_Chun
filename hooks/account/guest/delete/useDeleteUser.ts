"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

// 사용자 인터페이스
export interface User {
  user_id: string;
  email: string;
  name: string;
  created_at?: string;
}

interface UseDeleteUserReturn {
  loading: boolean;
  error: string | null;
  deleteUser: (userId: string) => Promise<void>;
}

export const useDeleteUser = (): UseDeleteUserReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const deleteUser = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.delete(`/auth/user/${userId}`);
      
      if (response.status === 200) {
        router.push("/dashboard/common/user/templates");
      } else {
        setError("사용자 삭제에 실패했습니다.");
      }
    } catch (err: any) {
      console.error("사용자 삭제 오류:", err);
      setError(err.response?.data?.message || "사용자 삭제 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    deleteUser
  };
}; 