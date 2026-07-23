import Link from "next/link";
import { signIn } from "@/app/actions/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;

  return (
    <main className="auth-page">
      <section className="auth-brand">
        <Link href="/" className="logo">
          <span className="logo-mark">B</span>
          <span>Beyond Wild</span>
        </Link>
        <h1>继续学习，让每一步都有积累。</h1>
        <p style={{ color: "#8f97b0" }}>系统课程 · 随时回看 · 自动保存进度</p>
      </section>
      <section className="auth-panel">
        <form className="auth-card" action={signIn}>
          <p className="eyebrow">Welcome back</p>
          <h2>登录学习账号</h2>
          <p>请输入管理员为你开通的邮箱和密码。</p>
          {error && <div className="form-error">{error}</div>}
          <input type="hidden" name="next" value={next ?? "/dashboard"} />
          <div className="field">
            <label htmlFor="email">邮箱</label>
            <input
              className="input"
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="password">密码</label>
            <input
              className="input"
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="输入密码"
              required
            />
          </div>
          <button className="button dark" type="submit">
            {isSupabaseConfigured ? "登录" : "进入演示账号"}
          </button>
          <p className="form-help">
            还没有账号？请前往
            <Link href="/enroll" style={{ color: "#1677c8" }}>
              {" "}
              微信报名页面
            </Link>
            ，由管理员确认后开通。
          </p>
        </form>
      </section>
    </main>
  );
}
