import { demoCourses, demoEnrollments } from "./demo-data";
import { createClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/config";
import type { Chapter, Course, EnrollmentCourse } from "./types";

export type AdminCourseSummary = {
  id: string;
  slug: string;
  title: string;
  instructor: string;
  status: "draft" | "published";
  chapterCount: number;
  lessonCount: number;
};

type CourseRow = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  cover_url: string | null;
  instructor: string | null;
  category: string | null;
  level: string | null;
  duration_minutes: number | null;
  status: "draft" | "published";
  course_images?: Array<{
    id: string;
    image_url: string;
    sort_order: number;
  }>;
  chapters?: Array<{
    id: string;
    title: string;
    sort_order: number;
      lessons?: Array<{
      id: string;
      slug: string;
      title: string;
      description: string | null;
      duration_minutes: number | null;
      video_path: string | null;
      is_preview: boolean | null;
        sort_order: number;
        attachments?: Array<{
          id: string;
          filename: string;
          storage_path: string;
          size_bytes: number;
          mime_type: string | null;
        }>;
    }>;
  }>;
};

function mapCourse(row: CourseRow): Course {
  const chapters: Chapter[] = (row.chapters ?? [])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      sortOrder: chapter.sort_order,
      lessons: (chapter.lessons ?? [])
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((lesson) => ({
          id: lesson.id,
          slug: lesson.slug,
          title: lesson.title,
          description: lesson.description ?? "",
          durationMinutes: lesson.duration_minutes ?? 0,
          videoPath: lesson.video_path,
          isPreview: lesson.is_preview ?? false,
          attachments: lesson.attachments?.map((attachment) => ({
            id: attachment.id,
            filename: attachment.filename,
            storagePath: attachment.storage_path,
            sizeBytes: attachment.size_bytes,
            mimeType: attachment.mime_type ?? "application/octet-stream",
          })),
        })),
    }));

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle ?? "",
    description: row.description ?? "",
    coverUrl:
      row.cover_url ??
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=85",
    introImages: (row.course_images ?? [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((image) => image.image_url),
    instructor: row.instructor ?? "Beyond Wild 讲师",
    category: row.category ?? "通识",
    level: row.level ?? "通用",
    durationMinutes: row.duration_minutes ?? 0,
    status: row.status,
    chapters,
  };
}

export async function getCourses(): Promise<Course[]> {
  if (!isSupabaseConfigured) return demoCourses;

  const supabase = await createClient();
  if (!supabase) return demoCourses;
  const { data, error } = await supabase
    .from("courses")
    .select("*, course_images(*), chapters(*, lessons(*, attachments(*)))")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Unable to load courses", error.message);
    return [];
  }
  return (data as CourseRow[]).map(mapCourse);
}

export async function getAdminCourseSummaries(): Promise<AdminCourseSummary[]> {
  if (!isSupabaseConfigured) {
    return demoCourses.map((course) => ({
      id: course.id,
      slug: course.slug,
      title: course.title,
      instructor: course.instructor,
      status: course.status,
      chapterCount: course.chapters.length,
      lessonCount: course.chapters.reduce(
        (total, chapter) => total + chapter.lessons.length,
        0,
      ),
    }));
  }

  const supabase = await createClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("courses")
    .select("id, slug, title, instructor, status, chapters(id, lessons(id))")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Unable to load admin course summaries", error.message);
    return [];
  }

  return data.map((course) => ({
    id: course.id,
    slug: course.slug,
    title: course.title,
    instructor: course.instructor ?? "",
    status: course.status,
    chapterCount: course.chapters?.length ?? 0,
    lessonCount:
      course.chapters?.reduce(
        (total, chapter) => total + (chapter.lessons?.length ?? 0),
        0,
      ) ?? 0,
  }));
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  if (!isSupabaseConfigured) {
    return demoCourses.find((course) => course.slug === slug) ?? null;
  }

  const supabase = await createClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("courses")
    .select("*, course_images(*), chapters(*, lessons(*, attachments(*)))")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return mapCourse(data as CourseRow);
}

export async function getCourseById(id: string): Promise<Course | null> {
  if (!isSupabaseConfigured) {
    return demoCourses.find((course) => course.id === id) ?? null;
  }

  const supabase = await createClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("courses")
    .select("*, course_images(*), chapters(*, lessons(*, attachments(*)))")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return mapCourse(data as CourseRow);
}

export async function getEnrollments(
  userId: string,
): Promise<EnrollmentCourse[]> {
  if (!isSupabaseConfigured) return demoEnrollments;

  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("enrollments")
    .select("course:courses(*, course_images(*), chapters(*, lessons(*, attachments(*))))")
    .eq("user_id", userId)
    .eq("status", "active");

  if (error || !data) return [];

  const courses = data
    .map((item) => item.course)
    .filter(Boolean)
    .map((row) => mapCourse(row as unknown as CourseRow));

  const lessonIds = courses.flatMap((course) =>
    course.chapters.flatMap((chapter) =>
      chapter.lessons.map((lesson) => lesson.id),
    ),
  );

  const { data: progressRows } = await supabase
    .from("lesson_progress")
    .select("lesson_id, completed")
    .eq("user_id", userId)
    .in("lesson_id", lessonIds.length ? lessonIds : ["00000000-0000-0000-0000-000000000000"]);

  const completedIds = new Set(
    (progressRows ?? [])
      .filter((row) => row.completed)
      .map((row) => row.lesson_id),
  );

  return courses.map((course) => {
    const allLessons = course.chapters.flatMap((chapter) => chapter.lessons);
    const completed = allLessons.filter((lesson) =>
      completedIds.has(lesson.id),
    ).length;
    const progress = allLessons.length
      ? Math.round((completed / allLessons.length) * 100)
      : 0;
    return {
      ...course,
      progress,
      learningStatus:
        progress === 0 ? "待学习" : progress === 100 ? "已完成" : "学习中",
    };
  });
}
