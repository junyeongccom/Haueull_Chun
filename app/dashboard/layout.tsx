"use client";
import React from "react";
import Sidebar from "./layout/vertical/sidebar/Sidebar";
import Header from "./layout/vertical/header/Header";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-full min-h-screen bg-gray-100">
      <div className="page-wrapper flex w-full">
        {/* 사이드바 */}
        <Sidebar />
        <div className="body-wrapper w-full">
          <Header />
          {/* 본문 내용 */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
} 