import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server";
import { getViewer } from "@/lib/viewer";

const createUserSchema = z.object({
  email: z.string().email("请输入有效邮箱"),
  password: z.string().min(8, "密码至少需要 8 位"),
  displayName: z.string().trim().min(1, "请输入姓名"),
  role: z.enum(["student", "admin"]),
});

const resetPasswordSchema = z.object({
  userId: z.string().uuid(),
  password: z.string().min(8, "密码至少需要 8 位"),
});

async function getAdminContext() {
  const viewer = await getViewer();
  if (!viewer || viewer.role !== "admin" || viewer.demo) return null;
  const admin = createAdminClient();
  if (!admin) return null;
  return { viewer, admin };
}

export async function GET() {
  const context = await getAdminContext();
  if (!context) {
    return NextResponse.json({ error: "无权执行此操作" }, { status: 403 });
  }

  const { data, error } = await context.admin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const ids = data.users.map((user) => user.id);
  const { data: profiles } = ids.length
    ? await context.admin
        .from("profiles")
        .select("id, display_name, role")
        .in("id", ids)
    : { data: [] };
  const profileMap = new Map(
    (profiles ?? []).map((profile) => [profile.id, profile]),
  );

  return NextResponse.json({
    users: data.users.map((user) => {
      const profile = profileMap.get(user.id);
      return {
        id: user.id,
        email: user.email ?? "",
        displayName:
          profile?.display_name ??
          user.user_metadata?.display_name ??
          user.email?.split("@")[0] ??
          "用户",
        role: profile?.role === "admin" ? "admin" : "student",
        createdAt: user.created_at,
        lastSignInAt: user.last_sign_in_at,
      };
    }),
  });
}

export async function POST(request: Request) {
  const context = await getAdminContext();
  if (!context) {
    return NextResponse.json({ error: "无权执行此操作" }, { status: 403 });
  }

  const parsed = createUserSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "账号信息不完整" },
      { status: 400 },
    );
  }

  const { email, password, displayName, role } = parsed.data;
  const { data, error } = await context.admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { display_name: displayName },
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const { error: profileError } = await context.admin
    .from("profiles")
    .upsert({
      id: data.user.id,
      display_name: displayName,
      role,
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

  const parsed = resetPasswordSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "密码信息不完整" },
      { status: 400 },
    );
  }

  const { error } = await context.admin.auth.admin.updateUserById(
    parsed.data.userId,
    { password: parsed.data.password },
  );
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
