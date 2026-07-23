import { isSupabaseConfigured } from "@/lib/supabase/config";

export function DemoBanner() {
  if (isSupabaseConfigured) return null;
  return (
    <div className="demo-banner">
      当前为演示模式：配置 Supabase 环境变量后将自动切换为真实数据与账号。
    </div>
  );
}
