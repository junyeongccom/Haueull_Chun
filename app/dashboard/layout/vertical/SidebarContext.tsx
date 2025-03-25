"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface SidebarContextType {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  // 기본값은 false로 설정하여 사이드바가 닫혀있도록 함
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 화면 크기 변경 시 사이드바 상태 조정 (모든 화면 크기에서 기본적으로 닫혀있음)
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(false);
    };

    // 초기 로드 시 실행
    handleResize();

    // 화면 크기 변경 시 이벤트 리스너 등록
    window.addEventListener('resize', handleResize);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = (): SidebarContextType => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}; 