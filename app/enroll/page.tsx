import Link from "next/link";
import { CheckCircle2, MessageCircle, UserCheck } from "lucide-react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { getServerI18n } from "@/lib/i18n-server";

export default async function EnrollPage() {
  const { t } = await getServerI18n();
  return (
    <>
      <div style={{ background: "var(--ink)", color: "white" }}>
        <Header />
      </div>
      <section className="page-hero">
        <div className="shell">
          <p className="eyebrow" style={{ color: "var(--blue)" }}>
            Enrollment
          </p>
          <h1>{t("添加官方微信，确认课程并开通账号。")}</h1>
          <p>{t("目前采用人工报名方式。添加微信时请备注“课程报名”，我们会协助你选择课程并完成账号开通。")}</p>
        </div>
      </section>
      <main className="section">
        <div
          className="shell"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(260px, 380px)",
            gap: 70,
            alignItems: "start",
          }}
        >
          <div>
            <p className="eyebrow">Three steps</p>
            <div className="feature-grid" style={{ gridTemplateColumns: "1fr" }}>
              {[
                [
                  <MessageCircle key="a" size={21} />,
                  t("添加官方微信"),
                  t("扫描右侧二维码，添加时备注“课程报名”。"),
                ],
                [
                  <UserCheck key="b" size={21} />,
                  t("确认课程与身份"),
                  t("告诉我们你想学习的课程，客服会确认报名信息。"),
                ],
                [
                  <CheckCircle2 key="c" size={21} />,
                  t("收到账号开始学习"),
                  t("账号开通后即可登录，课程会自动出现在学员中心。"),
                ],
              ].map(([icon, title, text], index) => (
                <article
                  className="feature"
                  style={{ minHeight: 0, padding: 28 }}
                  key={String(title)}
                >
                  <span className="feature-number">{icon}</span>
                  <h3 style={{ marginTop: 24 }}>
                    {index + 1}. {title}
                  </h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
          <aside
            style={{
              padding: 28,
              borderRadius: 24,
              background: "white",
              boxShadow: "0 20px 70px rgba(25,31,75,.1)",
            }}
          >
            <div className="qr-placeholder">{t("替换为官方微信二维码")}</div>
            <h2
              style={{
                margin: "24px 0 10px",
                fontFamily: "var(--font-serif)",
              }}
            >
              {t("官方微信")}：ZHIXU-ACADEMY
            </h2>
            <p style={{ color: "#6b7188", lineHeight: 1.8, fontSize: 13 }}>
              {t("服务时间：周一至周五 10:00–18:00")}
            </p>
            <Link className="button dark" href="/login" style={{ width: "100%" }}>
              {t("已有账号，直接登录")}
            </Link>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
