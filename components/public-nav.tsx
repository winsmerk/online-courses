"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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
  const [activeSection, setActiveSection] = useState("");
  const loginActive = pathname === "/login";

  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection("");
      return;
    }

    const sections = ["courses", "enroll"]
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0.05, 0.25, 0.5] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <nav className="nav" aria-label="主导航">
      <Link
        className={activeClass(activeSection === "courses", "nav-link")}
        aria-current={activeSection === "courses" ? "location" : undefined}
        href="/#courses"
        prefetch
        onClick={() => setActiveSection("courses")}
      >
        全部课程
      </Link>
      <Link
        className={activeClass(activeSection === "enroll", "nav-link")}
        aria-current={activeSection === "enroll" ? "location" : undefined}
        href="/#enroll"
        prefetch
        onClick={() => setActiveSection("enroll")}
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
