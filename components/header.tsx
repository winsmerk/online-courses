import Link from "next/link";
import { getViewer } from "@/lib/viewer";

export async function Header({ dark = true }: { dark?: boolean }) {
  const viewer = await getViewer();

  return (
    <header
      className="shell site-header"
      style={{ color: dark ? "white" : "var(--ink)" }}
    >
      <Link href="/" className="logo" aria-label="知序课堂首页">
        <span className="logo-mark">知</span>
        <span>知序课堂</span>
      </Link>
      <nav className="nav" aria-label="主导航">
        <Link href="/courses">全部课程</Link>
        <Link href="/#method">学习方式</Link>
        <Link href="/enroll">微信报名</Link>
        {viewer ? (
          <Link className="nav-cta" href="/dashboard">
            {viewer.role === "admin" ? "管理中心" : "我的学习"}
          </Link>
        ) : (
          <Link className="nav-cta" href="/login">
            登录
          </Link>
        )}
      </nav>
    </header>
  );
}
