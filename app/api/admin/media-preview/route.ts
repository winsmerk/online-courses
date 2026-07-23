import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { getViewer } from "@/lib/viewer";

export async function GET(request: Request) {
  const viewer = await getViewer();
  if (!viewer || viewer.role !== "admin" || viewer.demo) {
    return NextResponse.json({ error: "无权预览此视频" }, { status: 403 });
  }

  const path = new URL(request.url).searchParams.get("path")?.trim();
  if (!path) {
    return NextResponse.json({ error: "视频路径无效" }, { status: 400 });
  }

  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "视频服务尚未配置" }, { status: 503 });
  }

  const { data, error } = await admin.storage
    .from("course-videos")
    .createSignedUrl(path, 60 * 60);
  if (error || !data?.signedUrl) {
    return NextResponse.json(
      { error: error?.message ?? "视频预览地址生成失败" },
      { status: 400 },
    );
  }

  return NextResponse.json({ url: data.signedUrl });
}
