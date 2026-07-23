import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server";
import { getViewer } from "@/lib/viewer";
import { DEFAULT_STUDENT_PASSWORD } from "@/lib/auth-defaults";

const createStudentSchema = z.object({
  email: z.string().email("请输入有效邮箱"),
  password: z
    .string()
    .min(8, "密码至少需要 8 位")
    .default(DEFAULT_STUDENT_PASSWORD),
  displayName: z.string().trim().min(1, "请输入姓名"),
});

const updateStudentSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("assignCourses"),
    userId: z.string().uuid(),
    courseIds: z.array(z.string().uuid()),
  }),
  z.object({
    action: z.literal("resetPassword"),
    userId: z.string().uuid(),
    password: z.string().min(8, "密码至少需要 8 位"),
  }),
]);

async function getAdminContext() {
  const viewer = await getViewer();
  if (!viewer || viewer.role !== "admin" || viewer.demo) return null;
  const admin = createAdminClient();
  if (!admin) return null;
  return { admin };
}

export async function GET() {
  const context = await getAdminContext();
  if (!context) {
    return NextResponse.json({ error: "无权执行此操作" }, { status: 403 });
  }

  const [{ data: authData, error: authError }, { data: courses, error: courseError }] =
    await Promise.all([
      context.admin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
      context.admin
        .from("courses")
        .select("id, title, status")
        .eq("status", "published")
        .order("created_at", { ascending: false }),
    ]);

  if (authError || courseError) {
    return NextResponse.json(
      { error: authError?.message ?? courseError?.message ?? "数据加载失败" },
      { status: 400 },
    );
  }

  const userIds = authData.users.map((user) => user.id);
  const [{ data: profiles, error: profileError }, { data: enrollments, error: enrollmentError }] =
    userIds.length
      ? await Promise.all([
          context.admin
            .from("profiles")
            .select("id, display_name, role")
            .in("id", userIds),
          context.admin
            .from("enrollments")
            .select("user_id, course_id")
            .eq("status", "active")
            .in("user_id", userIds),
        ])
      : [{ data: [], error: null }, { data: [], error: null }];

  if (profileError || enrollmentError) {
    return NextResponse.json(
      {
        error:
          profileError?.message ??
          enrollmentError?.message ??
          "学员数据加载失败",
      },
      { status: 400 },
    );
  }

  const profileMap = new Map(
    (profiles ?? []).map((profile) => [profile.id, profile]),
  );
  const enrollmentMap = new Map<string, string[]>();
  for (const enrollment of enrollments ?? []) {
    const assigned = enrollmentMap.get(enrollment.user_id) ?? [];
    assigned.push(enrollment.course_id);
    enrollmentMap.set(enrollment.user_id, assigned);
  }

  const students = authData.users
    .filter((user) => profileMap.get(user.id)?.role !== "admin")
    .map((user) => {
      const profile = profileMap.get(user.id);
      return {
        id: user.id,
        email: user.email ?? "",
        displayName:
          profile?.display_name ??
          user.user_metadata?.display_name ??
          user.email?.split("@")[0] ??
          "学员",
        createdAt: user.created_at,
        lastSignInAt: user.last_sign_in_at,
        courseIds: enrollmentMap.get(user.id) ?? [],
      };
    });

  return NextResponse.json({ students, courses: courses ?? [] });
}

export async function POST(request: Request) {
  const context = await getAdminContext();
  if (!context) {
    return NextResponse.json({ error: "无权执行此操作" }, { status: 403 });
  }

  const parsed = createStudentSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "账号信息不完整" },
      { status: 400 },
    );
  }

  const { email, password, displayName } = parsed.data;
  const { data, error } = await context.admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { display_name: displayName },
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const { error: profileError } = await context.admin.from("profiles").upsert({
    id: data.user.id,
    display_name: displayName,
    role: "student",
  });
  if (profileError) {
    await context.admin.auth.admin.deleteUser(data.user.id);
    return NextResponse.json({ error: profileError.message }, { status: 400 });
  }

  return NextResponse.json({ id: data.user.id }, { status: 201 });
}

export async function PATCH(request: Request) {
  const context = await getAdminContext();
  if (!context) {
    return NextResponse.json({ error: "无权执行此操作" }, { status: 403 });
  }

  const parsed = updateStudentSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "提交信息不完整" },
      { status: 400 },
    );
  }

  if (parsed.data.action === "resetPassword") {
    const { error } = await context.admin.auth.admin.updateUserById(
      parsed.data.userId,
      { password: parsed.data.password },
    );
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  }

  const { userId, courseIds } = parsed.data;
  const uniqueCourseIds = [...new Set(courseIds)];
  if (uniqueCourseIds.length) {
    const { data: assignableCourses, error: assignableError } =
      await context.admin
        .from("courses")
        .select("id")
        .eq("status", "published")
        .in("id", uniqueCourseIds);

    if (assignableError) {
      return NextResponse.json(
        { error: assignableError.message },
        { status: 400 },
      );
    }
    if ((assignableCourses ?? []).length !== uniqueCourseIds.length) {
      return NextResponse.json(
        { error: "只能分配已发布的课程" },
        { status: 400 },
      );
    }
  }

  const { data: currentRows, error: currentError } = await context.admin
    .from("enrollments")
    .select("course_id, status")
    .eq("user_id", userId);

  if (currentError) {
    return NextResponse.json({ error: currentError.message }, { status: 400 });
  }

  const currentIds = new Set((currentRows ?? []).map((row) => row.course_id));
  const nextIds = new Set(uniqueCourseIds);
  const removals = [...currentIds].filter((courseId) => !nextIds.has(courseId));

  if (uniqueCourseIds.length) {
    const { error } = await context.admin.from("enrollments").upsert(
      uniqueCourseIds.map((courseId) => ({
        user_id: userId,
        course_id: courseId,
        status: "active",
      })),
      { onConflict: "user_id,course_id" },
    );
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }

  if (removals.length) {
    const { error } = await context.admin
      .from("enrollments")
      .delete()
      .eq("user_id", userId)
      .in("course_id", removals);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }

  return NextResponse.json({ ok: true });
}
