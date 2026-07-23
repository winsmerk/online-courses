import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { DemoBanner } from "@/components/demo-banner";
import { getEnrollments } from "@/lib/data";
import { requireViewer } from "@/lib/viewer";

export default async function DashboardPage() {
  const viewer = await requireViewer();
  const courses = await getEnrollments(viewer.id, viewer.role);

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
            <h1>你好，{viewer.name}</h1>
            <p>继续今天的学习，把一点进步积累成长期能力。</p>
          </div>
          <div className="avatar">{viewer.name.slice(0, 1)}</div>
        </div>
        <section className="stats" aria-label="学习数据">
          <div className="stat">
            <span>{viewer.role === "admin" ? "全部课程" : "我的课程"}</span>
            <strong>{stats.all}</strong>
          </div>
          <div className="stat">
            <span>学习中</span>
            <strong>{stats.learning}</strong>
          </div>
          <div className="stat">
            <span>已完成</span>
            <strong>{stats.completed}</strong>
          </div>
        </section>
        <h2 style={{ fontFamily: "var(--font-serif)", marginBottom: 20 }}>
          {viewer.role === "admin" ? "全部课程" : "我的课程"}
        </h2>
        <section className="learning-list">
          {courses.map((course) => {
            const firstLesson = course.chapters[0]?.lessons[0];
            return (
              <article className="learning-card" key={course.id}>
                <Image
                  src={course.coverUrl}
                  width={340}
                  height={220}
                  alt={course.title}
                />
                <div>
                  <span className="filter-pill">{course.learningStatus}</span>
                  <h3>{course.title}</h3>
                  <div className="progress-track">
                    <div
                      className="progress-value"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <span className="progress-label">
                    已完成 {course.progress}%
                  </span>
                </div>
                {firstLesson && (
                  <Link
                    className="button dark"
                    href={`/learn/${course.slug}/${firstLesson.id}`}
                  >
                    {course.progress ? "继续学习" : "开始学习"}
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
