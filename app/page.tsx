import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { CourseCard } from "@/components/course-card";
import { DemoBanner } from "@/components/demo-banner";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { getCourses } from "@/lib/data";
import { getServerI18n } from "@/lib/i18n-server";

export default async function HomePage() {
  const courses = await getCourses();
  const { t } = await getServerI18n();

  return (
    <>
      <DemoBanner />
      <section className="hero">
        <Header />
        <div className="shell hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">A school for practical wisdom</p>
            <h1>{t("把经验变成方法，把学习变成能力。")}</h1>
            <p>{t("与真正做过、想清楚、讲明白的人一起学习。用系统课程跨过试错，建立属于自己的专业路径。")}</p>
            <div className="hero-actions">
              <Link className="button" href="#courses">
                {t("探索课程")} <ArrowRight size={17} />
              </Link>
              <Link className="button secondary" href="#enroll">
                {t("添加微信报名")}
              </Link>
            </div>
          </div>
          <div className="hero-collage" aria-label={t("讲师与课程")}>
            <div className="portrait-card card-a">
              <Image
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=85"
                alt={t("品牌策略讲师")}
                width={260}
                height={316}
              />
              <div>
                <strong>{t("把专业沉淀成长期影响力")}</strong>
                <small>林知遥 · {t("品牌策略")}</small>
              </div>
            </div>
            <div className="portrait-card card-b">
              <Image
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=85"
                alt={t("AI 效率讲师")}
                width={260}
                height={316}
              />
              <div>
                <strong>{t("让 AI 成为可靠的工作伙伴")}</strong>
                <small>周原 · {t("AI 工作流")}</small>
              </div>
            </div>
            <div className="portrait-card card-c">
              <Image
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=85"
                alt={t("沟通表达讲师")}
                width={260}
                height={316}
              />
              <div>
                <strong>{t("把复杂的想法讲得清楚")}</strong>
                <small>沈南 · {t("沟通表达")}</small>
              </div>
            </div>
          </div>
        </div>
        <div className="shell trust-strip">
          <p>{t("专注可以被实践、验证与复用的知识")}</p>
          <div className="trust-item">
            <strong>{t("系统")}</strong>
            <span>{t("不堆砌碎片知识")}</span>
          </div>
          <div className="trust-item">
            <strong>{t("实战")}</strong>
            <span>{t("来自真实项目经验")}</span>
          </div>
          <div className="trust-item">
            <strong>{t("长期")}</strong>
            <span>{t("随时回看持续学习")}</span>
          </div>
        </div>
      </section>

      <section className="section" id="courses">
        <div className="shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Selected courses</p>
              <h2>{t("从一个关键问题开始，完成一次真正的成长。")}</h2>
            </div>
            <p>{t("每门课程都围绕真实目标设计，用清晰章节、视频讲解与练习资料陪你完成学习。")}</p>
          </div>
          <div className="course-grid">
            {courses.slice(0, 3).map((course) => (
              <CourseCard course={course} key={course.id} />
            ))}
          </div>
        </div>
      </section>

      <section className="section feature-section" id="method">
        <div className="shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">How it works</p>
              <h2>{t("按自己的节奏，完成有结构的学习。")}</h2>
            </div>
          </div>
          <div className="feature-grid">
            {[
              ["01", t("看得懂"), t("每个复杂主题都被拆成清晰章节，并配合真实案例讲解。")],
              ["02", t("做得出"), t("课程附件、行动清单与练习，帮助知识真正进入工作。")],
              ["03", t("看得到"), t("自动记录学习进度，清楚知道待学习、学习中与已完成。")],
            ].map(([number, title, copy]) => (
              <article className="feature" key={number}>
                <span className="feature-number">{number}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="enroll">
        <div className="shell wechat-cta">
          <div>
            <p className="eyebrow" style={{ color: "var(--blue)" }}>
              Join the course
            </p>
            <h2>{t("准备好开始了吗？")}</h2>
            <p>{t("添加官方微信，告诉我们你感兴趣的课程。确认报名后，我们会为你开通学习账号。")}</p>
            <Link className="button" href="#enroll">
              <Sparkles size={17} /> {t("微信报名")}
            </Link>
            <div style={{ marginTop: 26, color: "#aab1c9", fontSize: 13 }}>
              <Check size={15} style={{ verticalAlign: "middle" }} />{" "}
              {t("人工确认课程与账号")}
            </div>
          </div>
          <div className="qr-placeholder">{t("官方微信二维码")}</div>
        </div>
      </section>
      <Footer />
    </>
  );
}
