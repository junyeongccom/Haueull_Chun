"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useSidebar } from "../SidebarContext";

// 알림 데이터 타입 정의
interface Notification {
  id: number;
  message: string;
  time: string;
  isRead: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
}

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { toggleSidebar } = useSidebar();

  // 샘플 알림 데이터
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      message: "재무제표 업데이트가 완료되었습니다.",
      time: "방금 전",
      isRead: false,
      type: 'success'
    },
    {
      id: 2,
      message: "새로운 회계 기준이 적용되었습니다.",
      time: "10분 전",
      isRead: false,
      type: 'info'
    },
    {
      id: 3,
      message: "결산 마감 기한이 3일 남았습니다.",
      time: "1시간 전",
      isRead: false,
      type: 'warning'
    },
    {
      id: 4,
      message: "감사 보고서 검토가 필요합니다.",
      time: "3시간 전",
      isRead: true,
      type: 'error'
    }
  ]);

  // 읽지 않은 알림 개수 계산
  const unreadCount = notifications.filter(notification => !notification.isRead).length;

  // 알림 읽음 처리 함수
  const markAsRead = (id: number) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  // 모든 알림 읽음 처리 함수
  const markAllAsRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification => ({ ...notification, isRead: true }))
    );
  };

  // 알림 타입에 따른 아이콘 색상 반환 함수
  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'info': return 'bg-blue-500';
      case 'warning': return 'bg-yellow-500';
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <header className="bg-white shadow-sm h-16 flex items-center px-6 w-full font-pretendard">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="text-gray-500 hover:text-gray-700 mr-4"
          aria-label="Toggle sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="검색..."
            className="w-64 pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
      <div className="flex-1"></div>
      <div className="flex items-center space-x-4">
        {/* 알림 버튼 */}
        <div className="relative">
          <button 
            className="text-gray-500 hover:text-gray-700 relative"
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            aria-label="Notifications"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">
                {unreadCount}
              </span>
            )}
          </button>
          
          {/* 알림 드롭다운 */}
          {isNotificationOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-10">
              <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-sm font-semibold text-gray-700">알림</h3>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-xs text-indigo-600 hover:text-indigo-800"
                  >
                    모두 읽음 표시
                  </button>
                )}
              </div>
              
              <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 ${!notification.isRead ? 'bg-blue-50' : ''}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start">
                        <div className={`w-2 h-2 mt-1.5 rounded-full ${getNotificationColor(notification.type)} mr-2`}></div>
                        <div className="flex-1">
                          <p className={`text-sm ${!notification.isRead ? 'font-medium' : 'text-gray-600'}`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center text-gray-500">
                    알림이 없습니다.
                  </div>
                )}
              </div>
              
              <div className="px-4 py-2 border-t border-gray-100">
                <Link href="/dashboard/notifications" className="block text-center text-xs text-indigo-600 hover:text-indigo-800">
                  모든 알림 보기
                </Link>
              </div>
            </div>
          )}
        </div>
        
        {/* 사용자 프로필 드롭다운 */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold">
              JC
            </div>
            <span className="text-sm font-medium hidden md:inline-block">사용자</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <Link href="/dashboard/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                프로필
              </Link>
              <Link href="/dashboard/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                설정
              </Link>
              <div className="border-t border-gray-100 my-1"></div>
              <Link href="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                로그아웃
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 