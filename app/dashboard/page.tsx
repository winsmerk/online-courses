import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { DemoBanner } from "@/components/demo-banner";
import { getEnrollments } from "@/lib/data";
import { getServerI18n } from "@/lib/i18n-server";
import { requireViewer } from "@/lib/viewer";

export default async function DashboardPage() {
  const viewer = await requireViewer();
  const courses = await getEnrollments(viewer.id, viewer.role);
  const { t } = await getServerI18n();

  const stats = {
    all: courses.length,
    learning: courses.filter((course) => course.learningStatus === "学习中")
      .length,
    completed: courses.filter((course) => course.learningStatus === "已完成")
      .length,
  };

  return (
    <>
      <DemoBanner />
      <DashboardShell viewer={viewer}>
        <div className="dashboard-top">
          <div>
            <h1>{t("你好，{name}", { name: viewer.name })}</h1>
            <p>{t("继续今天的学习，把一点进步积累成长期能力。")}</p>
          </div>
          <div className="avatar">{viewer.name.slice(0, 1)}</div>
        </div>
        <section className="stats" aria-label={t("学习数据")}>
          <div className="stat">
            <span>{viewer.role === "admin" ? t("全部课程") : t("我的课程")}</span>
            <strong>{stats.all}</strong>
          </div>
          <div className="stat">
            <span>{t("学习中")}</span>
            <strong>{stats.learning}</strong>
          </div>
          <div className="stat">
            <span>{t("已完成")}</span>
            <strong>{stats.completed}</strong>
          </div>
        </section>
        <h2 style={{ fontFamily: "var(--font-serif)", marginBottom: 20 }}>
          {viewer.role === "admin" ? t("全部课程") : t("我的课程")}
        </h2>
        <section className="learning-list">
          {courses.map((course) => {
            const firstLesson = course.chapters[0]?.lessons[0];
            const statusClass =
              course.learningStatus === "已完成"
                ? "completed"
                : course.learningStatus === "学习中"
                  ? "in-progress"
                  : "not-started";
            return (
              <article className="learning-card" key={course.id}>
                <Image
                  src={course.coverUrl}
                  width={340}
                  height={220}
                  alt={course.title}
                />
                <div>
                  <span
                    className={`learning-status ${statusClass}`}
                    aria-label={t("学习状态：{status}", {
                      status: t(course.learningStatus),
                    })}
                  >
                    {t(course.learningStatus)}
                  </span>
                  <h3>{course.title}</h3>
                  <div className="progress-track">
                    <div
                      className="progress-value"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <span className="progress-label">
                    {t("已完成 {progress}%", { progress: course.progress })}
                  </span>
                </div>
                {firstLesson && (
                  <Link
                    className="button dark"
                    href={`/learn/${course.slug}/${firstLesson.id}`}
                  >
                    {course.progress ? t("继续学习") : t("开始学习")}
                    <ArrowRight size={16} />
                  </Link>
                )}
              </article>
            );
          })}
        </section>
      </DashboardShell>
    </>
  );
}
