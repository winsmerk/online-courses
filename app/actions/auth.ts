"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getServerI18n } from "@/lib/i18n-server";

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/dashboard");
  const { t } = await getServerI18n();

  if (!isSupabaseConfigured) redirect("/dashboard");

  const supabase = await createClient();
  if (!supabase) {
    redirect(`/login?error=${encodeURIComponent(t("服务尚未配置"))}`);
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect(`/login?error=${encodeURIComponent(t("邮箱或密码不正确"))}`);
  }

  redirect(next.startsWith("/") ? next : "/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/");
}
