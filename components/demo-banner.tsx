import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getServerI18n } from "@/lib/i18n-server";

export async function DemoBanner() {
  if (isSupabaseConfigured) return null;
  const { t } = await getServerI18n();
  return (
    <div className="demo-banner">
      {t("当前为演示模式：配置 Supabase 环境变量后将自动切换为真实数据与账号。")}
    </div>
  );
}
