import { AccountSettingsForm } from "@/components/account-settings-form";
import { DashboardShell } from "@/components/dashboard-shell";
import { getServerI18n } from "@/lib/i18n-server";
import { requireViewer } from "@/lib/viewer";

export default async function SettingsPage() {
  const viewer = await requireViewer("/settings");
  const { t } = await getServerI18n();

  return (
    <DashboardShell viewer={viewer}>
      <div className="dashboard-top">
        <div>
          <h1>{t("账号设置")}</h1>
          <p>{t("更新显示名称或修改登录密码。")}</p>
        </div>
      </div>
      <AccountSettingsForm
        userId={viewer.id}
        initialName={viewer.name}
        email={viewer.email}
      />
    </DashboardShell>
  );
}
