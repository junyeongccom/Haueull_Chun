"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

// 사용자 인터페이스
export interface User {
  user_id: string;
  email: string;
  name: string;
  created_at?: string;
}

// 커스텀 훅 반환 타입
interface UseDeleteUserReturn {
  users: User[];
  loading: boolean;
  error: string | null;
  deleteUser: (userId: string) => Promise<boolean>;
  selectedUserId: string | null;
  setSelectedUserId: (id: string | null) => void;
  showConfirmModal: boolean;
  setShowConfirmModal: (show: boolean) => void;
  refreshUsers: () => Promise<void>;
}

// 회원 삭제 기능을 위한 custom hook
export const useDeleteUser = (): UseDeleteUserReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const router = useRouter();

  // 모든 회원 목록 불러오기
  const fetchUsers = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // 저장된 모든 회원 데이터를 담을 배열
      let allUsers: User[] = [];
      
      // 1. 백엔드 API 호출 시도
      try {
        const response = await axios.get("http://localhost:8000/api/customer/list", {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          timeout: 3000 // 3초 타임아웃
        });
        
        console.log("서버에서 가져온 회원 목록:", response.data);
        allUsers = [...response.data];
      } catch (apiError) {
        console.warn("백엔드 서버에서 회원 목록을 가져오지 못했습니다:", apiError);
      }
      
      // 2. 로컬 스토리지에서 회원 데이터 불러오기
      try {
        const localUsersStr = localStorage.getItem('localUsers');
        if (localUsersStr) {
          const localUsers = JSON.parse(localUsersStr);
          console.log("로컬 스토리지에서 가져온 회원 목록:", localUsers);
          
          // 로컬 회원 데이터 추가
          allUsers = [...allUsers, ...localUsers];
        }
      } catch (localError) {
        console.warn("로컬 스토리지에서 회원 목록을 가져오지 못했습니다:", localError);
      }
      
      console.log("전체 회원 목록:", allUsers);
      setUsers(allUsers);
    } catch (err) {
      console.error("회원 목록 조회 중 오류 발생:", err);
      setError("회원 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 회원 삭제
  const deleteUser = async (userId: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // 1. 백엔드 API 호출 시도
      try {
        // Swagger API 경로에 맞게 수정 (/api/customer/delete)
        await axios.post(`http://localhost:8000/api/customer/delete`, { user_id: userId }, {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          timeout: 3000
        });
        console.log("서버에서 회원 삭제 성공");
      } catch (apiError) {
        // API 호출 실패 시 로컬 스토리지에서 삭제 시도
        console.warn("백엔드 서버에서 회원 삭제에 실패했습니다:", apiError);
        
        // 로컬 스토리지 회원 데이터 가져오기
        const localUsersStr = localStorage.getItem('localUsers');
        if (localUsersStr) {
          let localUsers = JSON.parse(localUsersStr);
          
          // 해당 회원 찾기
          const userIndex = localUsers.findIndex((user: User) => user.user_id === userId);
          
          if (userIndex !== -1) {
            // 회원 삭제
            localUsers.splice(userIndex, 1);
            localStorage.setItem('localUsers', JSON.stringify(localUsers));
            console.log("로컬 스토리지에서 회원 삭제 성공");
          } else {
            throw new Error("삭제할 회원을 찾을 수 없습니다.");
          }
        } else {
          throw new Error("로컬 저장소에 회원 데이터가 없습니다.");
        }
      }
      
      // UI 업데이트
      setUsers(users.filter(user => user.user_id !== userId));
      setSelectedUserId(null);
      
      return true;
    } catch (err) {
      console.error("회원 삭제 중 오류 발생:", err);
      setError("회원 삭제에 실패했습니다.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 회원 목록 불러오기
  useEffect(() => {
    fetchUsers();
  }, []);

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