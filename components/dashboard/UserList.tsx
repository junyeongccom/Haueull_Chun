"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

// 사용자 인터페이스
interface User {
  user_id: string;
  email: string;
  name: string;
  password: string;
  created_at?: string;
}

// 사용자 목록 클라이언트 컴포넌트
export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const router = useRouter();

  // 사용자 목록 가져오기
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get("/auth/user/list");
      setUsers(response.data.users);
    } catch (err) {
      console.error("사용자 목록 조회 실패:", err);
      setError("사용자 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 사용자 삭제 함수
  const deleteUser = async (userId: string) => {
    try {
      setLoading(true);
      
      // 1. 백엔드 API 호출
      try {
        await api.post("/api/account/customer/delete", { user_id: userId }, {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          }
        });
        
        console.log("서버에서 회원 삭제 성공");
      } catch (apiError) {
        console.warn("서버에서 회원 삭제 실패:", apiError);
        
        // 2. 로컬 스토리지에서 삭제 시도
        const localUsersStr = localStorage.getItem('localUsers');
        if (localUsersStr) {
          let localUsers = JSON.parse(localUsersStr);
          const userIndex = localUsers.findIndex((user: User) => user.user_id === userId);
          
          if (userIndex !== -1) {
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
      setSelectedUser(null);
      setShowConfirmModal(false);
      
      // 성공 메시지
      alert("회원이 성공적으로 삭제되었습니다.");
      
      // 목록 새로고침
      fetchUsers();
      
      return true;
    } catch (err) {
      console.error("회원 삭제 중 오류 발생:", err);
      setError("회원 삭제에 실패했습니다.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 삭제 버튼 클릭 핸들러
  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setShowConfirmModal(true);
  };
  
  // 삭제 확인
  const handleConfirmDelete = async () => {
    if (selectedUser) {
      await deleteUser(selectedUser.user_id);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserClick = (userId: string) => {
    router.push(`/account/guest/customer/${userId}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">사용자 목록</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <div
            key={user.user_id}
            className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleUserClick(user.user_id)}
          >
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-500">ID: {user.user_id}</p>
            {user.created_at && (
              <p className="text-sm text-gray-500">
                가입일: {new Date(user.created_at).toLocaleDateString()}
              </p>
            )}
          </div>
        ))}
      </div>
      
      {/* 삭제 확인 모달 */}
      {showConfirmModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">회원 삭제 확인</h3>
            <p className="mb-6">
              <strong>{selectedUser.name}</strong> ({selectedUser.user_id}) 회원을 정말 삭제하시겠습니까?
              <br />
              이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                취소
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 