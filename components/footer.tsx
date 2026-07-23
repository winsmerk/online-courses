import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-grid">
          <div>
            <Link href="/" className="logo">
              <span className="logo-mark">B</span>
              <span>Beyond Wild</span>
            </Link>
            <p>
              把真实经验整理成清晰方法，让每一次学习都能沉淀为长期能力。
            </p>
          </div>
          <div className="footer-links">
            <Link href="/courses">全部课程</Link>
            <Link href="/dashboard">我的学习</Link>
            <Link href="/enroll">报名方式</Link>
            <Link href="/login">账号登录</Link>
          </div>
        </div>
        <div className="footer-bottom">
          © {new Date().getFullYear()} Beyond Wild · 保留所有权利
        </div>
      </div>
    </footer>
  );
}
