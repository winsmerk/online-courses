import Link from "next/link";
import { Plus } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { DemoBanner } from "@/components/demo-banner";
import { getCourses } from "@/lib/data";
import { requireAdmin } from "@/lib/viewer";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string }>;
}) {
  const viewer = await requireAdmin();
  const courses = await getCourses();
  const { created } = await searchParams;

  return (
    <>
      <DemoBanner />
      <DashboardShell viewer={viewer} active="admin">
        <div className="dashboard-top">
          <div>
            <h1>课程管理</h1>
            <p>创建课程、组织章节并上传视频。</p>
          </div>
          <Link className="button dark" href="/admin/courses/new">
            <Plus size={16} /> 新建课程
          </Link>
        </div>
        {created && (
          <p
            style={{
              marginTop: 28,
              padding: 14,
              borderRadius: 10,
              background: "#e4f7d8",
            }}
          >
            课程已成功创建。
          </p>
        )}
        <section className="stats">
          <div className="stat">
            <span>课程数量</span>
            <strong>{courses.length}</strong>
          </div>
          <div className="stat">
            <span>已发布</span>
            <strong>
              {courses.filter((course) => course.status === "published").length}
            </strong>
          </div>
          <div className="stat">
            <span>总课时</span>
            <strong>
              {courses.reduce(
                (total, course) =>
                  total +
                  course.chapters.reduce(
                    (count, chapter) => count + chapter.lessons.length,
                    0,
                  ),
                0,
              )}
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
                <span className="filter-pill">{course.status}</span>
                <h3>{course.title}</h3>
                <span className="progress-label">
                  {course.chapters.length} 个章节 · {course.instructor}
                </span>
              </div>
              <Link className="button secondary" href={`/courses/${course.slug}`}>
                查看
              </Link>
            </article>
          ))}
        </div>
      </DashboardShell>
    </>
  );
}
