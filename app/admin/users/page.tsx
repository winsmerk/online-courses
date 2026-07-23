import { AdminUserManager } from "@/components/admin-user-manager";
import { getServerI18n } from "@/lib/i18n-server";

export default async function AdminUsersPage() {
  const { t } = await getServerI18n();
  return (
    <>
      <div className="dashboard-top">
        <div>
          <h1>{t("管理员账号")}</h1>
          <p>{t("创建后台管理员账号，并在需要时重设密码。")}</p>
        </div>
      </div>
      <AdminUserManager />
    </>
  );
}
