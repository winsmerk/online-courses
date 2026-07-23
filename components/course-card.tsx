import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Course } from "@/lib/types";
import { getServerI18n } from "@/lib/i18n-server";

export async function CourseCard({ course }: { course: Course }) {
  const { t } = await getServerI18n();
  const lessonCount = course.chapters.reduce(
    (sum, chapter) => sum + chapter.lessons.length,
    0,
  );

  return (
    <article className="course-card">
      <Link href={`/courses/${course.slug}`} aria-label={course.title}>
        <div className="course-cover">
          <Image
            src={course.coverUrl}
            alt={course.title}
            fill
            sizes="(max-width: 720px) 100vw, (max-width: 980px) 50vw, 33vw"
          />
          <span className="course-tag">{course.category}</span>
        </div>
        <div className="course-body">
          <div className="course-meta">
            <span>{course.instructor}</span>
            <span>
              {lessonCount} {t("节课")} ·{" "}
              {Math.round(course.durationMinutes / 60)} {t("小时")}
            </span>
          </div>
          <h3>{course.title}</h3>
          <p>{course.subtitle}</p>
          <span className="course-link">
            {t("查看课程")} <ArrowUpRight size={15} />
          </span>
        </div>
      </Link>
    </article>
  );
}
