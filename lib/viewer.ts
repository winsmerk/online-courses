import { redirect } from "next/navigation";
import { cache } from "react";
import type { Viewer } from "./types";
import { createClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/config";

const demoViewer: Viewer = {
  id: "demo-user",
  name: "陈默",
  email: "demo@zhixu.academy",
  role: "admin",
  demo: true,
};

export const getViewer = cache(async (): Promise<Viewer | null> => {
  if (!isSupabaseConfigured) return demoViewer;

  const supabase = await createClient();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, role")
    .eq("id", user.id)
    .single();

  return {
    id: user.id,
    email: user.email ?? "",
    name:
      profile?.display_name ??
      user.user_metadata?.display_name ??
      user.email?.split("@")[0] ??
      "学员",
    role: profile?.role === "admin" ? "admin" : "student",
  };
});

export async function requireViewer(next = "/dashboard") {
  const viewer = await getViewer();
  if (!viewer) redirect(`/login?next=${encodeURIComponent(next)}`);
  return viewer;
}

export async function requireAdmin() {
  const viewer = await requireViewer();
  if (viewer.role !== "admin") redirect("/dashboard");
  return viewer;
}
