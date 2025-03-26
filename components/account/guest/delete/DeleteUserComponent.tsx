"use client";
import React from "react";
import { useDeleteUser, User } from "@/hooks/account/guest/delete/useDeleteUser";
import Link from "next/link";

// 삭제 확인 모달 컴포넌트
const ConfirmModal: React.FC<{
  onConfirm: () => void;
  onCancel: () => void;
  userName: string;
}> = ({ onConfirm, onCancel, userName }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h3 className="text-lg font-bold mb-4">회원 삭제 확인</h3>
        <p className="mb-6">
          <strong>{userName}</strong> 회원을 정말 삭제하시겠습니까?
          <br />
          이 작업은 되돌릴 수 없습니다.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};

// 회원 목록 테이블 행 컴포넌트
const UserTableRow: React.FC<{
  user: User;
  onDeleteClick: (userId: string, userName: string) => void;
}> = ({ user, onDeleteClick }) => {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="py-3 px-4">{user.user_id}</td>
      <td className="py-3 px-4">{user.name}</td>
      <td className="py-3 px-4">{user.email}</td>
      <td className="py-3 px-4 text-right">
        <button
          onClick={() => onDeleteClick(user.user_id, user.name)}
          className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200"
        >
          삭제
        </button>
      </td>
    </tr>
  );
};

// 메인 DeleteUserComponent
const DeleteUserComponent: React.FC = () => {
  // Custom hook 사용
  const {
    users,
    loading,
    error,
    deleteUser,
    selectedUserId,
    setSelectedUserId,
    showConfirmModal,
    setShowConfirmModal,
    refreshUsers
  } = useDeleteUser();

  // 삭제 버튼 클릭 핸들러
  const [selectedUserName, setSelectedUserName] = React.useState<string>("");
  
  const handleDeleteClick = (userId: string, userName: string) => {
    setSelectedUserId(userId);
    setSelectedUserName(userName);
    setShowConfirmModal(true);
  };

  // 실제 삭제 수행
  const handleConfirmDelete = async () => {
    if (selectedUserId) {
      const success = await deleteUser(selectedUserId);
      
      if (success) {
        // 성공 메시지 표시
        alert(`${selectedUserName} 회원이 성공적으로 삭제되었습니다.`);
      }
      
      setShowConfirmModal(false);
    }
  };

  // 삭제 취소
  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setSelectedUserId(null);
  };

  return (
    <div className="mt-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-6">
          <svg className="animate-spin h-8 w-8 mx-auto text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-2 text-gray-600">회원 목록을 불러오는 중...</p>
        </div>
      ) : (
        <>
          {users.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-500">등록된 회원이 없습니다.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-left">아이디</th>
                    <th className="py-3 px-4 text-left">이름</th>
                    <th className="py-3 px-4 text-left">이메일</th>
                    <th className="py-3 px-4 text-right">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <UserTableRow
                      key={user.user_id}
                      user={user}
                      onDeleteClick={handleDeleteClick}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      <div className="mt-6 flex justify-between">
        <button
          onClick={() => refreshUsers()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          새로고침
        </button>
        <Link href="/dashboard/common/user/templates">
          <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">
            대시보드로 돌아가기
          </button>
        </Link>
      </div>

      {/* 삭제 확인 모달 */}
      {showConfirmModal && selectedUserId && (
        <ConfirmModal
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          userName={selectedUserName}
        />
      )}
    </div>
  );
};

export default DeleteUserComponent; 