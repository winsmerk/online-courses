"use client";

import Link from "next/link";
import { BookOpen, Home, LogOut, Settings, Upload, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/logout-button";

export function DashboardNav({ role }: { role: "student" | "admin" }) {
  const pathname = usePathname();

  return (
    <nav className="sidebar-nav" aria-label="学员中心导航">
      <Link href="/" title="返回首页" prefetch>
        <Home size={16} /> 首页
      </Link>
      <Link
        href="/dashboard"
        prefetch
        className={pathname === "/dashboard" ? "active" : ""}
      >
        <BookOpen size={16} /> 我的学习
      </Link>
      {role === "admin" && (
        <>
          <Link
            href="/admin"
            prefetch
            className={
              pathname === "/admin" || pathname.startsWith("/admin/courses")
                ? "active"
                : ""
            }
          >
            <Upload size={16} /> 课程管理
          </Link>
          <Link
            href="/admin/users"
            prefetch
            className={pathname.startsWith("/admin/users") ? "active" : ""}
          >
            <Users size={16} /> 账号管理
          </Link>
        </>
      )}
      <Link
        href="/settings"
        prefetch
        className={pathname === "/settings" ? "active" : ""}
        title="账号设置"
      >
        <Settings size={16} /> 账号设置
      </Link>
      <LogoutButton icon={<LogOut size={16} />} />
    </nav>
  );
}
