"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function activeClass(active: boolean, extra = "") {
  return `${extra} ${active ? "active" : ""}`.trim();
}

export function PublicNav({
  signedIn,
  isAdmin,
}: {
  signedIn: boolean;
  isAdmin: boolean;
}) {
  const pathname = usePathname();
  const coursesActive = pathname.startsWith("/courses");
  const enrollActive = pathname === "/enroll";
  const loginActive = pathname === "/login";

  return (
    <nav className="nav" aria-label="主导航">
      <Link
        className={activeClass(coursesActive, "nav-link")}
        aria-current={coursesActive ? "page" : undefined}
        href="/courses"
        prefetch
      >
        全部课程
      </Link>
      <Link className="nav-link" href="/#method">
        学习方式
      </Link>
      <Link
        className={activeClass(enrollActive, "nav-link")}
        aria-current={enrollActive ? "page" : undefined}
        href="/enroll"
        prefetch
      >
        微信报名
      </Link>
      {signedIn ? (
        <Link className="nav-cta" href="/dashboard" prefetch>
          {isAdmin ? "管理中心" : "我的学习"}
        </Link>
      ) : (
        <Link
          className={activeClass(loginActive, "nav-cta")}
          aria-current={loginActive ? "page" : undefined}
          href="/login"
          prefetch
        >
          登录
        </Link>
      )}
    </nav>
  );
}
