"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { getViewer } from "@/lib/viewer";

export async function completeLesson(formData: FormData) {
  const lessonId = String(formData.get("lessonId") ?? "");
  const returnTo = String(formData.get("returnTo") ?? "/dashboard");
  const viewer = await getViewer();
  if (!viewer) redirect(`/login?next=${encodeURIComponent(returnTo)}`);

  if (isSupabaseConfigured) {
    const supabase = await createClient();
    if (supabase) {
      await supabase.from("lesson_progress").upsert(
        {
          user_id: viewer.id,
          lesson_id: lessonId,
          completed: true,
          progress_seconds: 0,
          last_viewed_at: new Date().toISOString(),
        },
        { onConflict: "user_id,lesson_id" },
      );
    }
  }

  const safeReturnTo = returnTo.startsWith("/") ? returnTo : "/dashboard";
  revalidatePath("/dashboard");
  revalidatePath(safeReturnTo);
  redirect(safeReturnTo);
}
