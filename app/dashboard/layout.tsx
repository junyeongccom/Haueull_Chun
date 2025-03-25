"use client";
import React from "react";
import Sidebar from "./layout/vertical/sidebar/Sidebar";
import Header from "./layout/vertical/header/Header";
import { SidebarProvider, useSidebar } from "./layout/vertical/SidebarContext";

const DashboardContent = ({ children }: { children: React.ReactNode }) => {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  
  return (
    <div className="flex w-full min-h-screen bg-gray-50 font-pretendard">
      {/* 모바일에서 사이드바가 열렸을 때 배경 오버레이 */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10" 
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
      
      <div className="page-wrapper flex w-full">
        {/* 사이드바 */}
        <Sidebar />
        <div className={`body-wrapper w-full transition-all duration-300 ${isSidebarOpen ? 'ml-64' : ''}`}>
          <Header />
          {/* 본문 내용 */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  );
} 