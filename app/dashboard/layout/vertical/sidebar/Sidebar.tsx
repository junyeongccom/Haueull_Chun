"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSidebar } from "../SidebarContext";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  // 각 메뉴의 확장 상태를 관리하는 상태
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

  // 메뉴 확장/축소 토글 함수
  const toggleMenu = (menuTitle: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuTitle]: !prev[menuTitle]
    }));
  };

  const menuItems = [
    {
      title: "총괄 대시보드",
      href: "/dashboard/common/user/templates",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      title: "요약 재무정보",
      href: "/dashboard/typography",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      ),
    },
    {
      title: "연결 재무제표",
      href: "/dashboard/table",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      subMenus: [
        { title: "연결 재무상태표", href: "/dashboard/table/basic" },
        { title: "연결 포괄손익계산서", href: "/dashboard/table/data" },
        { title: "연결 자본변동표", href: "/dashboard/table/sortable" },
        { title: "연결 현금흐름표", href: "/dashboard/table/filterable" }
      ]
    },
    {
      title: "재무제표",
      href: "/dashboard/form",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      subMenus: [
        { title: "재무상태표", href: "/dashboard/form/inputs" },
        { title: "포괄손익계산서", href: "/dashboard/form/layouts" },
        { title: "자본변동표", href: "/dashboard/form/validation" },
        { title: "현금흐름표", href: "/dashboard/form/advanced" }
      ]
    },
    {
      title: "주석",
      href: "/dashboard/icons",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
      subMenus: [
        { title: "주석1", href: "/dashboard/icons/line" },
        { title: "주석2", href: "/dashboard/icons/solid" },
        { title: "주석3", href: "/dashboard/icons/brand" },
        { title: "주석4", href: "/dashboard/icons/custom" }
      ]
    },
  ];

  const authItems = [
    {
      title: "로그인",
      href: "/login",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        </svg>
      ),
    },
    {
      title: "회원가입",
      href: "/register",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
    },
  ];

  // 메뉴 항목 클릭 시 사이드바 닫기
  const handleMenuClick = (href: string) => {
    router.push(href);
    toggleSidebar(); // 사이드바 닫기
  };

  // 하위 메뉴 항목 클릭 시 처리
  const handleSubMenuClick = (href: string, e: React.MouseEvent) => {
    e.stopPropagation(); // 상위 메뉴 클릭 이벤트 전파 방지
    router.push(href);
    toggleSidebar(); // 사이드바 닫기
  };

  return (
    <div 
      className={`w-64 bg-white shadow-md h-screen fixed left-0 top-0 overflow-y-auto transition-transform duration-300 ease-in-out z-20 font-pretendard ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="p-4 border-b flex items-center">
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-bold text-indigo-600">天 재무시스템</span>
        </Link>
      </div>
      <div className="p-4">
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">홈</h2>
          <ul className="space-y-1">
            {menuItems.map((item, index) => (
              <li key={index} className="mb-1">
                <div
                  onClick={() => item.subMenus ? toggleMenu(item.title) : handleMenuClick(item.href)}
                  className={`flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                    pathname.startsWith(item.href)
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center">
                    <span className="mr-3">{item.icon}</span>
                    {item.title}
                  </div>
                  {/* 확장/축소 화살표 아이콘 (하위 메뉴가 있는 경우에만 표시) */}
                  {item.subMenus && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 transition-transform duration-200 ${
                        expandedMenus[item.title] ? "transform rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </div>
                
                {/* 하위 메뉴 */}
                {item.subMenus && expandedMenus[item.title] && (
                  <ul className="mt-1 ml-6 space-y-1">
                    {item.subMenus.map((subItem, subIndex) => (
                      <li key={subIndex}>
                        <a
                          href={subItem.href}
                          onClick={(e) => handleSubMenuClick(subItem.href, e)}
                          className={`block px-3 py-2 rounded-md text-sm font-medium ${
                            pathname === subItem.href
                              ? "text-indigo-600"
                              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                          }`}
                        >
                          {subItem.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">인증</h2>
          <ul className="space-y-1">
            {authItems.map((item, index) => (
              <li key={index}>
                <a
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleMenuClick(item.href);
                  }}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                    pathname === item.href
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 