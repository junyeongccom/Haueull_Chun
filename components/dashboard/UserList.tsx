"use client";
import React, { useState, useEffect } from "react";
import api from "@/lib/axios";

// 사용자 인터페이스
interface User {
  user_id: string;
  email: string;
  name: string;
  created_at?: string;
}

// 사용자 목록 클라이언트 컴포넌트
const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // 사용자 목록 가져오기
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 백엔드 API 호출
      const response = await api.get("/api/account/customer/list");
      console.log("API 요청 URL:", "/api/account/customer/list");
      console.log("서버 응답 전체:", response);
      console.log("서버에서 가져온 회원 목록:", response.data);
      
      // API 응답 처리
      if (response.data && Array.isArray(response.data)) {
        console.log("회원 데이터 설정:", response.data);
        setUsers(response.data);
      } else if (response.data && Array.isArray(response.data.customers)) {
        console.log("customers 배열에서 회원 데이터 설정:", response.data.customers);
        setUsers(response.data.customers);
      } else {
        console.error("서버 응답 형식이 올바르지 않습니다:", response.data);
        setError("회원 목록을 불러오는데 실패했습니다.");
      }
    } catch (err: any) {
      console.error("회원 목록을 가져오는 중 오류 발생:", err);
      console.error("오류 상세 정보:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data
      });
      setError("회원 목록을 가져오는 중 오류가 발생했습니다.");
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
          const localUsers = JSON.parse(localUsersStr);
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

  // 컴포넌트 마운트 시와 새로고침 버튼 클릭 시 데이터 로드
  useEffect(() => {
    console.log("UserList 컴포넌트 마운트 - fetchUsers 호출");
    fetchUsers();
  }, []);
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md font-pretendard">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">회원 목록</h2>
        <button
          onClick={() => fetchUsers()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          새로고침
        </button>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center py-8">
          <svg className="animate-spin h-8 w-8 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">회원 ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이메일</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이름</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">가입일</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">관리</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.user_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString('ko-KR') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <button
                        onClick={() => handleDeleteClick(user)}
                        className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    회원 데이터가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      
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
};

export default UserList; 