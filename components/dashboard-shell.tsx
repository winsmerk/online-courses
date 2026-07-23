import Link from "next/link";
import { BookOpen, Home, LogOut, Settings, Upload } from "lucide-react";
import type { ReactNode } from "react";
import type { Viewer } from "@/lib/types";
import { signOut } from "@/app/actions/auth";

export function DashboardShell({
  viewer,
  active,
  children,
}: {
  viewer: Viewer;
  active: "learning" | "admin";
  children: ReactNode;
}) {
  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <Link href="/" className="logo">
          <span className="logo-mark">知</span>
          <span>知序课堂</span>
        </Link>
        <nav className="sidebar-nav" aria-label="学员中心导航">
          <Link href="/" title="返回首页">
            <Home size={16} /> 首页
          </Link>
          <Link
            href="/dashboard"
            className={active === "learning" ? "active" : ""}
          >
            <BookOpen size={16} /> 我的学习
          </Link>
          {viewer.role === "admin" && (
            <Link
              href="/admin"
              className={active === "admin" ? "active" : ""}
            >
              <Upload size={16} /> 课程管理
            </Link>
          )}
          <Link href="/dashboard" title="账号设置">
            <Settings size={16} /> 账号设置
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              style={{
                border: 0,
                background: "transparent",
                color: "#aab1c9",
                padding: "13px 14px",
                cursor: "pointer",
                display: "flex",
                gap: 8,
              }}
            >
              <LogOut size={16} /> 退出登录
            </button>
          </form>
        </nav>
      </aside>
      <main className="dashboard-main">{children}</main>
    </div>
  );
}
