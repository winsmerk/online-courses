import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server";
import { getViewer } from "@/lib/viewer";

const lessonSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  description: z.string(),
  durationMinutes: z.number().int().positive(),
  videoPath: z.string(),
  sortOrder: z.number().int().positive(),
  attachments: z.array(
    z.object({
      id: z.string().uuid(),
      filename: z.string().min(1),
      storagePath: z.string().min(1),
      sizeBytes: z.number().int().nonnegative(),
      mimeType: z.string().min(1),
    }),
  ),
});

const courseSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(2),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  subtitle: z.string().min(2),
  description: z.string().min(2),
  instructor: z.string().min(1),
  category: z.string().min(1),
  level: z.string().min(1),
  status: z.enum(["draft", "published"]),
  coverUrl: z.string(),
  introImageUrls: z.array(z.string().url()),
  chapters: z.array(
    z.object({
      id: z.string().uuid(),
      title: z.string().min(1),
      sortOrder: z.number().int().positive(),
      lessons: z.array(lessonSchema).min(1),
    }),
  ),
});

async function handleCourseRequest(
  request: Request,
  mode: "create" | "update",
) {
  const viewer = await getViewer();
  if (!viewer || viewer.role !== "admin" || viewer.demo) {
    return NextResponse.json({ error: "无权执行此操作" }, { status: 403 });
  }

  const parsed = courseSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "课程数据不完整" },
      { status: 400 },
    );
  }

  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json(
      { error: "服务端 Supabase 密钥尚未配置" },
      { status: 503 },
    );
  }

  const course = parsed.data;
  const durationMinutes = course.chapters.reduce(
    (sum, chapter) =>
      sum +
      chapter.lessons.reduce(
        (lessonSum, lesson) => lessonSum + lesson.durationMinutes,
        0,
      ),
    0,
  );

  const coursePayload = {
    title: course.title,
    slug: course.slug,
    subtitle: course.subtitle,
    description: course.description,
    instructor: course.instructor,
    category: course.category,
    level: course.level,
    status: course.status,
    cover_url: course.coverUrl || null,
    duration_minutes: durationMinutes,
  };
  const courseMutation =
    mode === "create"
      ? admin.from("courses").insert({
          id: course.id,
          ...coursePayload,
          created_by: viewer.id,
        })
      : admin
          .from("courses")
          .update(coursePayload)
          .eq("id", course.id)
          .select("id")
          .single();
  const { error: courseError } = await courseMutation;
  if (courseError) {
    return NextResponse.json({ error: courseError.message }, { status: 400 });
  }

  if (mode === "update") {
    const [{ error: imageDeleteError }, { error: chapterDeleteError }] =
      await Promise.all([
        admin.from("course_images").delete().eq("course_id", course.id),
        admin.from("chapters").delete().eq("course_id", course.id),
      ]);
    const deleteError = imageDeleteError ?? chapterDeleteError;
    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 400 });
    }
  }

  async function rollbackNewCourse() {
    if (mode === "create" && admin) {
      await admin.from("courses").delete().eq("id", course.id);
    }
  }

  const chapters = course.chapters.map((chapter) => ({
    id: chapter.id,
    course_id: course.id,
    title: chapter.title,
    sort_order: chapter.sortOrder,
  }));
  const { error: chapterError } = await admin.from("chapters").insert(chapters);
  if (chapterError) {
    await rollbackNewCourse();
    return NextResponse.json({ error: chapterError.message }, { status: 400 });
  }

  if (course.introImageUrls.length) {
    const { error: imageError } = await admin.from("course_images").insert(
      course.introImageUrls.map((imageUrl, index) => ({
        course_id: course.id,
        image_url: imageUrl,
        sort_order: index + 1,
      })),
    );
    if (imageError) {
      await rollbackNewCourse();
      return NextResponse.json({ error: imageError.message }, { status: 400 });
    }
  }

  const lessons = course.chapters.flatMap((chapter) =>
    chapter.lessons.map((lesson) => ({
      id: lesson.id,
      chapter_id: chapter.id,
      title: lesson.title,
      slug: `${course.slug}-${lesson.id.slice(0, 8)}`,
      description: lesson.description,
      duration_minutes: lesson.durationMinutes,
      video_path: lesson.videoPath || null,
      sort_order: lesson.sortOrder,
      is_preview: false,
    })),
  );
  const { error: lessonError } = await admin.from("lessons").insert(lessons);
  if (lessonError) {
    await rollbackNewCourse();
    return NextResponse.json({ error: lessonError.message }, { status: 400 });
  }

  const attachments = course.chapters.flatMap((chapter) =>
    chapter.lessons.flatMap((lesson) =>
      lesson.attachments.map((attachment) => ({
        id: attachment.id,
        lesson_id: lesson.id,
        filename: attachment.filename,
        storage_path: attachment.storagePath,
        size_bytes: attachment.sizeBytes,
        mime_type: attachment.mimeType,
      })),
    ),
  );
  if (attachments.length) {
    const { error: attachmentError } = await admin
      .from("attachments")
      .insert(attachments);
    if (attachmentError) {
      await rollbackNewCourse();
      return NextResponse.json(
        { error: attachmentError.message },
        { status: 400 },
      );
    }
  }

  return NextResponse.json(
    { id: course.id, slug: course.slug },
    { status: mode === "create" ? 201 : 200 },
  );
}

export async function POST(request: Request) {
  return handleCourseRequest(request, "create");
}

export async function PUT(request: Request) {
  return handleCourseRequest(request, "update");
}
