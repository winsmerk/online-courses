import type { Metadata } from "next";
import { CourseCard } from "@/components/course-card";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { getCourses } from "@/lib/data";
import { getServerI18n } from "@/lib/i18n-server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerI18n();
  return { title: t("全部课程") };
}

export default async function CoursesPage() {
  const courses = await getCourses();
  const { t } = await getServerI18n();

  return (
    <>
      <div style={{ background: "var(--ink)", color: "white" }}>
        <Header />
      </div>
      <section className="page-hero">
        <div className="shell">
          <p className="eyebrow" style={{ color: "var(--blue)" }}>
            Course library
          </p>
          <h1>{t("选择一个值得投入的方向，开始系统学习。")}</h1>
          <p>{t("每门课都提供清晰章节、视频讲解和课程附件，登录后自动保存学习进度。")}</p>
        </div>
      </section>
      <main className="section">
        <div className="shell">
          <div className="filters" aria-label={t("课程分类")}>
            <span className="filter-pill active">{t("全部课程")}</span>
            <span className="filter-pill">{t("品牌策略")}</span>
            <span className="filter-pill">{t("AI 效率")}</span>
            <span className="filter-pill">{t("沟通表达")}</span>
          </div>
          {courses.length ? (
            <div className="course-grid">
              {courses.map((course) => (
                <CourseCard course={course} key={course.id} />
              ))}
            </div>
          ) : (
            <div className="empty-state">{t("课程正在准备中，敬请期待。")}</div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
