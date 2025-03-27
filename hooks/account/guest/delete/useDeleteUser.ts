"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import React from "react";

// 사용자 인터페이스
export interface User {
  user_id: string;
  email: string;
  name: string;
  created_at?: string;
}

interface UseDeleteUserReturn {
  users: User[];
  loading: boolean;
  error: string | null;
  deleteUser: (userId: string) => Promise<boolean>;
  selectedUserId: string | null;
  setSelectedUserId: (userId: string | null) => void;
  showConfirmModal: boolean;
  setShowConfirmModal: (show: boolean) => void;
  refreshUsers: () => Promise<void>;
}

export const useDeleteUser = (): UseDeleteUserReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const router = useRouter();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/auth/users');
      setUsers(response.data.users);
    } catch (err: any) {
      console.error("사용자 목록 조회 오류:", err);
      setError(err.response?.data?.message || "사용자 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 사용자 목록 조회
  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (userId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.delete(`/auth/user/${userId}`);
      
      if (response.status === 200) {
        await fetchUsers(); // 사용자 목록 새로고침
        return true;
      } else {
        setError("사용자 삭제에 실패했습니다.");
        return false;
      }
    } catch (err: any) {
      console.error("사용자 삭제 오류:", err);
      setError(err.response?.data?.message || "사용자 삭제 중 오류가 발생했습니다.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    loading,
    error,
    deleteUser,
    selectedUserId,
    setSelectedUserId,
    showConfirmModal,
    setShowConfirmModal,
    refreshUsers: fetchUsers
  };
}; 