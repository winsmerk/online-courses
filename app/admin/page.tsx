import Link from "next/link";
import { Plus } from "lucide-react";
import { getAdminCourseSummaries } from "@/lib/data";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string }>;
}) {
  const courses = await getAdminCourseSummaries();
  const { created } = await searchParams;

  return (
    <>
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
                <span className="filter-pill">{course.status}</span>
                <h3>{course.title}</h3>
                <span className="progress-label">
                  {course.chapterCount} 个章节 · {course.lessonCount} 节课 ·{" "}
                  {course.instructor}
                </span>
              </div>
              <Link
                className="button secondary"
                href={`/courses/${encodeURIComponent(course.slug)}`}
                prefetch
              >
                查看课程详情
              </Link>
            </article>
          ))}
        </div>
    </>
  );
}
