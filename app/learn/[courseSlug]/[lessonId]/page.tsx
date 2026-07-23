import Link from "next/link";
import { CheckCircle2, ChevronLeft, Circle, Play } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { canAccessCourse, getCourseBySlug } from "@/lib/data";
import { getServerI18n } from "@/lib/i18n-server";
import { requireViewer } from "@/lib/viewer";
import { createAdminClient } from "@/lib/supabase/server";
import { completeLesson } from "@/app/actions/progress";

async function getSignedVideoUrl(path?: string | null) {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const admin = createAdminClient();
  if (!admin) return null;
  const { data } = await admin.storage
    .from("course-videos")
    .createSignedUrl(path, 60 * 60);
  return data?.signedUrl ?? null;
}

async function getSignedAttachmentUrls(
  attachments: Array<{ id: string; filename: string; storagePath: string }>,
) {
  const admin = createAdminClient();
  if (!admin || !attachments.length) return [];
  return Promise.all(
    attachments.map(async (attachment) => {
      const { data } = await admin.storage
        .from("course-files")
        .createSignedUrl(attachment.storagePath, 60 * 15, {
          download: attachment.filename,
        });
      return { ...attachment, url: data?.signedUrl ?? null };
    }),
  );
}

export default async function LearnPage({
  params,
}: {
  params: Promise<{ courseSlug: string; lessonId: string }>;
}) {
  const viewer = await requireViewer();
  const { courseSlug, lessonId } = await params;
  const course = await getCourseBySlug(courseSlug);
  if (!course) notFound();
  const hasAccess = await canAccessCourse(viewer.id, course.id, viewer.role);
  if (!hasAccess) redirect("/dashboard");
  const lessons = course.chapters.flatMap((chapter) => chapter.lessons);
  const lesson = lessons.find((item) => item.id === lessonId);
  if (!lesson) notFound();
  const videoUrl = await getSignedVideoUrl(lesson.videoPath);
  const attachments = await getSignedAttachmentUrls(lesson.attachments ?? []);
  const { t } = await getServerI18n();

  return (
    <main className="learn-layout">
      <section className="learn-main">
        <div className="learn-topbar">
          <Link href="/dashboard" className="course-link">
            <ChevronLeft size={16} /> {t("返回我的学习")}
          </Link>
          <span style={{ color: "#9bb7a7", fontSize: 12 }}>
            {course.title}
          </span>
        </div>
        <div className="video-frame">
          {videoUrl ? (
            <video src={videoUrl} controls preload="metadata" />
          ) : (
            <div className="video-placeholder">
              <span className="play-circle">
                <Play size={28} fill="currentColor" />
              </span>
              <strong>{t("课程视频")}</strong>
              <p>{t("管理员上传视频后将在这里播放")}</p>
            </div>
          )}
        </div>
        <article className="lesson-copy">
          <p className="eyebrow" style={{ color: "var(--blue)" }}>
            Lesson
          </p>
          <h1>{lesson.title}</h1>
          <p>{lesson.description}</p>
          {attachments.length > 0 && (
            <div style={{ margin: "26px 0" }}>
              <strong>{t("课程附件")}</strong>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
                {attachments.map(
                  (attachment) =>
                    attachment.url && (
                      <a
                        className="button secondary"
                        href={attachment.url}
                        key={attachment.id}
                      >
                        {t("下载")} {attachment.filename}
                      </a>
                    ),
                )}
              </div>
            </div>
          )}
          <form action={completeLesson}>
            <input type="hidden" name="lessonId" value={lesson.id} />
            <input
              type="hidden"
              name="returnTo"
              value={`/learn/${course.slug}/${lesson.id}`}
            />
            <button className="button" type="submit">
              <CheckCircle2 size={16} /> {t("标记为已完成")}
            </button>
          </form>
        </article>
      </section>
      <aside className="learn-sidebar">
        <h2>{t("课程目录")}</h2>
        {course.chapters.map((chapter, chapterIndex) => (
          <section className="learn-chapter" key={chapter.id}>
            <strong>
              {t("第")} {chapterIndex + 1} {t("章")} · {chapter.title}
            </strong>
            {chapter.lessons.map((item) => (
              <Link
                key={item.id}
                href={`/learn/${course.slug}/${item.id}`}
                className={`learn-lesson ${
                  item.id === lesson.id ? "active" : ""
                }`}
              >
                {item.completed ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <Circle size={16} />
                )}
                <span>
                  {item.title}
                  <small
                    style={{ display: "block", color: "#8fac9c", marginTop: 3 }}
                  >
                    {item.durationMinutes} {t("分钟")}
                  </small>
                </span>
              </Link>
            ))}
          </section>
        ))}
      </aside>
    </main>
  );
}
