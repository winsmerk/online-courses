"use client";

import Link from "next/link";
import {
  BookOpen,
  GraduationCap,
  Home,
  LogOut,
  Settings,
  ShieldCheck,
  Upload,
} from "lucide-react";
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
        aria-current={pathname === "/dashboard" ? "page" : undefined}
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
            aria-current={
              pathname === "/admin" || pathname.startsWith("/admin/courses")
                ? "page"
                : undefined
            }
          >
            <Upload size={16} /> 课程管理
          </Link>
          <Link
            href="/admin/students"
            prefetch
            className={pathname.startsWith("/admin/students") ? "active" : ""}
            aria-current={
              pathname.startsWith("/admin/students") ? "page" : undefined
            }
          >
            <GraduationCap size={16} /> 学员管理
          </Link>
          <Link
            href="/admin/users"
            prefetch
            className={pathname.startsWith("/admin/users") ? "active" : ""}
            aria-current={
              pathname.startsWith("/admin/users") ? "page" : undefined
            }
          >
            <ShieldCheck size={16} /> 管理员账号
          </Link>
        </>
      )}
      <Link
        href="/settings"
        prefetch
        className={pathname === "/settings" ? "active" : ""}
        aria-current={pathname === "/settings" ? "page" : undefined}
        title="账号设置"
      >
        <Settings size={16} /> 账号设置
      </Link>
      <LogoutButton icon={<LogOut size={16} />} />
    </nav>
  );
}
