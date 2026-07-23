import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { getServerI18n } from "@/lib/i18n-server";

export async function Footer() {
  const { t } = await getServerI18n();

  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-grid">
          <div>
            <Link href="/" className="brand-logo-link" aria-label="Beyond Wild">
              <BrandLogo />
            </Link>
            <p>{t("把真实经验整理成清晰方法，让每一次学习都能沉淀为长期能力。")}</p>
          </div>
          <div className="footer-links">
            <Link href="/#courses">{t("全部课程")}</Link>
            <Link href="/dashboard">{t("我的学习")}</Link>
            <Link href="/#enroll">{t("报名方式")}</Link>
            <Link href="/login">{t("账号登录")}</Link>
          </div>
        </div>
        <div className="footer-bottom">
          © {new Date().getFullYear()} Beyond Wild · {t("保留所有权利")}
        </div>
      </div>
    </footer>
  );
}
