import Image from "next/image";
import Link from "next/link";
import { Check, Clock, Layers3, PlayCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { getCourseBySlug } from "@/lib/data";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const lessonCount = course.chapters.reduce(
    (sum, chapter) => sum + chapter.lessons.length,
    0,
  );

  return (
    <>
      <div style={{ background: "var(--ink)", color: "white" }}>
        <Header />
      </div>
      <section className="detail-hero">
        <div className="shell detail-grid">
          <div className="detail-copy">
            <p className="eyebrow" style={{ color: "var(--blue)" }}>
              {course.category} · {course.level}
            </p>
            <h1>{course.title}</h1>
            <p>{course.subtitle}</p>
            <div className="detail-facts">
              <span>
                <Layers3 size={15} /> {course.chapters.length} 章
              </span>
              <span>
                <PlayCircle size={15} /> {lessonCount} 节课
              </span>
              <span>
                <Clock size={15} /> {Math.round(course.durationMinutes / 60)}{" "}
                小时
              </span>
            </div>
            <Link className="button" href="/enroll">
              添加微信报名
            </Link>
          </div>
          <div className="detail-cover">
            <Image
              src={course.coverUrl}
              alt={course.title}
              width={900}
              height={760}
              priority
            />
          </div>
        </div>
      </section>

      <main className="section">
        <div className="shell detail-content">
          <div className="prose">
            <h2>关于这门课程</h2>
            <p>{course.description}</p>
            {course.introImages.map((image, index) => (
              <div
                key={image}
                style={{
                  position: "relative",
                  aspectRatio: "16 / 9",
                  overflow: "hidden",
                  borderRadius: 18,
                  marginTop: 28,
                }}
              >
                <Image
                  src={image}
                  alt={`${course.title}课程介绍图片 ${index + 1}`}
                  fill
                  sizes="(max-width: 980px) 100vw, 65vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
            ))}
            <div className="curriculum">
              <h2>课程目录</h2>
              {course.chapters.map((chapter) => (
                <section className="chapter" key={chapter.id}>
                  <h3>{chapter.title}</h3>
                  {chapter.lessons.map((lesson) => (
                    <div className="lesson-row" key={lesson.id}>
                      <span>
                        {lesson.isPreview ? "试看 · " : ""}
                        {lesson.title}
                      </span>
                      <span>{lesson.durationMinutes} 分钟</span>
                    </div>
                  ))}
                </section>
              ))}
            </div>
          </div>
          <aside className="detail-sidebar">
            <h3>你将获得</h3>
            <ul>
              <li>
                <Check size={16} /> 结构清晰的视频课程
              </li>
              <li>
                <Check size={16} /> 配套文档与练习附件
              </li>
              <li>
                <Check size={16} /> 永久记录学习进度
              </li>
              <li>
                <Check size={16} /> 随时回看，按自己的节奏学习
              </li>
            </ul>
            <Link className="button" href="/enroll">
              咨询并报名
            </Link>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
