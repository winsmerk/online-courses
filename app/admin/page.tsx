import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { getAdminCourseSummaries } from "@/lib/data";
import { getServerI18n } from "@/lib/i18n-server";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; updated?: string }>;
}) {
  const courses = await getAdminCourseSummaries();
  const { created, updated } = await searchParams;
  const { t } = await getServerI18n();

  return (
    <>
        <div className="dashboard-top">
          <div>
            <h1>{t("课程管理")}</h1>
            <p>{t("创建课程、组织章节并上传视频。")}</p>
          </div>
          <Link className="button dark" href="/admin/courses/new">
            <Plus size={16} /> {t("新建课程")}
          </Link>
        </div>
        {(created || updated) && (
          <p
            style={{
              marginTop: 28,
              padding: 14,
              borderRadius: 10,
              background: "#e4f7d8",
            }}
          >
            {updated ? t("课程已成功更新。") : t("课程已成功创建。")}
          </p>
        )}
        <section className="stats">
          <div className="stat">
            <span>{t("课程数量")}</span>
            <strong>{courses.length}</strong>
          </div>
          <div className="stat">
            <span>{t("已发布")}</span>
            <strong>
              {courses.filter((course) => course.status === "published").length}
            </strong>
          </div>
          <div className="stat">
            <span>{t("总课时")}</span>
            <strong>
              {courses.reduce((total, course) => total + course.lessonCount, 0)}
            </strong>
          </div>
        </section>
        <div className="learning-list">
          {courses.map((course) => (
            <article
              className="learning-card"
              style={{ gridTemplateColumns: "1fr auto" }}
              key={course.id}
            >
              <div>
                <span className={`course-status ${course.status}`}>
                  {course.status === "published" ? t("已发布") : t("草稿")}
                </span>
                <h3>{course.title}</h3>
                <span className="progress-label">
                  {course.chapterCount} {t("个章节")} · {course.lessonCount}{" "}
                  {t("节课")} ·{" "}
                  {course.instructor}
                </span>
              </div>
              <div className="course-admin-actions">
                <Link
                  className="button secondary"
                  href={`/admin/courses/${course.id}/edit`}
                  prefetch
                >
                  <Pencil size={15} /> {t("编辑")}
                </Link>
                <Link
                  className="button secondary"
                  href={`/courses/${encodeURIComponent(course.slug)}`}
                  prefetch
                >
                  {t("查看详情")}
                </Link>
              </div>
            </article>
          ))}
        </div>
    </>
  );
}
